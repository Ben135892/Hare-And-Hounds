import React, { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Slider from '@react-native-community/slider';
import globalStyles from '../styles/globalStyles';

interface Props {
    locationUpdateInterval: number,
    setLocationUpdateInterval: React.Dispatch<React.SetStateAction<number>>
}

const SliderComponent: React.FC<Props> = ({ locationUpdateInterval, setLocationUpdateInterval }) => {
    const formatTime = (timer: number) => {
        const minutes = Math.floor(timer / 60);
        let seconds = timer % 60;
        return (minutes > 0 ? minutes + ':' : '') + (minutes > 0 && seconds < 10 ? '0' + seconds : seconds);
    }
    return (
        <View style={styles.container}>
            <Text style={globalStyles.text}>Location Update Interval: <Text style={globalStyles.bold}>{ formatTime(locationUpdateInterval) }</Text></Text>
            <Slider
                minimumValue={15}
                maximumValue={300}
                style={{width: 300, marginTop: 20}}
                value={locationUpdateInterval}
                onValueChange={value => setLocationUpdateInterval(Math.round(value))}
                step={5}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        margin: 30,
        alignItems: 'center',
    }
});

export default SliderComponent;
