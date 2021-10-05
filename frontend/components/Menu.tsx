import React from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import NavigatorParamsList from '../types/NavigatorParamsList';

type Props = NativeStackScreenProps<NavigatorParamsList, 'Menu'>;

const GameMenu: React.FC<Props> = ({ navigation }) => {
    return (
        <View style={styles.test}>
            <Button title='Create Game' onPress={() => navigation.navigate('Create')} />
            <Button title='Join Game' onPress={() => navigation.navigate('Join')} />
        </View>
    );
}

const styles = StyleSheet.create({
    test: {
        marginTop: 30
    }
})

export default GameMenu;
