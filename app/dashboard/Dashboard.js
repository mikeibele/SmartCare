// app/dashboard/Dashboard.js
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, Alert } from 'react-native';
import Tile from '../components/Tile';
import Card from '../components/Card';
import { useNavigation } from '@react-navigation/native';
import { supabase } from '../../utils/supabaseClient';

export default function Dashboard() {
  const navigation = useNavigation();
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFullName = async () => {
      try {
        const {
          data: { session },
          error: sessionError,
        } = await supabase.auth.getSession();

        if (sessionError) {
          throw sessionError;
        }

        const userId = session?.user?.id;
        console.log('Auth UID:', userId);

        const { data, error } = await supabase
          .from('patients')
          .select('full_name')
          .eq('user_id', userId)
          .maybeSingle();

        if (error) {
          throw error;
        }

        if (data) {
          console.log('Patient data:', data);
          setFullName(data.full_name);
        } else {
          console.warn('No matching patient found for UID:', userId);
        }
      } catch (err) {
        console.error('Error fetching user data:', err.message);
        Alert.alert('Error', 'Failed to load your details.');
      } finally {
        setLoading(false);
      }
    };

    fetchFullName();
  }, []);

  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color="#007bff" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.welcome}>👋 Welcome, {fullName || 'SmartCare User'}!</Text>

      <Card title="Upcoming Appointments">
        No appointments scheduled. Book one today!
      </Card>

      <View style={styles.row}>
        <Tile
          icon="medical-services"
          color="#007bff"
          text="Book Appointment"
          onPress={() => navigation.navigate('BookAppointment')}
        />
        <Tile
          icon="description"
          color="#28a745"
          text="View Prescriptions"
          onPress={() => navigation.navigate('ViewPrescriptions')}
        />
      </View>

      <View style={styles.row}>
        <Tile
          icon="health-and-safety"
          color="#dc3545"
          text="Health History"
          onPress={() => navigation.navigate('HealthHistory')}
        />
        <Tile
          icon="person"
          color="#ffc107"
          text="Profile"
          onPress={() => navigation.navigate('UserProfile')}
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f7f9fc',
    padding: 20,
    marginTop: 30,
    flex: 1,
  },
  welcome: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
});
