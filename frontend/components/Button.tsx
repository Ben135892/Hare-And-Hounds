import React from 'react'
import { StyleSheet, Text, View, Pressable } from 'react-native'

interface Props {
    onPress: () => void,
    title: string
}

const Button:React.FC<Props> = ({ onPress, title }) => {
    return (
        <Pressable style={styles.button} onPress={onPress}>
          <Text style={styles.text}>{title}</Text>
        </Pressable>
      );
}

const styles = StyleSheet.create({
    button: {
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'black',
        borderRadius: 4,
        padding: 10,
        margin: 30,
        marginBottom: 0
    },
    text: {
        color: 'white',
        fontSize: 16,
        letterSpacing: 0.25,
        fontWeight: 'bold'
    }
})

export default Button;