import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, View, Button } from 'react-native';
import socket from '../socketConfig';

const CreateGame: React.FC = () => {
    const [name, setName] = useState('');
    const createHandler = () => socket.emit('create', name);
    return (
        <View>
            <TextInput onChangeText={(text) => setName(text)} placeholder='Name' />
            <Button title='Create' onPress={createHandler} />
        </View>
    )
}

const styles = StyleSheet.create({});

export default CreateGame;
