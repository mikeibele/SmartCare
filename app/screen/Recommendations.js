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

                const context = `Patient Info: Name: ${patient.full_name}, Age: ${patient.age}, Gender: ${patient.gender}, Weight: ${patient.weight}, Height: ${patient.height}, Known Conditions: ${patient.health_history || "None"}, Allergies: ${patient.allergies || "None"}`;
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
        const parseBoldText = (text) => {
            const parts = text.split(/(\*\*[^*]+\*\*)/g); // Split around **bold**
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
                    item.user ? styles.userWrapper : styles.aiWrapper,
                ]}
            >
                <View style={[styles.messageBubble, item.user ? styles.userBubble : styles.aiBubble]}>
                    <Text style={styles.messageText}>{parseBoldText(item.text)}</Text>
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
                <Text style={styles.headerTitle}>Recommendations</Text>
            </View>


            <FlatList
                data={messages}
                renderItem={renderMessage}
                keyExtractor={(_, index) => index.toString()}
                contentContainerStyle={{ paddingBottom: 10 }}
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
                    <FontAwesome name="send" size={20} color="white" />
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#e5ddd5",
        paddingTop: 50,
    },
    messageWrapper: {
        paddingHorizontal: 10,
        marginVertical: 4,
        flexDirection: "row",
    },
    userWrapper: {
        justifyContent: "flex-end",
    },
    aiWrapper: {
        justifyContent: "flex-start",
    },
    messageBubble: {
        maxWidth: "75%",
        padding: 10,
        borderRadius: 15,
    },
    userBubble: {
        backgroundColor: "#dcf8c6",
        borderTopLeftRadius: 0,
    },
    aiBubble: {
        backgroundColor: "#ffffff",
        borderTopRightRadius: 0,
    },
    messageText: {
        fontSize: 16,
        color: "#000",
    },
    inputContainer: {
        flexDirection: "row",
        alignItems: "center",
        padding: 10,
        backgroundColor: "#f0f0f0",
    },
    input: {
        flex: 1,
        padding: 10,
        backgroundColor: "#fff",
        borderRadius: 25,
        height: 50,
        color: "#000",
    },
    sendIcon: {
        padding: 10,
        backgroundColor: "#075e54",
        borderRadius: 25,
        height: 50,
        width: 50,
        justifyContent: "center",
        alignItems: "center",
        marginLeft: 8,
    },
    tipsButton: {
        backgroundColor: "#128c7e",
        marginHorizontal: 20,
        marginBottom: 8,
        paddingVertical: 12,
        borderRadius: 25,
        alignItems: "center",
    },
    tipsButtonText: {
        color: "white",
        fontSize: 16,
        fontWeight: "bold",
    },


    header: {
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 10,
        marginBottom: 10,
    },
    backButton: {
        marginRight: 10,
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: "bold",
        color: "#000",
    },
    
});

export default Recommendations;
