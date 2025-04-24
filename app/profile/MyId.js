import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useRoute } from '@react-navigation/native';

const MyId = () => {
  const route = useRoute();
  const { user_id } = route.params;

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Your User ID:</Text>
      <Text style={styles.value}>{user_id}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: '#121212',
  },
  label: {
    color: '#ccc',
    fontSize: 18,
    marginBottom: 8,
  },
  value: {
    color: '#fff',
    fontSize: 22,
    fontWeight: 'bold',
  },
});

export default MyId;
