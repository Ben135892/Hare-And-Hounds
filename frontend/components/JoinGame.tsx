import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';
import Button from './Button';
import socket from '../socketConfig';
import globalStyles from '../styles/globalStyles';

const JoinGame: React.FC = () => {
    const [name, setName] = useState('');
    const [gameID, setGameID] = useState('');
    const [pressed, setPressed] = useState(false);
    const joinHandler = () => {
        setPressed(true);
        socket.emit('join', { name, gameID })
    };
    return (
        <View>
            <TextInput style={globalStyles.input} onChangeText={(text) => setName(text)} placeholder='Name' />
            <TextInput style={globalStyles.input} onChangeText={(text) => setGameID(text)} placeholder='Game ID' />
            {!pressed && <Button title='Join' onPress={joinHandler} />}
        </View>
    )
}

const styles = StyleSheet.create({

});

export default JoinGame;
