// app/screen/Recommendations.js
import React, { useState, useEffect } from "react";
import {
    View,
    Text,
    TextInput,
    FlatList,
    StyleSheet,
    TouchableOpacity,
} from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import FlashMessage, { showMessage } from "react-native-flash-message";
import * as GoogleGenerativeAI from "@google/generative-ai";
import { supabase } from "../../utils/supabaseClient";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons"; // For back arrow

const Recommendations = () => {
    const [messages, setMessages] = useState([]);
    const [userInput, setUserInput] = useState("");
    const [patientContext, setPatientContext] = useState("");
    const [fullName, setFullName] = useState("");
    const navigation = useNavigation();

    const API_KEY = "AIzaSyDsJeBfkK8WzF1yzGMcTEAbuyrvV-ioHnw";

    useEffect(() => {
        const fetchPatientData = async () => {
            try {
                const { data: { session }, error: sessionError } = await supabase.auth.getSession();
                if (sessionError || !session) throw new Error("No session found");

                const userId = session.user.id;

                const { data: patient, error: patientError } = await supabase
                    .from("patients")
                    .select("*")
                    .eq("user_id", userId)
                    .maybeSingle();

                if (patientError || !patient) throw patientError || new Error("Patient not found");

                // Calculate age from DOB
                const calculateAge = (dob) => {
                    const birthDate = new Date(dob);
                    const today = new Date();
                    let age = today.getFullYear() - birthDate.getFullYear();
                    const m = today.getMonth() - birthDate.getMonth();
                    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
                        age--;
                    }
                    return age;
                };

                const age = patient.dob ? calculateAge(patient.dob) : patient.age || "Unknown";

                const context = `Patient Info: Name: ${patient.full_name}, Age: ${age}, Gender: ${patient.gender}, Weight: ${patient.weight}, Height: ${patient.height}, Known Conditions: ${patient.health_history || "None"}, Allergies: ${patient.allergies || "None"}`;

                setPatientContext(context);
                setFullName(patient.full_name);

                // showMessage({
                //     message: `Welcome to SmartCare 🤖`,
                //     description: `Hello ${patient.full_name}, ask for personalized health tips!`,
                //     type: "info",
                // });
            } catch (err) {
                console.error("Patient fetch error:", err.message);
                showMessage({
                    message: "Error",
                    description: "Failed to load patient data.",
                    type: "danger",
                });
            }
        };

        fetchPatientData();
    }, []);

    const sendMessage = async () => {
        if (!userInput.trim()) return;
        const userMessage = { text: userInput, user: true };
        setMessages((prev) => [...prev, userMessage]);
        setUserInput("");
        try {
            const genAI = new GoogleGenerativeAI.GoogleGenerativeAI(API_KEY);
            const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-001" });
            const fullPrompt = `${patientContext}\n\nUser Question: ${userMessage.text}`;
            const result = await model.generateContent(fullPrompt);
            const response = result.response;
            const botReply = response.text();
            setMessages((prev) => [...prev, { text: botReply, user: false }]);
        } catch (error) {
            console.error("Gemini error:", error.message);
            showMessage({
                message: "AI Error",
                description: "Failed to get AI response.",
                type: "danger",
            });
        }
    };

    const sendPersonalizedTip = async () => {
        try {
            const genAI = new GoogleGenerativeAI.GoogleGenerativeAI(API_KEY);
            const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-001" });

            const prompt = `${patientContext}\n\nGive personalized health tips for ${fullName}.`;
            const result = await model.generateContent(prompt);
            const response = result.response;
            const tips = response.text();

            setMessages((prev) => [...prev, { text: tips, user: false }]);
        } catch (error) {
            console.error("Gemini error:", error.message);
            showMessage({
                message: "AI Error",
                description: "Failed to generate personalized tips.",
                type: "danger",
            });
        }
    };

    const renderMessage = ({ item }) => {
        const isUser = item.user;
        const parseBoldText = (text) => {
            const parts = text.split(/(\*\*[^*]+\*\*)/g);
            return parts.map((part, index) => {
                if (part.startsWith("**") && part.endsWith("**")) {
                    return (
                        <Text key={index} style={{ fontWeight: "bold" }}>
                            {part.slice(2, -2)}
                        </Text>
                    );
                }
                return <Text key={index}>{part}</Text>;
            });
        };
    
        return (
            <View
                style={[
                    styles.messageWrapper,
                    isUser ? styles.userWrapper : styles.aiWrapper,
                ]}
            >
                <View style={[styles.messageBubble, isUser ? styles.userBubble : styles.aiBubble]}>
                    <Text style={[styles.messageText, !isUser && styles.aiText]}>
                        {parseBoldText(item.text)}
                    </Text>
                </View>
            </View>
        );
    };

    return (
        <View style={styles.container}>
            {/* <FlashMessage position="top" /> */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color="#000" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>A.I Assistant</Text>
            </View>

            <FlatList
                // data={messages}
                data={[...messages].reverse()} // reverse to mimic Telegram style
                renderItem={renderMessage}
                keyExtractor={(_, index) => index.toString()}
                contentContainerStyle={{ paddingBottom: 10 }}
                inverted
            />

            <TouchableOpacity style={styles.tipsButton} onPress={sendPersonalizedTip}>
                <Text style={styles.tipsButtonText}>🎯 Get Personalized Tips</Text>
            </TouchableOpacity>

            <View style={styles.inputContainer}>
                <TextInput
                    placeholder="Ask a health question..."
                    placeholderTextColor="#999"
                    onChangeText={setUserInput}
                    value={userInput}
                    onSubmitEditing={sendMessage}
                    style={styles.input}
                />
                <TouchableOpacity style={styles.sendIcon} onPress={sendMessage}>
                    <FontAwesome name="send" size={20} color="#fff" />
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
        paddingTop: 50,
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 15,
        paddingBottom: 10,
        backgroundColor: "#ffffff",
        borderBottomWidth: 1,
        borderBottomColor: "#e0e0e0",
    },
    backButton: {
        marginRight: 10,
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: "bold",
        color: "#000",
    },
    messageWrapper: {
        flexDirection: "row",
        paddingHorizontal: 10,
        marginVertical: 6,
    },
    userWrapper: {
        justifyContent: "flex-end",
    },
    aiWrapper: {
        justifyContent: "flex-start",
    },
    messageBubble: {
        padding: 12,
        borderRadius: 20,
        maxWidth: "80%",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 1.5,
        elevation: 2,
    },
    userBubble: {
        backgroundColor: "#0165FC",
        borderTopLeftRadius: 5,
        marginLeft: "auto",
    },
    aiBubble: {
        backgroundColor: "#e8e8e8",
        borderTopRightRadius: 5,
        marginRight: "auto",
    },
    messageText: {
        fontSize: 16,
        color: "#fff",
    },
    aiText: {
        color: "#000",
    },
    inputContainer: {
        flexDirection: "row",
        alignItems: "center",
        padding: 8,
        borderTopWidth: 1,
        borderTopColor: "#ccc",
        backgroundColor: "#fff",
    },
    input: {
        flex: 1,
        paddingHorizontal: 15,
        paddingVertical: 10,
        backgroundColor: "#f1f1f1",
        borderRadius: 25,
        fontSize: 16,
        color: "#000",
    },
    sendIcon: {
        backgroundColor: "#0165FC",
        padding: 12,
        marginLeft: 10,
        borderRadius: 25,
        justifyContent: "center",
        alignItems: "center",
    },
    tipsButton: {
        backgroundColor: "#06191D",
        marginHorizontal: 20,
        marginVertical: 8,
        paddingVertical: 12,
        borderRadius: 25,
        alignItems: "center",
    },
    tipsButtonText: {
        color: "white",
        fontSize: 16,
        fontWeight: "600",
    },
});

export default Recommendations;
