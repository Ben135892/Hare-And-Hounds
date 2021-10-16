import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, Text, View, Dimensions, Vibration } from 'react-native';
import * as Location from 'expo-location';
import * as TaskManager from 'expo-task-manager';
import Button from './Button'
import Direction from './Direction';
import Timer from './Timer';
import Game from '../interfaces/Game';
import Player from '../interfaces/Player';
import LocationType from '../interfaces/Location';
import Players from '../types/Players';
import socket from '../socketConfig';
import globalStyles from '../styles/globalStyles';

interface Props {
    game: Game,
    players: Players
}

let is_runner: Boolean | null = null;
let gameID: string | null = null;
const LOCATION_TRACKING = 'location-tracking';

const watchLocation = (is_runner: Boolean) => {
    Location.startLocationUpdatesAsync(LOCATION_TRACKING, {
        accuracy: Location.Accuracy.Highest,
        timeInterval: is_runner ? 2000 : 9999999999, 
        distanceInterval: 0,
        pausesUpdatesAutomatically: true, // for ios
        foregroundService: {
            notificationTitle: 'Running Foreground Service',
            notificationBody: 'Needed by App for Background Updates'
        }
    });
}

const MainGame: React.FC<Props> = ({ game, players }) => {
    const player: Player = players.find(player => player.socket_id === socket.id)!;
    const runner: Player = players.find(player => player.is_runner)!;
    const [runnerLocation, setRunnerLocation] = useState<LocationType | null>(null);
    const [beenFoundPressed, setBeenFoundPressed] = useState(false);
    const [gameOverPressed, setGameOverPressed] = useState(false);
    const beenFoundHandler = () => {
        socket.emit('runner-found', game.id);
        setBeenFoundPressed(true);
    }
    const gameOverHandler = () => {
        socket.emit('end-game', game.id);
        setGameOverPressed(true);
    }
    useEffect(() => {
        is_runner = player.is_runner;
        gameID = game.id;
        watchLocation(player.is_runner);
        socket.on('set-runner-location', (runnerLocation: LocationType) => {
            setRunnerLocation(runnerLocation);
        });
        return () => {
            (async () => {
                if (await Location.hasStartedLocationUpdatesAsync(LOCATION_TRACKING)) {
                    await Location.stopLocationUpdatesAsync(LOCATION_TRACKING);
                }
            })();
            socket.off('set-runner-location');
        }
    }, [player.is_runner]);
    useEffect(() => {
        socket.on('remove-runner-location', () => {
            if (!game.runner_been_found) {
                setRunnerLocation(null);
            }
        });
        return () => socket.off('remove-runner-location');
    }, [game.runner_been_found]);
    useEffect(() => {
        if (game.location_update_number > 0) {
            //Vibration.vibrate(100);
        }
    }, [game.location_update_number]);
    return (
        <View style={styles.container}>
            <Text style={globalStyles.text}>{ player.is_runner ? 'You are the runner' : 'Runner: ' + runner.name }</Text>
            {!game.runner_been_found && !runnerLocation && 
                <Text style={globalStyles.text}>
                    Next Location Update: <Timer time={game.location_update_number === 0 ? game.location_update_interval 
                                                                                        : game.location_update_interval - game.location_show_time} />
                </Text>}
            {!game.runner_been_found && runnerLocation && 
                <Text style={globalStyles.text}>
                    Showing Location for: <Timer time={game.location_show_time} />
                </Text>}
            {game.runner_been_found && <Text style={globalStyles.text}>Showing direction back to runner!</Text>}
            {!player.is_runner && runnerLocation && <Direction runnerLocation={runnerLocation} />}
            {player.is_runner && !beenFoundPressed && (
                <Button title='End Game' onPress={beenFoundHandler} />
            )}
            {player.is_runner && game.runner_been_found && !gameOverPressed && (
                <Button title='Back to Lobby' onPress={gameOverHandler} />
            )}
        </View>
    )    
}

TaskManager.defineTask(LOCATION_TRACKING, async ({ data, error }: { data: any, error: any }) => {
    if (error) {
        console.log('LOCATION_TRACKING TASK ERROR: ', error);
        return;
    }
    if (data && gameID !== null && is_runner) {
        const { locations } = data;
        
        const location = { latitude: locations[0].coords.latitude, longitude: locations[0].coords.longitude };
        console.log(new Date());
        socket.emit('update-runner-location', { location, gameID });
    }
});   

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: 40,
        alignItems: 'center'
    },
});

export default MainGame;
