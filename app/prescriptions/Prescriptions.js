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
import { AntDesign, FontAwesome, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

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

  const getBadge = (text, type) => (
    <View
      style={[
        styles.badge,
        { backgroundColor: type === 'bottle' ? '#FFEEE5' : '#E9F6ED' },
      ]}
    >
      <Text
        style={[
          styles.badgeText,
          { color: type === 'bottle' ? '#D15B38' : '#2D8F55' },
        ]}
      >
        {text}
      </Text>
    </View>
  );


  const renderItem = ({ item }) => {
    const isCapsule = item.dosage?.toLowerCase().includes('capsule');
    const isBottle = item.dosage?.toLowerCase().includes('ml') || item.dosage?.toLowerCase().includes('bottle');
    const backgroundColor = isBottle ? '#FFF3ED' : '#EBF9F1';
  
    return (
      <TouchableOpacity
        style={[styles.card, { backgroundColor }]}
        onPress={() => navigation.navigate('PrescriptionDetails', { prescription: item })}
      >
        {getBadge(item.dosage, isBottle ? 'bottle' : 'capsule')}
  
        <View style={styles.cardRow}>
          <View style={styles.cardContent}>
            <Text style={styles.medicationName}>{item.medication_name}</Text>
            <Text style={styles.issueDate}>
              Issue date: {new Date(item.issued_date).toLocaleDateString()}
            </Text>
          </View>
  
          {/* Right-side icons */}
          <View style={styles.cardRightIcons}>
            <View
              style={[
                styles.iconContainer,
                { backgroundColor: isBottle ? '#F17B45' : '#2D8F55' },
              ]}
            >
              <MaterialCommunityIcons
                name="pill"
                size={14}
                color="#fff"
              />
            </View>
            <Ionicons name="chevron-forward-outline" size={22} color="#000" />
          </View>
        </View>
      </TouchableOpacity>
    );
  };
  
  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.headerContainer}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <AntDesign name="arrowleft" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.header}>Prescriptions</Text>
      </View>

      {/* Prescription List */}
      <FlatList
        data={prescriptions}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        contentContainerStyle={{ paddingBottom: 30 }}
        ListEmptyComponent={
          <Text style={styles.emptyMessage}>No prescriptions found.</Text>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#EAF0EC',
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
    gap: 10,
    marginTop: 20,
    marginBottom: 20,
  },
  header: {
    fontSize: 22,
    fontWeight: '700',
    color: '#06191D',
  },
  card: {
    borderRadius: 14,
    padding: 16,
    marginBottom: 16,
  },
  badge: {
    alignSelf: 'flex-start',
    borderRadius: 6,
    paddingVertical: 4,
    paddingHorizontal: 10,
    marginBottom: 6,
  },
  badgeText: {
    fontSize: 13,
    fontWeight: '600',
  },
  cardContent: {
    paddingTop: 4,
  },
  medicationName: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#1D1D1D',
  },
  issueDate: {
    fontSize: 13,
    color: '#666',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
    alignItems: 'center',
  },
  iconContainer: {
    padding: 6,
    borderRadius: 6,
  },
  emptyMessage: {
    textAlign: 'center',
    marginTop: 50,
    color: '#888',
    fontSize: 16,
  },
  cardRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  chevron: {
    marginLeft: 10,
  },  
  cardRightIcons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  
});
