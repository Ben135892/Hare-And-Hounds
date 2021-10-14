import React, { useState, useEffect, useRef } from 'react';
import { AppState, AppStateStatus, StyleSheet, Text, View, BackHandler  } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import * as Location from 'expo-location';
import Menu from './components/Menu';
import CreateGame from './components/CreateGame';
import JoinGame from './components/JoinGame';
import Lobby from './components/Lobby';
import MainGame from './components/MainGame';
import Game from './interfaces/Game';
import Players from './types/Players';
import socket from './socketConfig';
import globalStyles from './styles/globalStyles';

const Stack = createNativeStackNavigator();

export default function App() {
  const appState = useRef(AppState.currentState);
  const [game, setGame] = useState<Game | null>(null);
  const [players, setPlayers] = useState<Players | null>(null);
  const [connected, setConnected] = useState(true);
  const requestPermissions = async () => {
    // request location permissions for app
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status === 'granted') {
      try { 
        await Location.enableNetworkProviderAsync();
      } catch(err) {
        BackHandler.exitApp();
      }
    } else {
      BackHandler.exitApp();
    }
  }
  const _handleAppStateChange = async (nextAppState: AppStateStatus) => {
    if (appState.current.match(/inactive|background/) && nextAppState === 'active') {
        // app been opened in foreground
        await requestPermissions();
    } 
    appState.current = nextAppState;
  }
  useEffect(() => {
    requestPermissions();
    socket.on('set-game', (game: Game) => {
      setGame(game);
    }); 
    socket.on('set-players', (players: Players) => {
      setPlayers(players);
    });
    socket.on('connect', () => {
      setConnected(true);
    });
    socket.on('disconnect', () => {
      setConnected(false);
      setGame(null);
      setPlayers(null);
    });
    AppState.addEventListener('change', _handleAppStateChange);
    return () => {
        AppState.removeEventListener('change', _handleAppStateChange);
    };
  }, []);
  if (!connected) {
    return (
      <View style={styles.errorContainer}>
        <Text style={[globalStyles.error, globalStyles.text]}>No Connection</Text>
      </View>
    )
  } else if (game && players) {
    if (game.has_started) {
      return <MainGame game={game} players={players} />
    } else {
      return <Lobby game={game} players={players} />
    }
  } else {
    return (
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen name="Menu" component={Menu} />
          <Stack.Screen name="Create" component={CreateGame} />
          <Stack.Screen name="Join" component={JoinGame} />
        </Stack.Navigator>
      </NavigationContainer>
    )
  }
}

const styles = StyleSheet.create({
  errorContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

