import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Button from './Button';
import StartButton from './StartButton';
import PlayerList from './PlayerList';
import Game from '../interfaces/Game';
import Player from '../interfaces/Player';
import Players from '../types/Players';
import socket from '../socketConfig';
import globalStyles from '../styles/globalStyles';

interface Props {
    game: Game,
    players: Players
}

const Lobby: React.FC<Props> = ({ game, players }) => {
    const player: Player = players.find(player => player.socket_id === socket.id)!;
    return (
        <View style={styles.container}>
            <Text style={globalStyles.header}>Game ID: <Text style={globalStyles.bold}>{game.id}</Text></Text>
            <Text style={[globalStyles.header, globalStyles.bold]}>Players: </Text>
            <PlayerList players={players} />
            {player.is_hosting && <StartButton gameID={game.id} />}
            <Button title='Leave' onPress={() => socket.emit('leave', player.id)} />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        marginTop: 50,
        alignItems: 'center',
        flex: 1
    }
});

export default Lobby;

