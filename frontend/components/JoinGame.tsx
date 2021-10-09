import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';
import Button from './Button';
import socket from '../socketConfig';
import globalStyles from '../styles/globalStyles';

const JoinGame: React.FC = () => {
    const [name, setName] = useState('');
    const [gameID, setGameID] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [pressed, setPressed] = useState(false);
    const joinHandler = () => {
        setPressed(true);
        socket.emit('join', { name, gameID })
    };
    useEffect(() => {
        socket.on('join-error', (errorMsg: string) => {
            setError(errorMsg);
            setPressed(false);
        });
    }, [])
    return ( 
        <View style={styles.container}>
            <TextInput style={globalStyles.input} onChangeText={(text) => setName(text)} placeholder='Name' />
            <TextInput style={globalStyles.input} onChangeText={(text) => setGameID(text)} placeholder='Game ID' />
            {!pressed && <Button title='Join' onPress={joinHandler} />}
            {error && <Text style={[globalStyles.error, globalStyles.text, styles.joinError]}>{ error }</Text>}
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        alignItems: 'center'
    },
    joinError: {
        marginTop: 30
    }
});

export default JoinGame;
