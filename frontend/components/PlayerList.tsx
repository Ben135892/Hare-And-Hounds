import React from 'react';
import { ScrollView, ScrollViewBase, Text, View, StyleSheet } from 'react-native';
import Players from '../types/Players';
import Player from '../interfaces/Player';
import globalStyles from '../styles/globalStyles';

interface Props {
    players: Players
}

const PlayerList: React.FC<Props> = ({ players }) => {
    return (
        <View style={styles.container}>
            <ScrollView>
                <View style={styles.list}>
                    {players.map((player: Player) => (
                        <Text style={styles.item} key={player.id}>{player.name}</Text>
                    ))}
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

