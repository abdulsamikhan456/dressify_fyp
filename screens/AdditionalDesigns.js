import { StyleSheet, Text, View, TouchableOpacity, Image, TextInput, ScrollView, Modal, Alert } from 'react-native';
import React, { useState } from 'react';
import { AntDesign } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { getFirestore, collection, query, where, getDocs, addDoc } from "firebase/firestore";

const db = getFirestore();

const AdditionalDesign = ({ route, navigation }) => {
  const { tailorEmail, orderNumber } = route.params;
  const [selectedImages, setSelectedImages] = useState([]);
  const [description, setDescription] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  const fetchTailor = async (tailorEmail) => {
      try {
          const usersCollectionRef = collection(db, "users");
          const q = query(usersCollectionRef, where("email", "==", tailorEmail));
          const querySnapshot = await getDocs(q);

          if (!querySnapshot.empty) {
              // Tailor with the provided email found
              const tailorDoc = querySnapshot.docs[0];
              return tailorDoc.id;
          } else {
              console.log(`User with email ${tailorEmail} not found`);
              return null;
          }
      } catch (error) {
          console.error("Error fetching tailor:", error);
          throw error;
      }
  };

  const checkOrderInCustomerRequests = async (tailorId, orderNumber) => {
      try {
          const customerRequestsCollectionRef = collection(db, "users", tailorId, "customerRequests");
          const q = query(customerRequestsCollectionRef, where("orderNumber", "==", orderNumber));
          const querySnapshot = await getDocs(q);

          if (!querySnapshot.empty) {
              // Order with the provided orderNumber found
              return true;
          } else {
              console.log(`Order with number ${orderNumber} not found in customerRequests`);
              return false;
          }
      } catch (error) {
          console.error("Error checking order in customerRequests:", error);
          throw error;
      }
  };

  const saveDesignsToFirestore = async (tailorId, orderNumber) => {
    try {
        const customerRequestsCollectionRef = collection(db, "users", tailorId, "customerRequests");
        const q = query(customerRequestsCollectionRef, where("orderNumber", "==", orderNumber));
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
            // Get the document reference where orderNumber matches
            const docRef = querySnapshot.docs[0].ref;

            // Create a subcollection reference for customerDesigns
            const customerDesignsCollectionRef = collection(docRef, "customerDesigns");

            // Add the new design document to the customerDesigns collection
            const newDesignDocRef = await addDoc(customerDesignsCollectionRef, {
                selectedImages,
                description,
                timestamp: new Date(),
            });
            console.log("Designs saved successfully! Document ID:", newDesignDocRef.id);
        } else {
            console.log(`Order with number ${orderNumber} not found in customerRequests`);
        }
    } catch (error) {
        console.error("Error saving designs to Firestore:", error);
        throw error;
    }
};

const handleContinue = async () => {
  const tailorId = await fetchTailor(tailorEmail);
  if (tailorId) {
      try {
          const orderExists = await checkOrderInCustomerRequests(tailorId, orderNumber);
          if (orderExists) {
              await saveDesignsToFirestore(tailorId, orderNumber);
              // Show alert and navigate back if designs are saved successfully
              Alert.alert("Designs Sent to Tailor", "", [{ text: "OK", onPress: () => navigation.goBack() }]);
          }
      } catch (error) {
          console.error("Error saving designs to Firestore:", error);
      }
  }
};

  const handlePickImage = async () => {
    try {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        if (!result.cancelled) {
            setSelectedImages(prevImages => [...prevImages, result.assets[0].uri]);
        }
    } catch (error) {
        console.log('Error picking image:', error);
    }
};


    const handleImagePress = (index) => {
        setSelectedImageIndex(index);
        setModalVisible(true);
    };

    const handleBackPress = () => {
        navigation.goBack();
    };

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <TouchableOpacity style={styles.leftArrowContainer} onPress={handleBackPress}>
          <AntDesign name="leftcircleo" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.headerText}> Additional Designs</Text>
      </View>

      {/* Upload Designs Section */}
      <View style={styles.uploadDesignsContainer}>
        <Text style={styles.uploadDesignsText}>Upload Designs </Text>
      </View>

      {/* Note Container with Plus Icon */}
      <View style={styles.noteContainer}>
        <ScrollView horizontal>
          {selectedImages.map((imageUri, index) => (
            <TouchableOpacity key={index} onPress={() => handleImagePress(index)}>
              <View style={styles.imageContainer}>
                <Image source={{ uri: imageUri }} style={styles.uploadedImage} />
              </View>
            </TouchableOpacity>
          ))}
          <TouchableOpacity onPress={handlePickImage}>
            <View style={styles.imageContainer}>
              <AntDesign name="plus" size={24} color="white" style={styles.plusIcon} />
            </View>
          </TouchableOpacity>
        </ScrollView>
      </View>

      {/* Add Description Section */}
      <View style={styles.descriptionContainer}>
        <Text style={styles.descriptionLabel}>Add Description </Text>
        <TextInput
          style={styles.descriptionInput}
          onChangeText={text => setDescription(text)}
          value={description}
          placeholder="Enter description..."
        />
        <TouchableOpacity style={styles.continueButton} onPress={handleContinue}>
          <Text style={styles.continueButtonText}>Continue</Text>
        </TouchableOpacity>
      </View>

      {/* Full Screen Image Modal */}
      <Modal visible={modalVisible} transparent={true}>
        <View style={styles.modalContainer}>
          <TouchableOpacity style={styles.closeButton} onPress={() => setModalVisible(false)}>
            <AntDesign name="closecircle" size={32} color="white" />
          </TouchableOpacity>
          <Image source={{ uri: selectedImages[selectedImageIndex] }} style={styles.modalImage} />
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 30,
    bottom: 85,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    bottom: 10
  },
  leftArrowContainer: {
    marginRight: 10,
  },
  headerText: {
    fontSize: 18,
    fontWeight: 'bold',
    left: 60
  },
  uploadDesignsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
  },
  uploadDesignsText: {
    fontSize: 16,
    marginRight: 10,
    fontWeight: 'bold'
  },
  imageContainer: {
    marginRight: 5,
    backgroundColor: '#059FA5',
    width: 100,
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
    top: 30
  },
  uploadedImage: {
    width: '100%',
    height: '100%',
    borderRadius: 5,
  },
  plusIcon: {
    position: 'absolute',
  },
  noteContainer: {
    alignItems: 'center',
    width: '100%',
    height: '30%',
    borderWidth: 1,
    top: 20,
    borderColor: 'black',
    paddingVertical: 10,
    borderRadius: 10
  },
  descriptionContainer: {
    top: 60,
  },
  descriptionLabel: {
    fontSize: 16,
    marginBottom: 10,
    fontWeight: 'bold'
  },
  descriptionInput: {
    borderWidth: 1,
    borderColor: 'black',
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
  },
  continueButton: {
    backgroundColor: '#059FA5',
    padding: 40,
    borderRadius: 10,
    alignItems: 'center',
    top: 30
  },
  continueButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButton: {
    position: 'absolute',
    top: 30,
    right: 20,
  },
  modalImage: {
    width: '80%',
    height: '80%',
    borderRadius: 10,
  },
});

export default AdditionalDesign;
