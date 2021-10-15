import React, { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Slider from './Slider';
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
    const [locationUpdateInterval, setLocationUpdateInterval] = useState(game.location_update_interval);
    const player: Player = players.find(player => player.socket_id === socket.id)!;
    const runner: Player = players.find(player => player.is_runner)!;
    return (
        <View style={styles.container}>
            <Text style={globalStyles.header}>Game ID: <Text style={globalStyles.bold}>{game.id}</Text></Text>
            <Text style={[globalStyles.header, globalStyles.bold]}>Players: </Text>
            <PlayerList players={players} isHosting={player.is_hosting} gameID={game.id} />
            {player.is_hosting && <Text style={globalStyles.text}>Tap on player name to select runner</Text>}
            <Text style={globalStyles.text}>{ player.is_runner ? 'You are the runner' : 'Runner: ' + runner.name }</Text>
            {player.is_hosting && <Slider locationUpdateInterval={locationUpdateInterval} setLocationUpdateInterval={setLocationUpdateInterval} />}
            {player.is_hosting && <StartButton gameID={game.id} locationUpdateInterval={locationUpdateInterval} />}
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

