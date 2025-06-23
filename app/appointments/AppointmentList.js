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
import { AntDesign, Ionicons, MaterialIcons } from '@expo/vector-icons';
import { supabase } from '../../utils/supabaseClient';

export default function AppointmentList() {
    const [appointments, setAppointments] = useState([]);
    const [filteredAppointments, setFilteredAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [statusFilter, setStatusFilter] = useState('approved');
    const navigation = useNavigation();

    useEffect(() => {
        const fetchAppointments = async () => {
            try {
                const {
                    data: { session },
                    error: sessionError,
                } = await supabase.auth.getSession();
                if (sessionError) throw sessionError;

                const userId = session?.user?.id;

                const { data: appointmentsData, error: appointmentsError } = await supabase
                    .from('appointments')
                    .select('*')
                    .eq('user_id', userId)
                    .order('appointment_date', { ascending: false });

                if (appointmentsError) throw appointmentsError;

                const uniqueDoctorIds = [
                    ...new Set(appointmentsData.map((a) => a.doctor_id).filter(Boolean)),
                ];

                const { data: doctorsData, error: doctorsError } = await supabase
                    .from('doctors')
                    .select('user_id, full_name')
                    .in('user_id', uniqueDoctorIds);

                if (doctorsError) throw doctorsError;

                const doctorMap = Object.fromEntries(
                    doctorsData.map((doc) => [doc.user_id, doc])
                );

                const enrichedAppointments = appointmentsData.map((appt) => ({
                    ...appt,
                    doctor: doctorMap[appt.doctor_id] || null,
                }));

                setAppointments(enrichedAppointments);
            } catch (err) {
                console.error('Error fetching appointments:', err.message);
                Alert.alert('Error', 'Failed to load your appointments.');
            } finally {
                setLoading(false);
            }
        };

        fetchAppointments();
    }, []);

    const handleCancelAppointment = async (id) => {
        try {
            const { error } = await supabase
                .from('appointments')
                .update({ status: 'cancelled' })
                .eq('id', id);
    
            if (error) throw error;
    
            // Refresh local state
            setAppointments(prev =>
                prev.map(appt =>
                    appt.id === id ? { ...appt, status: 'cancelled' } : appt
                )
            );
    
            Alert.alert('Success', 'Appointment cancelled.');
        } catch (err) {
            console.error('Error cancelling appointment:', err.message);
            Alert.alert('Error', 'Failed to cancel appointment.');
        }
    };

    useEffect(() => {
        setFilteredAppointments(appointments.filter(item => item.status === statusFilter));
    }, [appointments, statusFilter]);

    const renderItem = ({ item }) => {
        // const doctor = item.doctors;
        const doctor = item.doctor; // ✅ from enriched data

        const renderAvatarIcon = () => {
            const iconSize = 32;
            const baseIcon = item.appointment_type?.toLowerCase() === 'physical'
                ? <MaterialIcons name="directions-walk" size={iconSize} color="#2aaad4" />
                : item.appointment_type?.toLowerCase() === 'online'
                ? <MaterialIcons name="video-call" size={iconSize} color="#2aaad4" />
                : null;
        
            if (!baseIcon) return null;
        
            return (
                <View>
                    {baseIcon}
                    {item.status === 'cancelled' && (
                        <View style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            width: iconSize,
                            height: iconSize,
                            justifyContent: 'center',
                            alignItems: 'center',
                        }}>
                            <View style={{
                                width: iconSize,
                                height: 2,
                                backgroundColor: 'red',
                                transform: [{ rotate: '45deg' }],
                            }} />
                        </View>
                    )}
                </View>
            );
        };
        
        return (
            <View style={styles.card}>
                <Text style={styles.dateText}>
                    {new Date(item.appointment_date).toLocaleDateString()} -{' '}
                    {new Date(item.appointment_date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </Text>

                <View style={styles.doctorInfo}>
                    {/* <View style={styles.avatarPlaceholder} /> */}
                    <View style={styles.avatarPlaceholder}>
                        {renderAvatarIcon()}
                    </View>

                    <View style={{ flex: 1 }}>
                        <Text style={styles.boldText}>
                            🩺 Appointment Type: {item.appointment_type || 'N/A'}
                        </Text>

                        <Text style={styles.boldText}>
                            📄 Booking ID : #{item.id.toString().padStart(6, '0')}
                        </Text>

                        <Text style={styles.symptomsText}>
                            📝 Reason: {item.symptoms || 'Not specified'}
                        </Text>
                    </View>
                </View>

                <View style={styles.buttonRow}>
                    {item.status !== 'cancelled' && (
                        <TouchableOpacity
                            style={styles.cancelBtn}
                            onPress={() => handleCancelAppointment(item.id)}
                        >
                            <Text style={styles.cancelText}>Cancel</Text>
                        </TouchableOpacity>
                    )}

                    {item.status === 'approved' && (
                        <TouchableOpacity
                            style={styles.rescheduleBtn}
                            onPress={() => navigation.navigate('VideoCall')} // 👈 navigation trigger
                        >
                            <Text style={styles.rescheduleText}>Join Appointment</Text>
                        </TouchableOpacity>
                    )}
                </View>
            </View>
        );
    };

    const renderSegmentedControl = () => (
        <View style={styles.segmentedControl}>
            {['pending', 'approved', 'cancelled'].map(status => (
                <TouchableOpacity
                    key={status}
                    style={[styles.segmentBtn, statusFilter === status && styles.segmentBtnActive]}
                    onPress={() => setStatusFilter(status)}
                >
                    <Text style={[styles.segmentText, statusFilter === status && styles.segmentTextActive]}>
                        {status.charAt(0).toUpperCase() + status.slice(1)}
                    </Text>
                </TouchableOpacity>
            ))}
        </View>
    );

    return (
        <View style={styles.container}>
            <View style={styles.headerRow}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <AntDesign name="arrowleft" size={24} color="black" />
                </TouchableOpacity>
                <Text style={styles.headerText}>My Bookings</Text>
                <View style={{ width: 24 }} />
            </View>

            {renderSegmentedControl()}

            {loading ? (
                <View style={styles.centered}>
                    <ActivityIndicator size="large" color="#007bff" />
                </View>
            ) : filteredAppointments.length === 0 ? (
                <View style={styles.centered}>
                    <Text style={{ color: '#888', fontSize: 16 }}>No record found.</Text>
                </View>
            ) : (
                <FlatList
                    data={filteredAppointments}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={renderItem}
                    contentContainerStyle={{ paddingBottom: 100 }}
                />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fafafa',
        paddingTop: 40,
        paddingHorizontal: 16,
    },
    headerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    headerText: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    segmentedControl: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 20,
        backgroundColor: '#f2f2f2',
        borderRadius: 10,
        padding: 4,
    },
    segmentBtn: {
        flex: 1,
        paddingVertical: 10,
        borderRadius: 10,
        alignItems: 'center',
    },
    segmentBtnActive: {
        backgroundColor: '#0165FC',
    },
    segmentText: {
        color: '#555',
        fontWeight: '500',
    },
    segmentTextActive: {
        color: '#fff',
    },
    card: {
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 16,
        marginBottom: 16,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 6,
        elevation: 4,
    },
    dateText: {
        fontSize: 15,
        fontWeight: '600',
        color: '#222',
    },
    topRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginVertical: 10,
    },
    remindLabel: {
        fontSize: 14,
        color: '#777',
    },
    doctorInfo: {
        flexDirection: 'row',
        gap: 10,
        alignItems: 'center',
        marginTop: 6,
    },
    avatarPlaceholder: {
        width: 60,
        height: 60,
        borderRadius: 10,
        backgroundColor: '#e0e0e0',
        justifyContent: 'center', // centers vertically
        alignItems: 'center',     // centers horizontally
    },    
    doctorName: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#222',
    },
    doctorAddress: {
        fontSize: 14,
        color: '#666',
        marginTop: 2,
    },
    bookingId: {
        fontSize: 13,
        color: '#888',
        marginTop: 2,
    },
    buttonRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 14,
    },
    cancelBtn: {
        flex: 1,
        marginRight: 10,
        backgroundColor: '#eee',
        paddingVertical: 10,
        borderRadius: 10,
        alignItems: 'center',
    },
    rescheduleBtn: {
        flex: 1,
        backgroundColor: '#0165FC',
        paddingVertical: 10,
        borderRadius: 10,
        alignItems: 'center',
    },
    cancelText: {
        color: '#555',
        fontWeight: '500',
    },
    rescheduleText: {
        color: '#fff',
        fontWeight: '500',
    },
    centered: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    boldText: {
        fontSize: 14,
        color: '#444',
        fontWeight: 'bold',
        marginTop: 4,
    },
    symptomsText: {
        fontSize: 14,
        color: '#555',
        marginTop: 4,
        fontStyle: 'italic',
        fontWeight: 'bold',
    },
});