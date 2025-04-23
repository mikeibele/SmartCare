// app/components/Tile.js
import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

export default function Tile({ icon, color, text, onPress }) {
  return (
    <TouchableOpacity style={styles.tile} onPress={onPress}>
      <Icon name={icon} size={30} color={color} />
      <Text style={styles.tileText}>{text}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  tile: {
    backgroundColor: '#fff',
    flex: 0.48,
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
    elevation: 2,
  },
  tileText: {
    marginTop: 10,
    color: '#333',
    fontWeight: '500',
  },
});
