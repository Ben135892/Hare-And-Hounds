import React from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';
import StartButton from './StartButton';
import Game from '../interfaces/Game';
import Player from '../interfaces/Player';
import Players from '../types/Players';
import socket from '../socketConfig';

interface Props {
    game: Game,
    players: Players
}

const Lobby: React.FC<Props> = ({ game, players }) => {
    const player: Player = players.find(player => player.socket_id === socket.id)!;
    return (
        <View style={styles.lobby}>
            <Text>Game ID: {game.id}</Text>
            {players.map((player) => (
                <Text key={player.id}>{player.name}</Text>
            ))}
            {player.is_hosting && <StartButton gameID={game.id} />}
            <Button title='Leave' onPress={() => socket.emit('leave', player.id)} />
        </View>
    )
}

const styles = StyleSheet.create({
    lobby: {
        marginTop: 100,
    }
});

export default Lobby;

