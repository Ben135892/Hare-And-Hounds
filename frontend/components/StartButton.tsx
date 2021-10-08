import React, { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Button from './Button';
import socket from '../socketConfig';

interface Props {
    gameID: string
}

const StartButton: React.FC<Props> = ({ gameID }) => {
    const [pressed, setPressed] = useState(false);
    const pressHandler = () => {
        setPressed(true);
        socket.emit('start', gameID);
    }
    return (
        <View>
            {!pressed && <Button title='Start' onPress={pressHandler} />}
        </View>
    )
}

const styles = StyleSheet.create({});

export default StartButton;