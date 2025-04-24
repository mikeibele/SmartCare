// import React from 'react';
// import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity } from 'react-native';

// const UserProfile = ({ navigation }) => {
//   return (
//     <ScrollView style={styles.container}>
//       <View style={styles.profileSection}>
//         <Image
//           source={require('../../assets/images/UserProfile.png')} // Replace with your image path
//           style={styles.profileImage}
//         />
//         <Text style={styles.profileName}>Akporhiegbe Mudiaga</Text>
//       </View>

//       <View style={styles.section}>
//         <Text style={styles.sectionTitle}>Health</Text>
//         <Option text="Health Details" />
//         <Option text="Medical ID" />
//       </View>

//       <View style={styles.section}>
//         <Text style={styles.sectionTitle}>Features</Text>
//         <Option text="Health Checklist" />
//         <Option text="Notifications" />
//       </View>

//       <View style={styles.section}>
//         <Text style={styles.sectionTitle}>Privacy</Text>
//         <Option text="Apps" />
//         <Option text="Research Studies" />
//         <Option text="Devices" />
//       </View>

//       <TouchableOpacity style={styles.exportButton}>
//         <Text style={styles.exportText}>Export All Health Data</Text>
//       </TouchableOpacity>

//       <Text style={styles.syncInfo}>
//         Health data last synced to iCloud at 06:24.
//         {'\n'}Your health data is saved to iCloud when your iPhone is unlocked and connected to Wi-Fi.
//       </Text>
//     </ScrollView>
//   );
// };

// const Option = ({ text }) => (
//   <TouchableOpacity style={styles.option}>
//     <Text style={styles.optionText}>{text}</Text>
//   </TouchableOpacity>
// );

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#121212',
//     paddingHorizontal: 20,
//   },
//   profileSection: {
//     alignItems: 'center',
//     marginVertical: 30,
//   },
//   profileImage: {
//     width: 90,
//     height: 90,
//     borderRadius: 45,
//   },
//   profileName: {
//     fontSize: 22,
//     fontWeight: 'bold',
//     color: '#fff',
//     marginTop: 10,
//   },
//   section: {
//     marginBottom: 30,
//   },
//   sectionTitle: {
//     fontSize: 18,
//     color: '#fff',
//     fontWeight: 'bold',
//     marginBottom: 10,
//   },
//   option: {
//     backgroundColor: '#1e1e1e',
//     paddingVertical: 15,
//     paddingHorizontal: 20,
//     borderRadius: 10,
//     marginBottom: 10,
//   },
//   optionText: {
//     color: '#fff',
//     fontSize: 16,
//   },
//   exportButton: {
//     backgroundColor: '#1e1e1e',
//     padding: 15,
//     borderRadius: 10,
//     alignItems: 'center',
//     marginBottom: 10,
//   },
//   exportText: {
//     color: '#2e90fa',
//     fontSize: 16,
//   },
//   syncInfo: {
//     color: '#aaa',
//     fontSize: 13,
//     marginBottom: 20,
//     textAlign: 'center',
//   },
// });

// export default UserProfile;


import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
} from 'react-native';

const UserProfile = ({ navigation }) => {
  const [name, setName] = useState('Akporhiegbe Mudiaga');
  const [originalName, setOriginalName] = useState('Akporhiegbe Mudiaga');
  const [isEditing, setIsEditing] = useState(false);

  const handleNameChange = (text) => {
    setName(text);
    setIsEditing(text !== originalName);
  };

  const handleSave = () => {
    setOriginalName(name);
    setIsEditing(false);
    Alert.alert('Success', 'Name updated successfully!');
    // 🔄 Optional: You can update this value to Supabase here.
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.profileSection}>
        <Image
          source={require('../../assets/images/UserProfile.png')}
          style={styles.profileImage}
        />
        <TextInput
          style={styles.profileNameInput}
          value={name}
          onChangeText={handleNameChange}
          placeholder="Enter your name"
          placeholderTextColor="#888"
        />
        {isEditing && (
          <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
            <Text style={styles.saveButtonText}>Save</Text>
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Health</Text>
        <Option text="Health Details" />
        <Option text="Medical ID" />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Features</Text>
        <Option text="Health Checklist" />
        <Option text="Notifications" />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Privacy</Text>
        <Option text="Apps" />
        <Option text="Research Studies" />
        <Option text="Devices" />
      </View>

      <TouchableOpacity style={styles.exportButton}>
        <Text style={styles.exportText}>Export All Health Data</Text>
      </TouchableOpacity>

      <Text style={styles.syncInfo}>
        Health data last synced to iCloud at 06:24.
        {'\n'}Your health data is saved to iCloud when your iPhone is unlocked and connected to Wi-Fi.
      </Text>
    </ScrollView>
  );
};

const Option = ({ text }) => (
  <TouchableOpacity style={styles.option}>
    <Text style={styles.optionText}>{text}</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
    paddingHorizontal: 20,
  },
  profileSection: {
    alignItems: 'center',
    marginVertical: 30,
  },
  profileImage: {
    width: 90,
    height: 90,
    borderRadius: 45,
  },
  profileNameInput: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 10,
    textAlign: 'center',
    borderBottomColor: '#2e90fa',
    borderBottomWidth: 1,
    paddingVertical: 4,
    width: '80%',
  },
  saveButton: {
    backgroundColor: '#2e90fa',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginTop: 10,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 18,
    color: '#fff',
    fontWeight: 'bold',
    marginBottom: 10,
  },
  option: {
    backgroundColor: '#1e1e1e',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginBottom: 10,
  },
  optionText: {
    color: '#fff',
    fontSize: 16,
  },
  exportButton: {
    backgroundColor: '#1e1e1e',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 10,
  },
  exportText: {
    color: '#2e90fa',
    fontSize: 16,
  },
  syncInfo: {
    color: '#aaa',
    fontSize: 13,
    marginBottom: 20,
    textAlign: 'center',
  },
});

export default UserProfile;
