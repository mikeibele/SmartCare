// navigation/MainNavigator.js
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import LoginScreen from '../app/auth/LoginScreen';
import SignupScreen from '../app/auth/SignupScreen';
import DashboardScreen from '../app/dashboard/Dashboard';
import { ActivityIndicator, View } from 'react-native';
import { useAuthContext } from '../app/context/AuthProvider';
import BookAppointment from '../app/appointments/BookAppointment';
import UserProfile from '../app/profile/UserProfile';
import MyId from '../app/profile/MyId';
import HealthDetails from '../app/profile/HealthDetails';
import AppointmentList from '../app/appointments/AppointmentList';
import VideoCallScreen from '../app/screen/VideoCallScreen';
import HealthHistoryScreen from '../app/screen/HealthHistoryScreen';
import Recommendations from '../app//screen/Recommendations';

const Stack = createNativeStackNavigator();

export default function MainNavigator() {
  const { session, loading } = useAuthContext();

  if (loading) {
    return (
      <View style={{ backgroundColor: '#06191D', flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#00ffcc" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {session ? (
          <>
            <Stack.Screen name="Dashboard" component={DashboardScreen} />
            <Stack.Screen name="BookAppointment" component={BookAppointment} options={{ title: 'Book Appointment' }} />
            <Stack.Screen name="UserProfile" component={UserProfile} />
            <Stack.Screen name="HealthDetails" component={HealthDetails} />
            <Stack.Screen name="MyId" component={MyId} />
            <Stack.Screen name="AppointmentList" component={AppointmentList} />
            <Stack.Screen name="VideoCallScreen" component={VideoCallScreen} />
            <Stack.Screen name="HealthHistory" component={HealthHistoryScreen} />
            <Stack.Screen name="Recommendations" component={Recommendations} />
          </>
        ) : (
          <>
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Signup" component={SignupScreen} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
