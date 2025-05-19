// app/screen/components/MeetingView.js
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function MeetingView() {
    return (
        <View style={styles.container}>
            <Text style={styles.text}>Video call screen (replace with actual UI)</Text>
            {/* Replace with actual VideoSDK components */}
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#000', justifyContent: 'center', alignItems: 'center' },
    text: { color: '#fff', fontSize: 20 },
});
