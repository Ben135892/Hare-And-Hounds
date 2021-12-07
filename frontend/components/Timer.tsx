import React, { useState, useEffect, useRef } from 'react'
import { AppState, AppStateStatus, StyleSheet, Text, View } from 'react-native'
import globalStyles from '../styles/globalStyles'

interface Props {
    time: number
}

const Timer: React.FC<Props> = ({ time }) => {
    const appState = useRef(AppState.currentState);
    const [timer, setTimer] = useState<number>(time);
    const [startTime, setStartTime] = useState<number>(new Date().getTime());
    const getTimerValue = () => {
        const timeDiff = (new Date().getTime() - startTime) / 1000;
        setTimer(time - timeDiff);
    }
    const _handleAppStateChange = (nextAppState: AppStateStatus) => {
        if (appState.current.match(/inactive|background/) && nextAppState === 'active') {
            // app been opened in foreground
            getTimerValue();
        } 
        appState.current = nextAppState;
    }
    const formatTime = (timer: number) => {
        const minutes = Math.floor(timer / 60);
        const seconds = timer % 60;
        return (minutes > 0 ? minutes + ':' : '') + (minutes > 0 && seconds < 10 ? '0' + seconds : seconds);
    }
    useEffect(() => {
        AppState.addEventListener('change', _handleAppStateChange);
        return () => {
            AppState.removeEventListener('change', _handleAppStateChange);
        };
    });
    useEffect(() => {
        setStartTime(new Date().getTime());
        const interval = setInterval(() => {
            getTimerValue();
        }, 100);
        return () => clearInterval(interval);
    }, []);
    return (
        <Text style={globalStyles.bold}>{ formatTime(Math.ceil(timer)) }</Text>
    );
}

const styles = StyleSheet.create({})

export default Timer;
