// app/auth/LoginScreen.js
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  TouchableWithoutFeedback,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeftIcon } from 'react-native-heroicons/solid';
import { useNavigation } from '@react-navigation/native';
import { supabase } from '../../utils/supabaseClient';

export default function LoginScreen() {
  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    if (email && password) {
      try {
        setIsLoading(true);
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
      } catch (err) {
        alert('Login failed: ' + err.message);
      } finally {
        setIsLoading(false);
      }
    } else {
      alert('Please enter both email and password.');
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: '#06191D' }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={{ flex: 1 }}>
          <SafeAreaView>
            {/* <View style={{ padding: 16 }}>
              <TouchableOpacity
                onPress={() => navigation.goBack()}
                style={{
                  backgroundColor: '#00ffcc',
                  padding: 10,
                  borderRadius: 20,
                  width: 40,
                  height: 40,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                <ArrowLeftIcon size={20} color="black" />
              </TouchableOpacity>
            </View> */}

            <View style={{ alignItems: 'center', marginVertical: 20 }}>
              <Image
                source={require('../../assets/images/login.png')}
                style={{ width: '100%', height: 200 }}
                resizeMode="contain"
              />
            </View>
          </SafeAreaView>

          <View
            style={{
              flex: 1,
              backgroundColor: '#FFFFFF',
              borderTopLeftRadius: 50,
              borderTopRightRadius: 50,
              padding: 20,
              marginTop: -50,
            }}
          >
            <Text
              style={{
                color: '#06191D',
                fontSize: 30,
                fontWeight: 'bold',
                textAlign: 'center',
                marginBottom: 20,
              }}
            >
              Log In
            </Text>

            <TextInput
              style={{
                padding: 15,
                backgroundColor: '#F3F4F6',
                borderRadius: 30,
                marginBottom: 15,
                color: '#4B5563',
                fontSize: 15,
              }}
              placeholder="Enter your email address"
              placeholderTextColor="#9CA3AF"
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
            />

            <TextInput
              style={{
                padding: 15,
                backgroundColor: '#F3F4F6',
                borderRadius: 30,
                marginBottom: 10,
                color: '#4B5563',
                fontSize: 15,
              }}
              secureTextEntry
              placeholder="Enter your password"
              placeholderTextColor="#9CA3AF"
              value={password}
              onChangeText={setPassword}
              autoCapitalize="none"
            />

            <TouchableOpacity
              style={{ alignItems: 'flex-end', marginBottom: 20 }}
              onPress={() => navigation.navigate('ForgotPasswordScreen')}
            >
              <Text style={{ color: '#6B7280', fontSize: 15 }}>Forgot Password?</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={{
                backgroundColor: '#00ffcc',
                paddingVertical: 15,
                borderRadius: 30,
                alignItems: 'center',
              }}
              onPress={handleSubmit}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <Text style={{ color: '#06191D', fontSize: 20, fontWeight: 'bold' }}>
                  Log In
                </Text>
              )}
            </TouchableOpacity>

            <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: 30 }}>
              <Text style={{ color: '#6B7280', fontSize: 18 }}>Don't have an account?</Text>
              <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
                <Text
                  style={{
                    color: '#06191D',
                    fontSize: 18,
                    fontWeight: 'bold',
                    marginLeft: 5,
                  }}
                >
                  Sign Up
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}
