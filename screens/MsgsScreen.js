import React, { useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Alert } from "react-native";
import { AntDesign } from '@expo/vector-icons';
import { getFirestore, collection, query, where, getDocs, addDoc, deleteDoc, doc } from "firebase/firestore";
import LottieView from 'lottie-react-native'; // Import LottieView

const db = getFirestore();

const MsgsScreen = ({ route, navigation }) => {
  const { tailorEmail, orderNumber } = route.params;
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true); // Add loading state

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const usersCollectionRef = collection(db, "users");
        const userQuery = query(usersCollectionRef, where("email", "==", tailorEmail));
        const userSnapshot = await getDocs(userQuery);
  
        if (!userSnapshot.empty) {
          const userId = userSnapshot.docs[0].id;
          const customerRequestsRef = collection(db, "users", userId, "customerRequests");
          const orderQuery = query(customerRequestsRef, where("orderNumber", "==", orderNumber));
          const orderSnapshot = await getDocs(orderQuery);
  
          if (!orderSnapshot.empty) {
            const orderId = orderSnapshot.docs[0].id;
            const messagesRef = collection(db, "users", userId, "customerRequests", orderId, "Messages");
            const messagesSnapshot = await getDocs(messagesRef);
  
            if (!messagesSnapshot.empty) {
              const messagesData = messagesSnapshot.docs.map(doc => {
                const data = doc.data();
                console.log("Message Data:", data); // Log the message data
                if (data.isCustomer) {
                  return { id: doc.id, message: data.message, isCustomer: true };
                } else if (data.isTailor) {
                  return { id: doc.id, message: data.message, isTailor: true };
                }
              });
              console.log("Messages Data:", messagesData); // Log the messagesData array
              setMessages(messagesData.filter(Boolean));
              setLoading(false); // Update loading state when messages are fetched
            } else {
              console.log("No messages found for this order.");
              setLoading(false); // Update loading state when there are no messages
            }
          } else {
            console.log("Order not found.");
            setLoading(false); // Update loading state when order not found
          }
        } else {
          console.log("Tailor not found.");
          setLoading(false); // Update loading state when tailor not found
        }
      } catch (error) {
        console.error("Error fetching messages:", error);
        Alert.alert("Error", "Failed to fetch messages. Please try again.");
        setLoading(false); // Update loading state in case of error
      }
    };
  
    fetchMessages();
  }, [tailorEmail, orderNumber]);

  const sendMessage = async () => {
    if (message.trim() === "") return;
  
    try {
      const usersCollectionRef = collection(db, "users");
      const userQuery = query(usersCollectionRef, where("email", "==", tailorEmail));
      const userSnapshot = await getDocs(userQuery);
  
      if (!userSnapshot.empty) {
        const userId = userSnapshot.docs[0].id;
        const customerRequestsRef = collection(db, "users", userId, "customerRequests");
        const orderQuery = query(customerRequestsRef, where("orderNumber", "==", orderNumber));
        const orderSnapshot = await getDocs(orderQuery);
  
        if (!orderSnapshot.empty) {
          const orderId = orderSnapshot.docs[0].id;
          const messagesRef = collection(db, "users", userId, "customerRequests", orderId, "Messages");
  
          // Add a new document with a generated ID
          const newMessageRef = await addDoc(messagesRef, {
            message: message,
            userId: userId,
            isCustomer: true // Assuming this is the customer's message
          });
  
          // Update local state with the new message
          setMessages([...messages, { id: newMessageRef.id, message: message, isCustomer: true }]);
          setMessage("");
        } else {
          console.log("Order not found.");
        }
      } else {
        console.log("Tailor not found.");
      }
    } catch (error) {
      console.error("Error sending message:", error);
      Alert.alert("Error", "Failed to send message. Please try again.");
    }
  };

  
  const deleteMessage = async (id) => {
    try {
      const usersCollectionRef = collection(db, "users");
      const userQuery = query(usersCollectionRef, where("email", "==", tailorEmail));
      const userSnapshot = await getDocs(userQuery);

      if (!userSnapshot.empty) {
        const userId = userSnapshot.docs[0].id;
        const customerRequestsRef = collection(db, "users", userId, "customerRequests");
        const orderQuery = query(customerRequestsRef, where("orderNumber", "==", orderNumber));
        const orderSnapshot = await getDocs(orderQuery);

        if (!orderSnapshot.empty) {
          const orderId = orderSnapshot.docs[0].id;
          const messagesRef = collection(db, "users", userId, "customerRequests", orderId, "TailorMsgs");
          await deleteDoc(doc(messagesRef, id));

          // Remove the message from local state
          setMessages(prevMessages => prevMessages.filter(msg => msg.id !== id));
        }
      }
    } catch (error) {
      console.error("Error deleting message:", error);
      Alert.alert("Error", "Failed to delete message. Please try again.");
    }
  };

  const clearAllMessages = () => {
    Alert.alert(
      "Clear All Messages",
      "Are you sure you want to clear all messages?",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        {
          text: "Clear",
          onPress: () => {
            setMessages([]);
          },
          style: "destructive"
        }
      ]
    );
  };

  const handleBackPress = () => {
    navigation.navigate('Tabs', { tailorEmail });
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: "#fff" }}
      behavior={Platform.OS === "ios" ? "padding" : null}
      keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 50}
    >
      <View style={{ flexDirection: "row", justifyContent: "flex-start", alignItems: "center", paddingHorizontal: 20, paddingTop: 20 }}>
        <TouchableOpacity onPress={clearAllMessages}>
          <Text style={{ fontSize: 24, left: 325, bottom: 20 }}>...</Text>
        </TouchableOpacity>
        <TouchableOpacity style={{right:20, bottom: 10 }} onPress={handleBackPress}>
          <AntDesign name="leftcircleo" size={24} color="black" />
        </TouchableOpacity>
      </View>
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View style={{ flex: 1 }}>
          {loading ? (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
              <LottieView
                style={{ width: 200, height: 200 }}
                source={require('../assets/animations/msg1.json')} // Replace './empty_box.json' with the path to your Lottie animation
                autoPlay
                loop
              />
              <Text style={{ textAlign: 'center', marginTop: 20 }}>Send a msg to Tailor</Text>
            </View>
          ) : (
            <ScrollView contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 20 }}>
              {/* Reverse the messages array and map over it */}
              {messages.slice().reverse().map((msg, index) => {
                if (msg.isCustomer) {
                  return (
                    <View key={index} style={{ flexDirection: "row", justifyContent: "flex-start", alignItems: "center" }}>
                      <TouchableWithoutFeedback onLongPress={() => deleteMessage(msg.id)}>
                        <View style={{ backgroundColor: "yellow", padding: 10, marginVertical: 5, borderRadius: 8 }}>
                          <Text style={{ color: "#000" }}>{msg.message}</Text>
                        </View>
                      </TouchableWithoutFeedback>
                    </View>
                  );
                } else {
                  return (
                    <View key={index} style={{ flexDirection: "row", justifyContent: "flex-start", alignItems: "center" }}>
                      <TouchableWithoutFeedback onLongPress={() => deleteMessage(msg.id)}>
                        <View style={{ backgroundColor: "lightblue", padding: 10, marginVertical: 5, borderRadius: 8 }}>
                          <Text style={{ color: "#fff" }}>{msg.message}</Text>
                        </View>
                      </TouchableWithoutFeedback>
                    </View>
                  );
                }
              })}
            </ScrollView>
          )}
        </View>
      </ScrollView>
      <View style={{ flexDirection: "row", alignItems: "center", paddingHorizontal: 20, paddingBottom: 10 }}>
        <TextInput
          style={{ flex: 1, borderWidth: 1, borderColor: "#ccc", borderRadius: 20, paddingHorizontal: 15, paddingVertical: 10, marginRight: 10 }}
          placeholder="Type your message..."
          value={message}
          onChangeText={(text) => setMessage(text)}
        />
        <TouchableOpacity onPress={sendMessage} style={{ backgroundColor: "#059FA5", padding: 15, borderRadius: 20 }}>
          <Text style={{ color: "#fff", fontWeight: "bold" }}>Send</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

export default MsgsScreen;
