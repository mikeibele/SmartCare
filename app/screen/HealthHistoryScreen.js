// app/screen/HealthHistoryScreen.js
import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import useAuth from '../../hooks/useAuth'; // or your auth context/provider

import { supabase } from '../../utils/supabaseClient';

const HealthHistoryScreen = () => {
    const [patient, setPatient] = useState(null);
    const { session, loading } = useAuth();


    useEffect(() => {
        if (loading || !session?.user?.id) return; // ⛔️ Prevent fetch if not ready
    
        const fetchHealthData = async () => {
            const { data, error } = await supabase
                .from('patients')
                .select('*')
                .eq('user_id', session.user.id)
                .single();
    
            if (error) {
                console.error('Error fetching health history:', error.message);
            } else {
                setPatient(data);
            }
        };
    
        fetchHealthData();
    }, [loading, session]); // ✅ Re-run when session becomes available
    

    if (loading || !patient) return <Text>Loading...</Text>;

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.title}>Health History</Text>
            <Text style={styles.label}>Allergies:</Text>
            <Text style={styles.value}>{patient.allergies || 'None'}</Text>

            <Text style={styles.label}>Past Issues:</Text>
            <Text style={styles.value}>{patient.health_history || 'None'}</Text>

            <Text style={styles.label}>Blood Type:</Text>
            <Text style={styles.value}>{patient.blood_type}</Text>

            <Text style={styles.label}>Height:</Text>
            <Text style={styles.value}>{patient.height} cm</Text>

            <Text style={styles.label}>Weight:</Text>
            <Text style={styles.value}>{patient.weight} kg</Text>

            <Text style={styles.label}>Emergency Contact:</Text>
            <Text style={styles.value}>{patient.emergency_contact}</Text>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: { padding: 20 },
    title: { fontSize: 22, fontWeight: 'bold', marginBottom: 20 },
    label: { fontWeight: 'bold', marginTop: 10 },
    value: { marginBottom: 10 },
});

export default HealthHistoryScreen;
