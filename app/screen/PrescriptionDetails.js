import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { AntDesign, Fontisto, } from '@expo/vector-icons';
import * as GoogleGenerativeAI from '@google/generative-ai';
import { supabase } from '../../utils/supabaseClient'; // ✅ Ensure this path matches your project

export default function PrescriptionDetails({ route, navigation }) {
    const { prescription } = route.params;
    const [aiExplanation, setAiExplanation] = useState('');
    const [doctorName, setDoctorName] = useState(''); // ✅ New state for doctor's name

    const API_KEY = 'AIzaSyDsJeBfkK8WzF1yzGMcTEAbuyrvV-ioHnw';

    useEffect(() => {
        const fetchMedicationExplanation = async (retries = 3) => {
            try {
                const genAI = new GoogleGenerativeAI.GoogleGenerativeAI(API_KEY);
                const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-001' });

                const prompt = `What is the medication "${prescription.medication_name}" used for? Explain simply.`;
                const result = await model.generateContent(prompt);
                const response = await result.response;
                const text = response.text();

                console.log('💊 Gemini response:', text);
                setAiExplanation(text);
            } catch (error) {
                console.error('Gemini fetch error:', error.message);
                if (error.message.includes('503') && retries > 0) {
                    console.log(`🔁 Retrying... (${retries} attempts left)`);
                    setTimeout(() => fetchMedicationExplanation(retries - 1), 2000);
                }
            }
        };

        const fetchDoctorName = async () => {
            try {
                const { data, error } = await supabase
                    .from('doctors')
                    .select('full_name')
                    .eq('id', prescription.doctor_id)
                    .maybeSingle();

                if (error) throw error;
                if (data) {
                    console.log("👨‍⚕️ Doctor's full name:", data.full_name); // ✅ LOGGING HERE
                    setDoctorName(data.full_name);
                }
            } catch (err) {
                console.error('👨‍⚕️ Doctor fetch error:', err.message);
                setDoctorName('Dr. Henderson');
            }
        };

        if (prescription.medication_name) {
            fetchMedicationExplanation();
        }

        if (prescription.doctor_id) {
            fetchDoctorName();
        }
    }, [prescription]);

    const renderFormattedText = (text) => {
        const parts = text.split(/(\*\*[^*]+\*\*)/g); // split on bold segments
        return parts.map((part, index) => {
            if (part.startsWith("**") && part.endsWith("**")) {
                return (
                    <Text key={index} style={{ fontWeight: "bold", color: "#000" }}>
                        {part.slice(2, -2)}
                    </Text>
                );
            }
            return <Text key={index}>{part}</Text>;
        });
    };

    return (
        <View style={styles.container}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backArrow}>
                <AntDesign name="arrowleft" size={24} color="#000" />
            </TouchableOpacity>

            <Text style={styles.header}>{prescription.medication_name}</Text>
            <Text style={styles.instructions}>{prescription.instructions}</Text>

            <View style={styles.infoBlock}>
                <View style={styles.infoRow}>
                    <AntDesign name="medicinebox" size={24} color="#0165FC" style={styles.icon} />
                    <Text style={styles.infoTitle}>Dosage</Text>
                </View>
                <Text style={styles.infoText}>{prescription.dosage}</Text>
            </View>

            <Text style={styles.description}>
                {renderFormattedText(prescription.description || aiExplanation || 'Used to treat infections...')}
            </Text>

            <View style={styles.infoSection}>                
                <View style={styles.infoBlock}>
                    <View style={styles.infoRow}>
                        <AntDesign name="calendar" size={24} color="#0165FC" style={styles.icon} />
                        <Text style={styles.infoTitle}>Issue date</Text>
                    </View>
                    <Text style={styles.infoText}>
                        {new Date(prescription.issued_date).toLocaleDateString()}
                    </Text>
                </View>

                <View style={styles.infoBlock}>
                    <View style={styles.infoRow}>
                        <Fontisto name="doctor" size={24} color="#0165FC" style={styles.icon} />
                        <Text style={styles.prescriberTitle}>Prescriber</Text>
                    </View>
                    <Text style={styles.prescriberName}>{doctorName}</Text>
                </View>

            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 20,
        backgroundColor: '#fff',
        flex: 1,
    },
    backArrow: {
        position: 'absolute',
        top: 40,
        left: 20,
        zIndex: 10,
    },
    header: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#000',
        marginTop: 60,
    },
    description: {
        marginTop: 16,
        fontSize: 15,
        lineHeight: 22,
        color: '#333',
    },
    infoSection: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 24,
    },
    infoBlock: {
        marginTop: 20,
    },
    infoTitle: {
        color: '#888',
        fontSize: 13,
    },
    infoText: {
        fontSize: 16,
        fontWeight: '500',
        color: '#000',
    },
    prescriber: {
        marginTop: 20,
    },
    prescriberTitle: {
        color: '#888',
        fontSize: 13,
    },
    prescriberName: {
        fontSize: 16,
        fontWeight: '500',
    },
    infoRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 4,
    },
    icon: {
        marginRight: 6,
    },
    instructions: {
        color: 'grey',
        fontSize: 16,
    },
});
