import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, ScrollView } from 'react-native';
import { supabase } from '../../utils/supabaseClient';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { TouchableOpacity } from 'react-native-gesture-handler';

const HealthDetails = () => {
    const navigation = useNavigation();
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchHealthData = async () => {
            const {
                data: { session },
                error: sessionError,
            } = await supabase.auth.getSession();

            if (sessionError) {
                console.error('Error getting session:', sessionError.message);
                setLoading(false);
                return;
            }

            const userId = session?.user?.id;

            const { data, error } = await supabase
                .from('patients')
                .select('*')
                .eq('user_id', userId)
                .maybeSingle();

            if (error) {
                console.error('Error fetching patient data:', error.message);
            } else {
                setUserData(data);
            }
            setLoading(false);
        };

        fetchHealthData();
    }, []);

    return (
        <ScrollView style={styles.container}>
            {/* 🔙 Back Button */}
            <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                <Ionicons name="arrow-back" size={24} color="#fff" />
            </TouchableOpacity>

            <Text style={styles.title}>Health Details</Text>

            {loading ? (
                <ActivityIndicator size="large" color="#2e90fa" />
            ) : userData ? (
                <View style={styles.card}>
                    <Text style={styles.label}>Full Name:</Text>
                    <Text style={styles.value}>{userData.full_name}</Text>

                    <Text style={styles.label}>Email:</Text>
                    <Text style={styles.value}>{userData.email || 'N/A'}</Text>

                    <Text style={styles.label}>Gender:</Text>
                    <Text style={styles.value}>{userData.gender || 'N/A'}</Text>

                    <Text style={styles.label}>Date of Birth:</Text>
                    <Text style={styles.value}>{userData.dob || 'N/A'}</Text>

                    <Text style={styles.label}>Blood Type:</Text>
                    <Text style={styles.value}>{userData.blood_type || 'N/A'}</Text>
                </View>
            ) : (
                <Text style={styles.empty}>No health details found.</Text>
            )}
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 24,
        backgroundColor: '#121212',
    },
    backButton: {
        position: 'absolute',
        top: 40,
        left: 20,
        zIndex: 1,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#fff',
        marginTop: 50,
        marginBottom: 20,
        textAlign: 'center',
    },
    card: {
        backgroundColor: '#1e1e1e',
        borderRadius: 12,
        padding: 20,
        marginTop: 10,
    },
    label: {
        fontSize: 16,
        color: '#bbb',
        marginTop: 10,
    },
    value: {
        fontSize: 18,
        color: '#fff',
        fontWeight: '500',
    },
    empty: {
        color: '#aaa',
        fontSize: 16,
        textAlign: 'center',
        marginTop: 30,
    },
});

export default HealthDetails;
