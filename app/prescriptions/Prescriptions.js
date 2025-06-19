import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  Alert,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { supabase } from '../../utils/supabaseClient';
import { AntDesign } from '@expo/vector-icons';

export default function Prescription() {
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();

  useEffect(() => {
    const fetchPrescriptions = async () => {
      try {
        const {
          data: { session },
          error: sessionError,
        } = await supabase.auth.getSession();

        if (sessionError) throw sessionError;

        const userId = session?.user?.id;
        console.log('Current UID:', userId);

        const { data, error } = await supabase
          .from('prescriptions')
          .select('*')
          .eq('patient_id', userId)
          .order('issued_date', { ascending: false });

        if (error) throw error;

        console.log('Prescriptions data:', data);
        setPrescriptions(data || []);
      } catch (err) {
        console.error('Error fetching prescriptions:', err.message);
        Alert.alert('Error', 'Failed to load prescriptions.');
      } finally {
        setLoading(false);
      }
    };

    fetchPrescriptions();
  }, []);

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#007bff" />
      </View>
    );
  }

  const renderItem = ({ item }) => (
    <TouchableOpacity style={styles.prescriptionCard}>
      <View style={styles.cardContent}>
        <View style={{ flex: 1 }}>
          <Text style={styles.medicationName}>{item.medication_name}</Text>
          <Text style={styles.detail}>Dosage: {item.dosage}</Text>
          <Text style={styles.detail}>Instructions: {item.instructions}</Text>
          <Text style={styles.issuedDate}>
            Issued on: {new Date(item.issued_date).toLocaleDateString()}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.headerContainer}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <AntDesign name="arrowleft" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.header}>Your Prescriptions</Text>
      </View>

      {/* Prescription List */}
      <FlatList
        data={prescriptions}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        contentContainerStyle={{ paddingBottom: 20 }}
        ListEmptyComponent={
          <Text style={styles.emptyMessage}>No prescriptions found.</Text>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f0f4f7',
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 30,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 10,
    marginTop: 30,
  },
  header: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
  },
  prescriptionCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 18,
    marginBottom: 14,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  medicationName: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#222',
  },
  detail: {
    marginTop: 4,
    fontSize: 15,
    color: '#555',
  },
  issuedDate: {
    marginTop: 6,
    fontSize: 13,
    color: '#888',
    fontStyle: 'italic',
  },
  emptyMessage: {
    marginTop: 40,
    fontSize: 16,
    textAlign: 'center',
    color: '#888',
  },
});
