import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    FlatList,
    StyleSheet,
    ActivityIndicator,
    Alert,
    TouchableOpacity,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { AntDesign } from '@expo/vector-icons';
import { supabase } from '../../utils/supabaseClient';
import { Ionicons } from '@expo/vector-icons';

export default function AppointmentList() {
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigation = useNavigation();


    const handleVideoCall = (item, platform = 'jitsi') => {
        const roomId = `SmartCareRoom_${item.id}`; // Customize if needed
        navigation.navigate('VideoCallScreen', {
            type: platform, // 'jitsi', 'daily', or 'zoom'
            roomId,
        });
    };      

    useEffect(() => {
        const fetchAppointments = async () => {
            try {
                const {
                    data: { session },
                    error: sessionError,
                } = await supabase.auth.getSession();

                if (sessionError) throw sessionError;

                const userId = session?.user?.id;
                console.log('Current UID:', userId);

                const { data, error } = await supabase
                    .from('appointments')
                    .select('*')
                    .eq('user_id', userId)
                    .order('appointment_date', { ascending: false });

                if (error) throw error;

                setAppointments(data || []);
            } catch (err) {
                console.error('Error fetching appointments:', err.message);
                Alert.alert('Error', 'Failed to load your appointments.');
            } finally {
                setLoading(false);
            }
        };

        fetchAppointments();
    }, []);

    if (loading) {
        return (
            <View style={styles.centered}>
                <ActivityIndicator size="large" color="#007bff" />
            </View>
        );
    }

    const renderItem = ({ item }) => (
        <TouchableOpacity style={styles.appointmentCard}>
            <View style={styles.cardContent}>
                <View style={{ flex: 1 }}>
                    <Text style={styles.apptDate}>
                        {new Date(item.appointment_date).toLocaleString()}
                    </Text>
                    <Text style={styles.apptStatus}>Status: {item.status}</Text>
                    {item.symptoms && (
                        <Text style={styles.apptSymptoms}>Symptoms: {item.symptoms}</Text>
                    )}
                </View>
    
                {/* Show video icon if appointment is active and virtual */}
                {item.status === 'active' && item.appointment_type === 'online' && (
                    <TouchableOpacity style={{ marginLeft: 10 }} onPress={() => handleVideoCall(item, 'jitsi')}>
                        <Ionicons name="videocam" size={28} color="#007AFF" />
                    </TouchableOpacity>
                )}
            </View>
        </TouchableOpacity>
    );
    

    // const renderItem = ({ item }) => (
    //     <TouchableOpacity style={styles.appointmentCard}>
    //         <View style={styles.cardContent}>
    //             <View style={{ flex: 1 }}>
    //                 <Text style={styles.apptDate}>
    //                     {new Date(item.appointment_date).toLocaleString()}
    //                 </Text>
    //                 <Text style={styles.apptStatus}>Status: {item.status}</Text>
    //                 {item.symptoms && (
    //                     <Text style={styles.apptSymptoms}>Symptoms: {item.symptoms}</Text>
    //                 )}
    //             </View>
    //         </View>
    //     </TouchableOpacity>
    // );

    return (
        <View style={styles.container}>
            <View style={styles.headerContainer}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <AntDesign name="arrowleft" size={24} color="black" />
                </TouchableOpacity>
                <Text style={styles.header}>Your Appointments</Text>
            </View>

            <FlatList
                data={appointments}
                keyExtractor={(item) => item.id.toString()}
                renderItem={renderItem}
                contentContainerStyle={{ paddingBottom: 20 }}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#f0f4f7',
        flex: 1,
        paddingHorizontal: 16,
        paddingTop: 30,
    },
    centered: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    headerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
        gap: 10,
        marginTop: 30,
    },
    header: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#333',
    },
    appointmentCard: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 18,
        marginBottom: 14,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 6,
        elevation: 3,
    },
    cardContent: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    apptDate: {
        fontSize: 17,
        fontWeight: 'bold',
        color: '#222',
    },
    apptStatus: {
        marginTop: 4,
        fontSize: 15,
        color: '#555',
    },
    apptSymptoms: {
        marginTop: 4,
        fontSize: 14,
        fontStyle: 'italic',
        color: '#777',
    },
});