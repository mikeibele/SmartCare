import React from 'react';
import {
    View,
    Text,
    Image,
    StyleSheet,
    TouchableOpacity,
    Linking
} from 'react-native';
import { Provider } from 'react-native-paper';
import { StatusBar as RNStatusBar } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

export default function WelcomeScreen({ navigation }) {
    return (
        <Provider>
            <RNStatusBar backgroundColor="#0165FC" barStyle="light-content" />
            <LinearGradient
                colors={['#0165FC', '#0B2A30']} // You can tweak the gradient here
                style={styles.container} // 0165FC 06191D
            >
                <View style={styles.header}>
                    <Image
                        source={require('../../assets/images/dn.png')}
                        style={styles.logo}
                    />
                    <Text
                        style={{
                            fontSize: 40,
                            color: 'white',
                        }}
                    > 
                        Welcome to SmartCare
                     </Text>
                </View>


                <View style={styles.buttonContainer}>
                    <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Signup')}>
                        <Text style={styles.buttonText}>Create a new account</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={[styles.button, styles.signInButton]} onPress={() => navigation.navigate('Login')}>
                        <Text style={styles.signInButtonText}>Sign in</Text>
                    </TouchableOpacity>
                </View>

                {/* <Text style={styles.textfooter}>
                    By continuing, you agree to our{' '}
                    <Text
                        style={styles.linkText}
                        onPress={() => Linking.openURL('https://akporhiegbeking.github.io/PlutoidPrivacyPolicy/')}
                    >
                        Terms of service and Privacy Policy
                    </Text>.
                </Text> */}
            </LinearGradient>
        </Provider>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingVertical: 50,
    },
    header: {
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1,
    },
    logo: {
        width: "100%",
        height: 260,
        marginBottom: 20,
    },
    textfooter: {
        fontSize: 15,
        color: 'white',
        textAlign: 'center',
    },
    linkText: {
        textDecorationLine: 'underline',
        color: '#FFD700', // Gold-ish for better contrast
    },
    buttonContainer: {
        width: '100%',
    },
    button: {
        backgroundColor: '#0165FC',
        paddingVertical: 15,
        paddingHorizontal: 10,
        borderRadius: 30,
        marginBottom: 20,
        alignItems: 'center',
    },
    signInButton: {
        backgroundColor: '#f8f9fa',
        borderColor: 'grey',
        borderWidth: 1,
    },
    buttonText: {
        color: '#000',
        fontSize: 18,
    },
    signInButtonText: {
        color: 'black',
        fontSize: 18,
    },
});
