import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import NavigatorParamsList from '../types/NavigatorParamsList';
import Button from './Button';

type Props = NativeStackScreenProps<NavigatorParamsList, 'Menu'>;

const GameMenu: React.FC<Props> = ({ navigation }) => {
    return (
        <View style={styles.container}>
            <Button title='Create Game' onPress={() => navigation.navigate('Create')} />
            <Button title='Join Game' onPress={() => navigation.navigate('Join')} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        alignItems: 'center'
    }
})

export default GameMenu;
