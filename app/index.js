// app/index.js
import React from 'react';
import { StatusBar } from 'expo-status-bar';
import MainNavigator from '../navigation/MainNavigator';
import { AuthProvider } from './context/AuthProvider';

export default function App() {
  return (
    <AuthProvider>
      <MainNavigator />
      <StatusBar style="light" />
    </AuthProvider>
  );
}
