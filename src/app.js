const app = require('express')();
const http = require('http').createServer(app);
const db = require('./db');
const randomize = require('randomatic');

const port = process.env.PORT || 3000;
const io = require('socket.io')(http);
http.listen(port, () => console.log('listening on port ' + port));

// in seconds
const LOCATION_UPDATE_INTERVAL = 180;
const LOCATION_SHOW_TIME = 10; 
const NAME_LENGTH = 20; // NAME IN DB IS VARCHAR(20)

app.get('/', (req, res) => {
    res.send('Hello World');
});

const getPlayers = async (gameID) => {
    return (await db.query('SELECT * FROM players WHERE GAME_ID=$1 ORDER BY ID ASC', [ gameID ])).rows;
} 

const getRunnerLocation = async (gameID, roundNumber) => {
    try {
        const gameRows = (await db.query('SELECT * FROM games WHERE ID=$1', [ gameID ])).rows;
        if (gameRows.length === 0) { // game doesn't exist anymore
            return;
        }
        let game = gameRows[0];
        if (!game.has_started || game.runner_been_found || game.round_number !== roundNumber) {
            return;
        }
        io.in(gameID).emit('set-runner-location', { latitude: game.runner_last_latitude, longitude: game.runner_last_longitude });
        game = (await db.query('UPDATE games SET LOCATION_UPDATE_NUMBER=LOCATION_UPDATE_NUMBER+1 WHERE ID=$1 RETURNING *', [ gameID ])).rows[0];
        io.in(gameID).emit('set-game', game);
        setTimeout(() => getRunnerLocation(gameID, roundNumber), game.location_update_interval * 1000);
        setTimeout(() => io.in(gameID).emit('remove-runner-location'), game.location_show_time * 1000);
    } catch(err) {
        console.log(err);
    }
}

const leaveGame = async (socket, player) => {
    try {
        const gameID = player.game_id;
        socket.emit('set-game', null);
        socket.emit('set-players', null);
        socket.leave(gameID);
        if (player.is_hosting) {
            // delete game
            await db.query('DELETE FROM games WHERE ID=$1', [ gameID ]);
            io.in(gameID).emit('set-game', null);
            io.in(gameID).emit('set-players', null);
        } else {
            const game = (await db.query('SELECT * FROM games WHERE ID=$1', [ gameID ])).rows[0];
            if (player.is_runner && game.has_started) {
                // end game
                const game = (await db.query('UPDATE games SET HAS_STARTED=false WHERE id=$1 RETURNING *', [gameID])).rows[0];
                io.in(gameID).emit('set-game', game);
            }
            await db.query('DELETE FROM players WHERE ID=$1', [ player.id ]);
            io.in(gameID).emit('set-players', await getPlayers(gameID));
        }
    } catch(err) {
        console.log(err);
    }
}

