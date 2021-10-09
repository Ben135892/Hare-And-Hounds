import React from 'react';
import { ScrollView, ScrollViewBase, Text, View, StyleSheet, TouchableOpacity } from 'react-native';
import Players from '../types/Players';
import Player from '../interfaces/Player';
import globalStyles from '../styles/globalStyles';
import socket from '../socketConfig';

interface Props {
    players: Players,
    isHosting: Boolean,
    gameID: string
}

const PlayerList: React.FC<Props> = ({ players, isHosting, gameID }) => {
    let itemNumber = 0;
    return (
        <View style={styles.container}>
            <ScrollView>
                <View style={styles.list}>
                    {players.map((player: Player) => {
                        console.log(player.id);
                        itemNumber++;
                        return isHosting ? (
                            <TouchableOpacity key={player.id} onPress={() => socket.emit('change-runner', { playerID: player.id, gameID })}>
                                <Text style={styles.item}>{`${itemNumber}. ${player.name + (player.is_runner ? ' (runner)' : '')}`}</Text>
                            </TouchableOpacity>
                        ) : (
                            <Text key={player.id} style={styles.item}>{`${itemNumber}. ${player.name + (player.is_runner ? ' (runner)' : '')}`}</Text>
                        )
                    })}
                </View>
            </ScrollView>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 0.5,
        padding: 20,
        alignSelf: 'stretch'
    },
    list: {
        alignItems: 'center',
    },
    item: {
        margin: 5,
        fontSize: 20,
        fontWeight: 'bold'
    }
});

export default PlayerList;

