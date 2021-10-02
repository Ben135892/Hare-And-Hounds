import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, Text, View, Dimensions, Button } from 'react-native';
import * as Location from 'expo-location';
import * as TaskManager from 'expo-task-manager';
import Direction from './Direction';
import Timer from './Timer';
import Game from '../interfaces/Game';
import Player from '../interfaces/Player';
import LocationType from '../interfaces/Location';
import Players from '../types/Players';
import socket from '../socketConfig';

interface Props {
    game: Game,
    players: Players
}

let gameID: string | null = null;
const LOCATION_TRACKING = 'location-tracking';

const watchLocation = async () => {
    await Location.startLocationUpdatesAsync(LOCATION_TRACKING, {
        accuracy: Location.Accuracy.Highest,
        timeInterval: 3000,
        distanceInterval: 0,
        foregroundService: {
            notificationTitle: 'Using your location',
            notificationBody: 'Needed by App to track location in background'
        }
    });
}

const MainGame: React.FC<Props> = ({ game, players }) => {
    const player: Player = players.find(player => player.socket_id === socket.id)!;
    const [runnerLocation, setRunnerLocation] = useState<LocationType | null>(null);
    const [beenFoundPressed, setBeenFoundPressed] = useState(false);
    const [gameOverPressed, setGameOverPressed] = useState(false);
    const beenFoundHandler = () => {
        socket.emit('runner-found', game.id);
        setBeenFoundPressed(true);
    }
    const gameOverHandler = () => {
        socket.emit('end-game', game.id);
        setGameOverPressed(true);
    }
    useEffect(() => {
        gameID = game.id;
        if (player.is_runner) {
            watchLocation();
        } 
        socket.on('set-runner-location', async (runnerLocation: LocationType) => {
            setRunnerLocation(runnerLocation);
        });
        return () => {
            if (player.is_runner) {
                (async () => {
                    if (await Location.hasStartedLocationUpdatesAsync(LOCATION_TRACKING)) {
                        await Location.stopLocationUpdatesAsync(LOCATION_TRACKING);
                    }
                })();
            }
            socket.off('set-runner-location');
        }
    }, []);
    useEffect(() => {
        socket.on('remove-runner-location', () => {
            if (!game.runner_been_found) {
                setRunnerLocation(null);
            }
        });
        return () => socket.off('remove-runner-location');
    }, [game.runner_been_found]);
    return (
        <View style={styles.container}>
            {!game.runner_been_found &&
                <Text>
                    Next Location Update: <Timer game={game} time={game.location_update_interval} />
                </Text>}
            {!game.runner_been_found && runnerLocation && 
                <Text>
                    Showing Location for: <Timer game={game} time={game.location_show_time} />
                </Text>}
            {game.runner_been_found && <Text>Runner has been found! Showing direction back to runner</Text>}
            {!player.is_runner && runnerLocation && <Direction runnerLocation={runnerLocation} />}
            {player.is_runner && !beenFoundPressed && (
                <Button title='End Game' onPress={beenFoundHandler} />
            )}
            {player.is_runner && game.runner_been_found && !gameOverPressed && (
                <Button title='Back to Lobby' onPress={gameOverHandler} />
            )}
                
        </View>
    )    
}

const styles = StyleSheet.create({
    container: {
        marginTop: 40
    },
});

TaskManager.defineTask(LOCATION_TRACKING, async ({ data, error }: { data: any, error: any }) => {
    if (error) {
        console.log('LOCATION_TRACKING TASK ERROR: ', error);
        return;
    }
    if (data && gameID !== null) {
        const { locations } = data;
        const location = { latitude: locations[0].coords.latitude, longitude: locations[0].coords.longitude };
        socket.emit('update-runner-location', { location, gameID });
    }
});   

export default MainGame;
