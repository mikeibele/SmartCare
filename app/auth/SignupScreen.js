// app/auth/SignupScreen.js
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  ScrollView,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  TouchableWithoutFeedback,
} from 'react-native';
import { Controller, useForm } from 'react-hook-form';
import { supabase } from '../../utils/supabaseClient';
import Icon from 'react-native-vector-icons/MaterialIcons';

export default function SignupScreen({ navigation }) {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const [loading, setLoading] = useState(false);

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const { email, password, fullName, phone, address, emergencyContact, healthHistory } = data;
  
      // 1. Create the account
      const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
      });
  
      if (signUpError) throw signUpError;
  
      // 2. Get the user object
      const user = signUpData?.user;
  
      if (!user || !user.id) {
        throw new Error('User ID not found after signup.');
      }
  
      // 3. Save user profile data to `patients` table
      const { error: patientError } = await supabase.from('patients').insert([
        {
          user_id: user.id,
          full_name: fullName,
          email,
          phone,
          address,
          emergency_contact: emergencyContact,
          health_history: healthHistory,
          created_at: new Date().toISOString(),
        },
      ]);
  
      if (patientError) throw patientError;
  
      // 4. Log data to console
      console.log('✅ Patient Data Saved:', {
        user_id: user.id,
        full_name: fullName,
        email,
        phone,
        address,
        emergency_contact: emergencyContact,
        health_history: healthHistory,
      });
  
      // 5. Navigate to Dashboard
      Alert.alert('Success', 'Account created successfully');
      navigation.replace('Dashboard');
    } catch (error) {
      console.error('❌ Signup error:', error);
      Alert.alert('Signup Error', error.message || 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  };  

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1 }}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView contentContainerStyle={styles.container}>
          <View style={styles.headerRow}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
              <Icon name="arrow-back" color="#000" size={30} />
            </TouchableOpacity>
            <Text style={styles.heading}>Create an Account</Text>
          </View>

          <Controller
            control={control}
            name="fullName"
            rules={{ required: true }}
            render={({ field: { onChange, value } }) => (
              <TextInput
                placeholder="Full Name"
                style={styles.input}
                onChangeText={onChange}
                value={value}
              />
            )}
          />
          <Controller
            control={control}
            name="email"
            rules={{ required: true }}
            render={({ field: { onChange, value } }) => (
              <TextInput
                placeholder="Email"
                keyboardType="email-address"
                autoCapitalize="none"
                style={styles.input}
                onChangeText={onChange}
                value={value}
              />
            )}
          />
          <Controller
            control={control}
            name="phone"
            rules={{ required: true }}
            render={({ field: { onChange, value } }) => (
              <TextInput
                placeholder="Phone Number"
                keyboardType="phone-pad"
                style={styles.input}
                onChangeText={onChange}
                value={value}
              />
            )}
          />
          <Controller
            control={control}
            name="password"
            rules={{ required: true }}
            render={({ field: { onChange, value } }) => (
              <TextInput
                placeholder="Password"
                secureTextEntry
                style={styles.input}
                onChangeText={onChange}
                value={value}
              />
            )}
          />
          <Controller
            control={control}
            name="address"
            rules={{ required: true }}
            render={({ field: { onChange, value } }) => (
              <TextInput
                placeholder="Address"
                style={styles.input}
                onChangeText={onChange}
                value={value}
              />
            )}
          />
          <Controller
            control={control}
            name="emergencyContact"
            render={({ field: { onChange, value } }) => (
              <TextInput
                placeholder="Emergency Contact (optional)"
                style={styles.input}
                onChangeText={onChange}
                value={value}
              />
            )}
          />
          <Controller
            control={control}
            name="healthHistory"
            render={({ field: { onChange, value } }) => (
              <TextInput
                placeholder="Health History (optional)"
                multiline
                numberOfLines={3}
                style={[styles.input, { height: 80 }]}
                onChangeText={onChange}
                value={value}
              />
            )}
          />

          <TouchableOpacity
            style={styles.button}
            onPress={handleSubmit(onSubmit)}
            disabled={loading}
          >
            <Text style={styles.buttonText}>{loading ? 'Creating Account...' : 'Signup'}</Text>
          </TouchableOpacity>
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: '#f7f9fc',
    marginTop: 40,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  backButton: {
    marginRight: 10,
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
  },
  input: {
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 8,
    marginBottom: 15,
    borderColor: '#ddd',
    borderWidth: 1,
  },
  button: {
    backgroundColor: '#007bff',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