io.on('connection', (socket) => {
    socket.on('create', async (name) => {
        try {
            if (name.length > NAME_LENGTH) {
                name = name.substring(0, NAME_LENGTH); 
            }
            const gameID = randomize('A0', 6);
            const game = (await db.query(`INSERT INTO games (ID, HAS_STARTED, RUNNER_BEEN_FOUND, ROUND_NUMBER, LOCATION_UPDATE_NUMBER,
                                            LOCATION_UPDATE_INTERVAL, LOCATION_SHOW_TIME, RUNNER_LAST_LATITUDE, RUNNER_LAST_LONGITUDE) 
                                            VALUES ($1, FALSE, FALSE, 0, 0, $2, $3, 0, 0) RETURNING *`, 
                                            [ gameID, LOCATION_UPDATE_INTERVAL, LOCATION_SHOW_TIME ])).rows[0];
            // create player
            const players = (await db.query(`INSERT INTO players (NAME, SOCKET_ID, IS_RUNNER, IS_HOSTING, GAME_ID) 
                                                VALUES ($1, $2, TRUE, TRUE, $3) RETURNING * `, 
                                                [ name, socket.id, gameID ])).rows;
            socket.join(gameID);
            socket.emit('set-players', players);
            socket.emit('set-game', game);
        } catch (err) {
            console.log(err);
        }
    });

    socket.on('join', async ({ name, gameID }) => {
        try {
            if (name.length > NAME_LENGTH) {
                name = name.substring(0, NAME_LENGTH);
            }
            await db.query(`INSERT INTO players (NAME, SOCKET_ID, IS_RUNNER, IS_HOSTING, GAME_ID) 
                                                    VALUES ($1, $2, FALSE, FALSE, $3)`, 
                                                    [ name, socket.id, gameID ]);
            const players = await getPlayers(gameID);
            socket.emit('set-game', (await db.query('SELECT * FROM games WHERE ID=$1', [ gameID ])).rows[0]);
            socket.join(gameID);
            io.in(gameID).emit('set-players', players);
        } catch(err) {
            console.log(err);
            socket.emit('join-error', 'Error: Invalid ID');
        }
    });

    socket.on('change-runner', async ({ gameID, playerID }) => {
        try {
            await db.query('UPDATE players SET IS_RUNNER=FALSE WHERE GAME_ID=$1', [ gameID ]);
            await db.query('UPDATE players SET IS_RUNNER=TRUE WHERE ID=$1', [ playerID ]);
            io.in(gameID).emit('set-players', await getPlayers(gameID));
        }
        catch(err) {
            console.log(err);
        }
    });

    socket.on('start', async ({ gameID, locationUpdateInterval }) => {
        try {
            const game = (await db.query(`UPDATE games SET (ROUND_NUMBER, HAS_STARTED, RUNNER_BEEN_FOUND, LOCATION_UPDATE_NUMBER, LOCATION_UPDATE_INTERVAL)=
                                                (ROUND_NUMBER+1, TRUE, FALSE, 0, $1) WHERE ID=$2 RETURNING *`, [ locationUpdateInterval, gameID ])).rows[0];
            io.in(gameID).emit('set-game', game);
            setTimeout(() => getRunnerLocation(gameID, game.round_number), game.location_update_interval * 1000);
        } catch(err) {
            console.log(err);
        }
    });

    socket.on('update-runner-location', async ({ location, gameID }) => {
        try {
            const game = (await db.query('SELECT * FROM games WHERE ID=$1', [ gameID ])).rows[0];
            if (game.runner_been_found) {
                // send location to other players
                io.in(gameID).emit('set-runner-location', location);
            } else {
                await db.query('UPDATE games SET (RUNNER_LAST_LATITUDE, RUNNER_LAST_LONGITUDE)=($1, $2) WHERE ID=$3', 
                                    [ location.latitude, location.longitude, game.id ]);
            }
        } catch(err) {
            console.log(err);
        }
    });

    socket.on('runner-found', async (gameID) => {
        const game = (await db.query('UPDATE games SET RUNNER_BEEN_FOUND=TRUE WHERE ID=$1 RETURNING *', [ gameID ])).rows[0];
        io.in(gameID).emit('set-game', game);
        // send runner location to other players
        socket.broadcast.to(gameID).emit('set-runner-location', { latitude: game.runner_last_latitude, longitude: game.runner_last_longitude });
    });

    socket.on('end-game', async (gameID) => {
        const game = (await db.query('UPDATE games SET HAS_STARTED=FALSE WHERE ID=$1 RETURNING *', [ gameID ])).rows[0];
        io.in(gameID).emit('set-game', game);
    });

    socket.on('leave', async (playerID) => {
        try {
            socket.emit('set-game', null);
            socket.emit('set-players', null);
            const player = (await db.query('SELECT * FROM players WHERE ID=$1', [ playerID ])).rows[0];
            await leaveGame(socket, player);
        } catch(err) {
            console.log(err);
        }
    });

    socket.on('disconnect', async () => {
        try {
            // find player from socket id
            const playerRows = (await db.query('SELECT * FROM players WHERE SOCKET_ID=$1', [ socket.id ])).rows;
            if (playerRows.length === 0) {
                return;
            }
            await leaveGame(socket, playerRows[0]);
        } catch(err) {
            console.log(err);
        }
    });
});
