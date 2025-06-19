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
  Image,
} from 'react-native';
import { Controller, useForm } from 'react-hook-form';
import { supabase } from '../../utils/supabaseClient';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeftIcon } from 'react-native-heroicons/solid';

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
          blood_type: '',
          weight: '',
          height: '',
          allergies: '',
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
    <ScrollView style={{ flex: 1, backgroundColor: '#0165FC' }}>
      <SafeAreaView>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={{
            backgroundColor: '#06191D',
            padding: 10,
            borderRadius: 20,
            width: 40,
            height: 40,
            justifyContent: 'center',
            alignItems: 'center',
            marginLeft: 10,
          }}
        >
          <ArrowLeftIcon size={20} color="white" />
        </TouchableOpacity>
      
        <View style={{ alignItems: 'center', marginVertical: 20 }}>
          <Image
            source={require('../../assets/images/signup.png')}
            style={{ width: '100%', height: 200 }}
            resizeMode="contain"
          />
        </View>
      </SafeAreaView>

      <View
        style={{
          backgroundColor: '#ffffff',
          flex: 1,
          padding: 24,
          borderTopLeftRadius: 40,
          borderTopRightRadius: 40,
          marginTop: -60,
        }}
      >
        <Text
          style={{
            color: '#06191D',
            fontSize: 25,
            fontWeight: 'bold',
            marginBottom: 10,
            marginLeft: 10,
            textAlign: 'center',
          }}
        >
          Sign Up 
        </Text>

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

        <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: 16 }}>
          <Text style={{ color: '#666', fontSize: 17, }}>Already have an account?</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Login')}>
            <Text style={{ color: '#0165FC', fontSize: 18, fontWeight: 'bold' }}> Login</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );

}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    // padding: 20,
    backgroundColor: '#f7f9fc',
    // marginTop: 40,
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
