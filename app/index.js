 // app/index.js
import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import MainNavigator from '../navigation/MainNavigator';
import { AuthProvider } from './context/AuthProvider';

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <AuthProvider>
        <MainNavigator />
        <StatusBar style="light" />
      </AuthProvider>
    </GestureHandlerRootView>
  );
}
