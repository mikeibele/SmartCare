import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, ScrollView } from 'react-native';
import axios from 'axios';

const API_KEY = 'AIzaSyDsJeBfkK8WzF1yzGMcTEAbuyrvV-ioHnw'; // Replace with your Gemini API key
const GEMINI_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent';

const Recommendations = () => {
    const [loading, setLoading] = useState(true);
    const [recommendations, setRecommendations] = useState<string>('');

    // Simulated patient data
    const patientData = {
        age: 35,
        weight: 72,
        history: ['High blood pressure', 'Occasional headaches'],
    };

    useEffect(() => {
        const fetchRecommendations = async () => {
            try {
                const prompt = `Give personalized healthcare recommendations for a person aged ${patientData.age}, weighing ${patientData.weight} kg, with medical history: ${patientData.history.join(', ')}. Be concise and easy to understand.`;

                const response = await axios.post(
                    `${GEMINI_URL}?key=${API_KEY}`,
                    {
                        contents: [
                            {
                                parts: [{ text: prompt }],
                            },
                        ],
                    },
                    {
                        headers: {
                            'Content-Type': 'application/json',
                        },
                    }
                );

                const result = response.data?.candidates?.[0]?.content?.parts?.[0]?.text;
                setRecommendations(result || 'No suggestions available');
            } catch (error) {
                console.error('Error fetching AI recommendations:', error);
                setRecommendations('Something went wrong. Please try again later.');
            } finally {
                setLoading(false);
            }
        };

        fetchRecommendations();
    }, []);

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.title}>AI Health Recommendations</Text>
            {loading ? (
                <ActivityIndicator size="large" color="#28a745" />
            ) : (
                <Text style={styles.recommendations}>{recommendations}</Text>
            )}
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        padding: 20,
        backgroundColor: '#fff',
        justifyContent: 'flex-start',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        color: '#28a745',
    },
    recommendations: {
        fontSize: 16,
        lineHeight: 24,
        color: '#333',
    },
});

export default Recommendations;
