import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, View, Button } from 'react-native';
import socket from '../socketConfig';

const JoinGame: React.FC = () => {
    const [name, setName] = useState('');
    const [gameID, setGameID] = useState('');
    const joinHandler = () => socket.emit('join', { name, gameID });
    return (
        <View>
            <TextInput onChangeText={(text) => setName(text)} placeholder='Name' />
            <TextInput onChangeText={(text) => setGameID(text)} placeholder='Game ID' />
            <Button title='Join' onPress={joinHandler} />
        </View>
    )
}

const styles = StyleSheet.create({});

export default JoinGame;
