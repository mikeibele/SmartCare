import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, ScrollView, Image } from 'react-native';
import { supabase } from '../../utils/supabaseClient';
import { useNavigation } from '@react-navigation/native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { AntDesign, MaterialCommunityIcons } from '@expo/vector-icons';

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
            <View style={styles.headerImage}>
                <View style={styles.headerContainer}>
                    <TouchableOpacity onPress={() => navigation.goBack()}>
                        <AntDesign name="arrowleft" size={24} color="#06191D" />
                    </TouchableOpacity>
                </View>

                <View style={styles.profileSection}>
                    <Image
                        source={require('../../assets/images/UserProfile.png')}
                        style={styles.profilePic}
                    />
                    <Text style={styles.userName}>{userData?.full_name || 'Full Name'}</Text>
                    <Text style={styles.locationText}>{userData?.address || 'N/A'}</Text>
                </View>
            </View>

            <View style={styles.metricsRow}>
                <View style={styles.metricBox}>
                    <MaterialCommunityIcons name="gender-male-female" size={24} color="#06191D" />
                    <Text style={styles.metricValue}>{userData?.gender || 'N/A'}</Text>
                    <Text style={styles.metricLabel}>Gender</Text>
                </View>
                <View style={styles.metricBox}>
                    <MaterialCommunityIcons name="weight-kilogram" size={24} color="#06191D" />
                    <Text style={styles.metricValue}>{userData?.weight || 'N/A'} kg</Text>
                    <Text style={styles.metricLabel}>Weight</Text>
                </View>
                <View style={styles.metricBox}>
                    <MaterialCommunityIcons name="human-male-height" size={24} color="#06191D" />
                    <Text style={styles.metricValue}>{userData?.height || 'N/A'} ft</Text>
                    <Text style={styles.metricLabel}>Height</Text>
                </View>
            </View>

            <View style={styles.metricsRow}>
                <View style={styles.metricBox}>
                    <MaterialCommunityIcons name="water" size={24} color="#06191D" />
                    <Text style={styles.metricValue}>{userData?.blood_type || 'N/A'}</Text>
                    <Text style={styles.metricLabel}>Blood Type</Text>
                </View>
                <View style={styles.metricBox}>
                    <MaterialCommunityIcons name="phone" size={24} color="#06191D" />
                    <Text style={styles.metricValue}>{userData?.emergency_contact || 'N/A'}</Text>
                    <Text style={styles.metricLabel}>Emergency</Text>
                </View>
                <View style={styles.metricBox}>
                    <MaterialCommunityIcons name="alert-circle" size={24} color="#06191D" />
                    <Text style={styles.metricValue}>
                        {userData?.allergies ? (userData.allergies.length > 10 ? userData.allergies.slice(0, 10) + '...' : userData.allergies) : 'None'}
                    </Text>
                    <Text style={styles.metricLabel}>Allergies</Text>
                </View>
            </View>


            {loading ? (
                <ActivityIndicator size="large" color="#2e90fa" />
            ) : !userData ? (
                <Text style={styles.empty}>No health details found.</Text>
            ) : null}
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f7f9fc',
    },
    backButton: {
        position: 'absolute',
        top: 40,
        left: 20,
        zIndex: 100, // ensure it's above everything
        backgroundColor: '#1e1e1e',
        padding: 8,
        borderRadius: 20,
        marginBottom: 50
    },
    headerImage: {
        backgroundColor: '#fff',
        paddingTop: 60,
        paddingBottom: 30,
        borderBottomLeftRadius: 30,
        borderBottomRightRadius: 30,
        // alignItems: 'center',
        justifyContent: 'center',
    },
    profileSection: {
        alignItems: 'center',
    },
    profilePic: {
        width: 80,
        height: 80,
        borderRadius: 40,
        borderWidth: 2,
        borderColor: '#fff',
    },
    userName: {
        marginTop: 10,
        fontSize: 20,
        fontWeight: 'bold',
        color: '#1e1e1e',
    },
    locationText: {
        color: '#777',
        marginTop: 4,
        fontSize: 14,
    },
    metricsRow: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginTop: 20,
        marginHorizontal: 10,
    },
    metricBox: {
        backgroundColor: '#fff',
        padding: 16,
        borderRadius: 16,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
        width: '30%',
    },
    metricValue: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#1e1e1e',
    },
    metricLabel: {
        fontSize: 12,
        color: '#888',
        marginTop: 4,
    },
    empty: {
        color: '#aaa',
        fontSize: 16,
        textAlign: 'center',
        marginTop: 30,
    },
    headerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
        gap: 10,
        paddingLeft: 10,
    },
});

export default HealthDetails;
