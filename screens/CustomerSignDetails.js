import React, { useState, useEffect } from 'react';
import { View, Text, Modal, Pressable, TextInput, Image, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import { addDoc, collection, doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";
import { useRoute } from "@react-navigation/native";

const ModalView = ({ visible, onClose, onNext, navigation }) => {
  const [shopName, setShopName] = useState('');
  const [shopAddress, setShopAddress] = useState('');
  const [image, setImage] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [selectedCity, setSelectedCity] = useState(null);
  const [selectedArea, setSelectedArea] = useState('');
  const [isCityModalVisible, setIsCityModalVisible] = useState(false);
  const route = useRoute();

  const { uid } = route.params || {};

  useEffect(() => {
    const fetchUserRole = async () => {
      try {
        // Fetch userRole from Firebase
        const userDoc = await getDoc(doc(db, "users", uid));
        if (userDoc.exists()) {
          const userData = userDoc.data();
          setUserRole(userData.role || null);
        } else {
          console.error("Error: User document not found");
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    if (uid) {
      fetchUserRole();
    }
  }, [uid]);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    console.log(result);

    if (!result.cancelled) {
      setImage(result.assets[0].uri);
    }
  };

  const handleNext = async () => {
    if (selectedCity === null || selectedArea.trim() === "") {
      Alert.alert("Error", "Choose City as well as enter Area");
    } else {
      try {
        if (uid && userRole) {
          // Determine the collection name based on the user role
          const collectionName = userRole === "Customer" ? "customerSignDetails" : "tailorDetails";
          
          // Add user details to Firestore
          const userDetailsDocRef = await addDoc(collection(db, "users", uid, collectionName), {
            city: selectedCity,
            area: selectedArea,
            profilePicture: image,
          });

          console.log("User details added with ID: ", userDetailsDocRef.id);

          navigation.navigate("WelcomeScreen", { userRole });
        } else {
          console.error("Error: Unable to get UID or userRole");
        }
      } catch (error) {
        console.error("Error adding user details: ", error.message);
      }
    }
  };

  const handleClose = () => {
    setImage(null);
    setSelectedCity(null);
    setSelectedArea('');
    navigation.navigate('SignUp');
  };

  const handleRemoveImage = () => {
    setImage(null);
  };

  const handleCitySelection = (city) => {
    setSelectedCity(city);
    setIsCityModalVisible(false);
  };

  return (
    <Modal animationType="slide" transparent={true} visible={visible} onRequestClose={onClose}>
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Enter Personal Details</Text>
          <Pressable style={styles.imagePicker} onPress={pickImage}>
            {image ? (
              <>
                <Image source={{ uri: image }} style={styles.profileImage} resizeMode="cover" />
                <Pressable style={styles.removeButton} onPress={handleRemoveImage}>
                  <Ionicons name="md-close-circle-outline" size={20} color="white" />
                </Pressable>
              </>
            ) : (
              <Ionicons name="md-images-outline" size={50} color="#D3D4D7" />
            )}
          </Pressable>
          
          <Text style={{fontWeight: 'bold', left: 45, bottom: 10}}>Upload a Profile Picture</Text>
          <TouchableOpacity style={styles.cityPicker} onPress={() => setIsCityModalVisible(true)}>
            <Text style={styles.cityText}>{selectedCity ? selectedCity : "Choose City"}</Text>
          </TouchableOpacity>
          <TextInput
            style={styles.input}
            placeholder="Enter Area"
            value={selectedArea}
            onChangeText={(text) => setSelectedArea(text)}
          />
          <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
            <Text style={styles.buttonText}>Next</Text>
          </TouchableOpacity>
          <Pressable style={styles.closeButton} onPress={handleClose}>
            <Text style={styles.buttonText}>Close</Text>
          </Pressable>
        </View>
      </View>
      {/* City Modal */}
      <Modal animationType="slide" transparent={true} visible={isCityModalVisible}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Choose City</Text>
            <TouchableOpacity style={styles.cityOption} onPress={() => handleCitySelection("Rawalpindi")}>
              <Text style={styles.cityOptionText}>Rawalpindi</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.cityOption} onPress={() => handleCitySelection("Islamabad")}>
              <Text style={styles.cityOptionText}>Islamabad</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.cityOption} onPress={() => handleCitySelection("Lahore")}>
              <Text style={styles.cityOptionText}>Lahore</Text>
            </TouchableOpacity>
            {/* Add more cities here as needed */}
          </View>
        </View>
      </Modal>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    width: 300,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
  imagePicker: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#059FA5',
    padding: 0,
    borderRadius: 50,
    marginBottom: 10,
    height: 100,
    width: 100,
    marginLeft: 75,
    position: 'relative',
  },
  profileImage: {
    width: '100%',
    height: '100%',
    borderRadius: 50,
  },
  removeButton: {
    position: 'absolute',
    top: 5,
    right: 5,
    padding: 5,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 50,
  },
  cityPicker: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
  cityText: {
    color: '#000',
  },
  cityOption: {
    padding: 10,
  },
  cityOptionText: {
    fontSize: 16,
    color: '#000',
  },
  nextButton: {
    backgroundColor: '#059FA5',
    shadowColor: '#ffffff',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  closeButton: {
    backgroundColor: '#e74c3c',
    shadowColor: '#ffffff',
    padding: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
  },
});

export default ModalView;
