import React, { useState, useEffect } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import socket from '../socketConfig';
import Game from '../interfaces/Game';

interface Props {
    game: Game,
    time: number
}

const Timer: React.FC<Props> = ({ game, time }) => {
    const [timer, setTimer] = useState<number>(time);
    useEffect(() => {
        setTimer(time);
        const interval = setInterval(() => {
            setTimer(timer => timer - 1)
        }, 1000);
        return () => clearInterval(interval);
    }, [game.location_update_number]);
    return (
        <Text>Updating Runner Location in { timer } seconds</Text>
    );
}

const styles = StyleSheet.create({})

export default Timer;
