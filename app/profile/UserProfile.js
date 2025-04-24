// import React, { useEffect, useState } from 'react';
// import {
//   View,
//   Text,
//   StyleSheet,
//   Image,
//   ScrollView,
//   TouchableOpacity,
//   TextInput,
//   Alert,
// } from 'react-native';
// import { supabase } from '../../utils/supabaseClient';
// import { Ionicons } from '@expo/vector-icons'; // for the back arrow

// const UserProfile = ({ navigation }) => {
//   const [name, setName] = useState('');
//   const [originalName, setOriginalName] = useState('');
//   const [isEditing, setIsEditing] = useState(false);

//   useEffect(() => {
//     const fetchUserProfile = async () => {
//       const {
//         data: { session },
//         error: sessionError,
//       } = await supabase.auth.getSession();

//       if (sessionError) {
//         console.error('Error fetching session:', sessionError.message);
//         return;
//       }

//       const userId = session?.user?.id;

//       if (userId) {
//         const { data, error } = await supabase
//           .from('patients')
//           .select('full_name')
//           .eq('user_id', userId)
//           .maybeSingle();

//         if (error) {
//           console.error('Error fetching patient data:', error.message);
//         } else if (data) {
//           setName(data.full_name);
//           setOriginalName(data.full_name);
//         }
//       }
//     };

//     fetchUserProfile();
//   }, []);

//   const handleNameChange = (text) => {
//     setName(text);
//     setIsEditing(text !== originalName);
//   };

//   const handleSave = async () => {
//     const {
//       data: { session },
//     } = await supabase.auth.getSession();

//     const userId = session?.user?.id;

//     if (!userId) return;

//     const { error } = await supabase
//       .from('patients')
//       .update({ full_name: name })
//       .eq('user_id', userId);

//     if (error) {
//       Alert.alert('Error', 'Failed to update name.');
//       console.error(error.message);
//     } else {
//       setOriginalName(name);
//       setIsEditing(false);
//       Alert.alert('Success', 'Name updated successfully!');
//     }
//   };

//   return (
//     <ScrollView style={styles.container}>
//       {/* 🔙 Back Button */}
//       <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
//         <Ionicons name="arrow-back" size={24} color="#fff" />
//       </TouchableOpacity>

//       <View style={styles.profileSection}>
//         <Image
//           source={require('../../assets/images/UserProfile.png')}
//           style={styles.profileImage}
//         />
//         <TextInput
//           style={styles.profileNameInput}
//           value={name}
//           onChangeText={handleNameChange}
//           placeholder="Enter your name"
//           placeholderTextColor="#888"
//         />
//         {isEditing && (
//           <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
//             <Text style={styles.saveButtonText}>Save</Text>
//           </TouchableOpacity>
//         )}
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
//     paddingTop: 50,
//   },
//   backButton: {
//     position: 'absolute',
//     top: 40,
//     left: 20,
//     zIndex: 1,
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
//   profileNameInput: {
//     fontSize: 22,
//     fontWeight: 'bold',
//     color: '#fff',
//     marginTop: 10,
//     textAlign: 'center',
//     borderBottomColor: '#2e90fa',
//     borderBottomWidth: 1,
//     paddingVertical: 4,
//     width: '80%',
//   },
//   saveButton: {
//     backgroundColor: '#2e90fa',
//     paddingVertical: 10,
//     paddingHorizontal: 20,
//     borderRadius: 8,
//     marginTop: 10,
//   },
//   saveButtonText: {
//     color: '#fff',
//     fontSize: 16,
//     fontWeight: '600',
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

import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { supabase } from '../../utils/supabaseClient';
import { Ionicons } from '@expo/vector-icons';

const UserProfile = ({ navigation }) => {
  const [fullName, setFullName] = useState('');
  const [userId, setUserId] = useState('');

  useEffect(() => {
    const fetchUserProfile = async () => {
      const {
        data: { session },
        error: sessionError,
      } = await supabase.auth.getSession();

      if (sessionError) {
        console.error('Session Error:', sessionError.message);
        return;
      }

      const uid = session?.user?.id;
      setUserId(uid);

      if (uid) {
        const { data, error } = await supabase
          .from('patients')
          .select('full_name')
          .eq('user_id', uid)
          .maybeSingle();

        if (error) {
          console.error('Error fetching patient data:', error.message);
        } else if (data) {
          setFullName(data.full_name);
        }
      }
    };

    fetchUserProfile();
  }, []);

  return (
    <ScrollView style={styles.container}>
      {/* 🔙 Back Button */}
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Ionicons name="arrow-back" size={24} color="#fff" />
      </TouchableOpacity>

      <View style={styles.profileSection}>
        <Image
          source={require('../../assets/images/UserProfile.png')}
          style={styles.profileImage}
        />
        <Text style={styles.profileName}>{fullName || 'Loading name...'}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Health</Text>
        <Option
          text="Health Details"
          onPress={() => navigation.navigate('HealthDetails')}
        />
        <Option
          text="Medical ID"
          onPress={() => navigation.navigate('MyId', { user_id: userId })}
        />
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

const Option = ({ text, onPress }) => (
  <TouchableOpacity style={styles.option} onPress={onPress}>
    <Text style={styles.optionText}>{text}</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
    paddingHorizontal: 20,
    paddingTop: 50,
  },
  backButton: {
    position: 'absolute',
    top: 40,
    left: 20,
    zIndex: 1,
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
  profileName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 10,
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
