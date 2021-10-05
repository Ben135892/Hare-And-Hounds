import React from 'react';
import { Text, View } from 'react-native';
import Players from '../types/Players';
import Player from '../interfaces/Player';

interface Props {
    players: Players
}

const PlayerList: React.FC<Props> = ({ players }) => {
    return (
        <View>
            {players.map((player: Player) => (
                <Text key={player.id}>{player.name}</Text>
            ))}
        </View>
    )
}

export default PlayerList;

