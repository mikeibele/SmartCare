// app/dashboard/Dashboard.js
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Alert,
  TouchableOpacity,
} from 'react-native';
import Tile from '../components/Tile';
import Card from '../components/Card';
import { AntDesign } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { supabase } from '../../utils/supabaseClient';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Dashboard() {
  const navigation = useNavigation();
  const [fullName, setFullName] = useState('');
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    await AsyncStorage.removeItem('user_session');
    navigation.replace('Login'); // or navigate to the login screen
  };
  
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const {
          data: { session },
          error: sessionError,
        } = await supabase.auth.getSession();

        if (sessionError) throw sessionError;

        const userId = session?.user?.id;
        console.log('Auth UID:', userId);

        const { data: patientData, error: patientError } = await supabase
          .from('patients')
          .select('full_name')
          .eq('user_id', userId)
          .maybeSingle();

        if (patientError) throw patientError;
        if (patientData) {
          setFullName(patientData.full_name);
        }

        const { data: appointmentData, error: appointmentError } = await supabase
        .from('appointments')
        .select('*')
        .eq('user_id', userId)
        .order('appointment_date', { ascending: false }) // latest first
        .limit(1); // only get the latest
      
        if (appointmentError) throw appointmentError;

        setAppointments(appointmentData || []);
      } catch (err) {
        console.error('Error:', err.message);
        Alert.alert('Error', 'Failed to load your data.');
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
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
      <View style={styles.headerRow}>
        <Text style={styles.welcome}>
          👋 Welcome, {fullName || 'SmartCare User'}!
        </Text>
        <TouchableOpacity onPress={handleLogout}>
          <AntDesign name="logout" size={24} color="red" />
        </TouchableOpacity>
      </View>

      <Card title="Upcoming Appointments">
        {appointments.length === 0 ? (
          <Text style={{ color: '#555' }}>No appointments scheduled. Book one today!</Text>
        ) : (
          appointments.map((appt) => (
            <TouchableOpacity
              key={appt.id}
              style={styles.appointmentItem}
              onPress={() => navigation.navigate('AppointmentList', { appointment: appt })}
            >
              <View style={styles.appointmentContent}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.apptDate}>
                    {new Date(appt.appointment_date).toLocaleString()}
                  </Text>
                  <Text style={styles.apptStatus}>Status: {appt.status}</Text>
                  {appt.symptoms && (
                    <Text style={styles.apptSymptoms}>Symptoms: {appt.symptoms}</Text>
                  )}
                </View>
                <AntDesign name="arrowright" size={24} color="black" />
              </View>
            </TouchableOpacity>
          ))
        )}
      </Card>

      <View style={styles.row}>
        <Tile
          icon="person"
          color="#ffc107"
          text="Profile"
          onPress={() => navigation.navigate('UserProfile')}
        />
        <Tile
          icon="health-and-safety"
          color="#dc3545"
          text="Health History"
          onPress={() => navigation.navigate('HealthHistory')}
        />
      </View>

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
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f7f9fc',
    padding: 20,
    marginTop: 40,
    flex: 1,
  },
  welcome: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  appointmentItem: {
    width: '100%', // Full width
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20, // Increased padding
    marginVertical: 10,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 3,
  },
  appointmentContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  apptDate: {
    fontWeight: 'bold',
    color: '#333',
    fontSize: 16,
  },
  apptStatus: {
    marginTop: 4,
    color: '#555',
  },
  apptSymptoms: {
    marginTop: 4,
    fontStyle: 'italic',
    color: '#777',
  },
  logoutText: {
    color: 'red',
    fontWeight: 'bold',
    fontSize: 15,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },  
});
