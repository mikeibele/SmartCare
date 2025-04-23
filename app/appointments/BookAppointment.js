// // app/appointment/BookAppointment.js


import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert, Platform } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { supabase } from '../../utils/supabaseClient';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons'; // 👈 Import Ionicons

export default function BookAppointment() {
    const navigation = useNavigation();
    const [symptoms, setSymptoms] = useState('');
    const [date, setDate] = useState(new Date());
    const [showPicker, setShowPicker] = useState(false);

    const handleSubmit = async () => {
        const { data: user } = await supabase.auth.getUser();

        if (!symptoms) {
            Alert.alert('Please enter your symptoms');
            return;
        }

        const { error } = await supabase.from('appointments').insert([
            {
                user_id: user.user.id,
                appointment_date: date.toISOString(),
                symptoms,
            },
        ]);

        if (error) {
            console.log('Error booking appointment:', error);
            Alert.alert('Failed to book appointment');
        } else {
            Alert.alert('Appointment booked!');
            navigation.goBack();
        }
    };

    return (
        <View style={styles.container}>
            {/* 👇 Title row with back button and text */}
            <View style={styles.titleRow}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Ionicons name="arrow-back" size={24} color="#007bff" />
                </TouchableOpacity>
                <Text style={styles.title}>📅 Book an Appointment</Text>
            </View>

            <Text style={styles.label}>Select Date:</Text>
            <TouchableOpacity onPress={() => setShowPicker(true)} style={styles.dateButton}>
                <Text style={styles.dateText}>{date.toDateString()}</Text>
            </TouchableOpacity>

            {showPicker && (
                <DateTimePicker
                    value={date}
                    mode="date"
                    display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                    onChange={(event, selectedDate) => {
                        if (Platform.OS === 'android') setShowPicker(false);
                        if (selectedDate) setDate(selectedDate);
                    }}
                    minimumDate={new Date()} // 👈 This restricts past dates
                />
            )}

            <Text style={styles.label}>Symptoms / Reason for Visit:</Text>
            <TextInput
                style={styles.input}
                placeholder="e.g. Headache, Fever..."
                value={symptoms}
                onChangeText={setSymptoms}
                multiline
            />

            <TouchableOpacity style={styles.button} onPress={handleSubmit}>
                <Text style={styles.buttonText}>Confirm Appointment</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 20,
        backgroundColor: '#fff',
        flex: 1,
    },
    titleRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 25,
        marginTop: 30,
    },
    title: {
        fontSize: 22,
        fontWeight: 'bold',
        marginLeft: 10,
    },
    label: {
        fontWeight: '600',
        marginBottom: 8,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        padding: 10,
        minHeight: 80,
        marginBottom: 20,
        textAlignVertical: 'top',
    },
    dateButton: {
        padding: 12,
        backgroundColor: '#f0f0f0',
        borderRadius: 6,
        marginBottom: 20,
    },
    dateText: {
        fontSize: 16,
    },
    button: {
        backgroundColor: '#007bff',
        padding: 14,
        borderRadius: 8,
        alignItems: 'center',
    },
    buttonText: {
        color: '#fff',
        fontWeight: '600',
    },
});
