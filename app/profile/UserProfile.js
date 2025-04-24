// app/profile/UserProfile.js
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { supabase } from '../../utils/supabaseClient';
import { Ionicons } from '@expo/vector-icons';

const UserProfile = ({ navigation }) => {
  const [fullName, setFullName] = useState('');
  const [userId, setUserId] = useState('');

  useEffect(() => {
    const fetchUserProfile = async () => {
      const {
        data: { session },
        error: sessionError,
      } = await supabase.auth.getSession();

      if (sessionError) {
        console.error('Session Error:', sessionError.message);
        return;
      }

      const uid = session?.user?.id;
      setUserId(uid);

      if (uid) {
        const { data, error } = await supabase
          .from('patients')
          .select('full_name')
          .eq('user_id', uid)
          .maybeSingle();

        if (error) {
          console.error('Error fetching patient data:', error.message);
        } else if (data) {
          setFullName(data.full_name);
        }
      }
    };

    fetchUserProfile();
  }, []);

  return (
    <ScrollView style={styles.container}>
      {/* 🔙 Back Button */}
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Ionicons name="arrow-back" size={24} color="#000" />
      </TouchableOpacity>

      <View style={styles.profileSection}>
        <Image
          source={require('../../assets/images/UserProfile.png')}
          style={styles.profileImage}
        />
        <Text style={styles.profileName}>{fullName || 'Loading name...'}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Health</Text>
        <Option
          text="Health Details"
          onPress={() => navigation.navigate('HealthDetails')}
        />
        <Option
          text="Medical ID"
          onPress={() => navigation.navigate('MyId', { user_id: userId })}
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Features</Text>
        <Option text="Health Checklist" />
        <Option text="Notifications" />
      </View>
    </ScrollView>
  );
};

const Option = ({ text, onPress }) => (
  <TouchableOpacity style={styles.option} onPress={onPress}>
    <Text style={styles.optionText}>{text}</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f7f9fc',
    paddingHorizontal: 20,
    paddingTop: 50,
  },
  backButton: {
    position: 'absolute',
    top: 40,
    left: 20,
    zIndex: 1,
  },
  profileSection: {
    alignItems: 'center',
    marginVertical: 30,
  },
  profileImage: {
    width: 90,
    height: 90,
    borderRadius: 45,
  },
  profileName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
    marginTop: 10,
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 18,
    color: '#000',
    fontWeight: 'bold',
    marginBottom: 10,
  },
  option: {
    backgroundColor: '#fff',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginBottom: 10,
  },
  optionText: {
    color: '#000',
    fontSize: 16,
  },
});

export default UserProfile;
