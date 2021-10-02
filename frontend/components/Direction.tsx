import React, { useState, useEffect } from 'react'
import { StyleSheet, Text, View, Image } from 'react-native'
import * as Location from 'expo-location';
import { getDistance, getGreatCircleBearing } from 'geolib';
import LocationType from '../interfaces/Location';

interface Props {
    runnerLocation: LocationType
}

const GEOLOCATION_OPTIONS = { accuracy: Location.LocationAccuracy.Highest, timeInterval: 2000, distanceInterval: 0 };

// return the bearing angle between a current and target bearing
const angleDifference = (heading: number, targetBearing: number) => {
    let angle = targetBearing - heading;
    return (angle + 360) % 360;
}

const Direction: React.FC<Props> = ({ runnerLocation }) => {
    const [locationSubscription, setLocationSubscription] = useState<any>(null);
    const [headingSubscription, setHeadingSubscription] = useState<any>(null);
    const [direction, setDirection] = useState<number | null>(null);
    const [distance, setDistance] = useState<number | null>(null);
    const [location, setLocation] = useState<LocationType | null>(null);
    const [heading, setHeading] = useState<number | null>(null);
    const updateDirection = () => {
        if (heading === null || location === null) {
            return;
        }
        const targetBearing = getGreatCircleBearing(location, runnerLocation);
        const newDirection = angleDifference(heading, targetBearing);
        setDirection(newDirection);
    } 
    const updateDistance = () => {
        if (location === null) {
            return;
        }
        const distance = getDistance(location, runnerLocation);
        setDistance(distance);
    }
    const updateLocation = (location: any) => {
        setLocation({ latitude: location.coords.latitude, longitude: location.coords.longitude });
    }
    const updateHeading = (headingObj: any) => {
        setHeading(headingObj.trueHeading); // true north
    }
    useEffect(() => updateDistance(),
        [location]);
    useEffect(() => updateDirection(),
        [location, heading]);
    useEffect(() => {
        (async () => {
            const locationSubscription = await Location.watchPositionAsync(GEOLOCATION_OPTIONS, updateLocation);
            setLocationSubscription(locationSubscription);
            const headingSubscription = await Location.watchHeadingAsync(updateHeading);
            setHeadingSubscription(headingSubscription);
        })();
    }, []);
    useEffect(() => {
        return () => locationSubscription && locationSubscription.remove();
    }, [locationSubscription]);
    useEffect(() => {
        return () => headingSubscription && headingSubscription.remove();
    }, [headingSubscription]);
    return (
        <View style={styles.direction}>
            {direction !== null && 
                <Image 
                    style={[styles.image, {transform: [{ rotate: direction + 'deg' }] }]} 
                    source={require('../assets/arrow.png')} 
                />
            } 
            {distance !== null && <Text>Distance: {distance}</Text>}  
        </View>
    )
}

const styles = StyleSheet.create({
    image: {
        width: 150,
        height: 150
    },
    direction: {
        margin: 50
    }
})

export default Direction;