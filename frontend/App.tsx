import React, { useState, useEffect, SetStateAction } from 'react';
import { StyleSheet, Text, View } from 'react-native';
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

const Stack = createNativeStackNavigator();

export default function App() {
  const [game, setGame] = useState<Game | null>(null);
  const [players, setPlayers] = useState<Players | null>(null);
  useEffect(() => {
    (async () => {
        await Location.requestForegroundPermissionsAsync();
    })();
    socket.on('set-game', (game: Game) => {
      setGame(game);
    }); 
    socket.on('set-players', (players: Players) => {
      setPlayers(players);
    });
  }, []);
  if (game && players) {
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
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
