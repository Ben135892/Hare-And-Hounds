import React, { useState, useEffect, useRef } from 'react'
import { AppState, AppStateStatus, StyleSheet, Text, View } from 'react-native'
import Game from '../interfaces/Game';
import globalStyles from '../styles/globalStyles'

interface Props {
    game: Game,
    time: number
}

const Timer: React.FC<Props> = ({ game, time }) => {
    const appState = useRef(AppState.currentState);
    const [timer, setTimer] = useState<number>(time);
    const [startTime, setStartTime] = useState<number | null>(new Date().getTime());
    const _handleAppStateChange = (nextAppState: AppStateStatus) => {
        if (appState.current.match(/inactive|background/) && nextAppState === 'active') {
            // app been opened in foreground
            if (startTime !== null) {
                const timeDiff = (new Date().getTime() - startTime) / 1000;
                setTimer(time - timeDiff);
            }
        } 
        appState.current = nextAppState;
    }
    useEffect(() => {
        AppState.addEventListener('change', _handleAppStateChange);
        return () => {
            AppState.removeEventListener('change', _handleAppStateChange);
        };
    });
    useEffect(() => {
        const interval = setInterval(() => {
            setTimer(timer => timer - 0.1);
        }, 100);
        return () => clearInterval(interval);
    }, [game.location_update_number, appState.current]);
    useEffect(() => {
        setTimer(time);
        setStartTime(new Date().getTime());
    }, [game.location_update_number]);
    return (
        <Text style={globalStyles.bold}>{ Math.ceil(timer) }</Text>
    );
}

const styles = StyleSheet.create({})

export default Timer;
