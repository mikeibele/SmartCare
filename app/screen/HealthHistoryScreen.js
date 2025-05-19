// screen/HealthHistoryScreen.js
import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, ActivityIndicator, StyleSheet, TouchableOpacity, Linking } from 'react-native';
import { supabase } from '../../utils/supabaseClient';

export default function HealthHistoryScreen() {
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchHistory();
    }, []);

    const fetchHistory = async () => {
        const { data, error } = await supabase
            .from('health_history')
            .select('*, doctors(full_name)')
            .order('created_at', { ascending: false });

        if (error) console.error(error);
        else setHistory(data);

        setLoading(false);
    };

    const renderItem = ({ item }) => (
        <View style={styles.card}>
            <Text style={styles.diagnosis}>🩺 {item.diagnosis}</Text>
            <Text>Doctor: {item.doctors?.full_name || 'N/A'}</Text>
            <Text>{item.notes}</Text>
            {item.attachment_url && (
                <TouchableOpacity onPress={() => Linking.openURL(item.attachment_url)}>
                    <Text style={styles.link}>View Attachment</Text>
                </TouchableOpacity>
            )}
            <Text style={styles.date}>{new Date(item.created_at).toLocaleString()}</Text>
        </View>
    );

    if (loading) return <ActivityIndicator style={{ marginTop: 50 }} size="large" color="#007AFF" />;

    return (
        <FlatList
            contentContainerStyle={{ padding: 20 }}
            data={history}
            keyExtractor={(item) => item.id}
            renderItem={renderItem}
        />
    );
}

const styles = StyleSheet.create({
    card: { backgroundColor: '#fff', padding: 15, borderRadius: 8, marginBottom: 15 },
    diagnosis: { fontSize: 18, fontWeight: 'bold' },
    link: { color: 'blue', marginTop: 5 },
    date: { marginTop: 10, fontSize: 12, color: '#555' },
});
