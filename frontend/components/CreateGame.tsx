import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';
import Button from './Button';
import socket from '../socketConfig';
import globalStyles from '../styles/globalStyles';

const CreateGame: React.FC = () => {
    const [name, setName] = useState('');
    const [pressed, setPressed] = useState(false);
    const createHandler = () => {
        setPressed(true);
        socket.emit('create', name);
    }
    return (
        <View style={styles.container}>
            <TextInput style={globalStyles.input} onChangeText={(text) => setName(text)} placeholder='Name' />
            {!pressed && <Button title='Create' onPress={createHandler} />}
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        alignItems: 'center'
    }
});

export default CreateGame;
