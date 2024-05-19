import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  Image,
  Modal,
  ScrollView,
  TextInput,
  Alert,
  TouchableOpacity,
  ActivityIndicator
} from "react-native";
import { Ionicons, Entypo } from "@expo/vector-icons";
import {
  getDoc,
  doc,
  getFirestore,
  collection,
  getDocs,
  where,
  query,
  setDoc,
  addDoc,
  deleteDoc // Import deleteDoc function
} from "firebase/firestore";
import { db } from "../../firebase";
import { useUser } from "../../UserContext"; // Adjust the import path
import { useNavigation } from "@react-navigation/native";
import { getAuth } from "firebase/auth";
import { MaterialIcons } from "@expo/vector-icons";
import { AntDesign } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";

const AddDesigns = ({ uid }) => {
  const { uid: contextUid } = useUser();
  const [userData, setUserData] = useState(null);
  const navigation = useNavigation();
  const [selectedImages, setSelectedImages] = useState([]);
  const [description, setDescription] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [tailorEmail, setTailorEmail] = useState(null);
  const [designsUploaded, setDesignsUploaded] = useState(false);
  const [uploadedDesigns, setUploadedDesigns] = useState([]);
  const [fetchedDesigns, setFetchedDesigns] = useState([]);
  const [uploadMode, setUploadMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [fullScreenImageUri, setFullScreenImageUri] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      const auth = getAuth();
      const firestore = getFirestore();

      const userUid = contextUid || uid || auth.currentUser?.uid;

      if (userUid) {
        try {
          const userDoc = await getDoc(doc(firestore, "users", userUid));
          if (userDoc.exists()) {
            const userData = userDoc.data();
            const tailorDetailsCollection = collection(
              firestore,
              "users",
              userUid,
              "tailorDetails"
            );
            const tailorDetailsQuerySnapshot = await getDocs(
              tailorDetailsCollection
            );

            let tailorDetailsData = null;

            if (!tailorDetailsQuerySnapshot.empty) {
              const tailorDetailsDoc = tailorDetailsQuerySnapshot.docs[0];
              tailorDetailsData = tailorDetailsDoc.data();
            }

            setUserData({ ...userData, ...tailorDetailsData });
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      }
    };
    fetchUserData();
  }, [contextUid, uid]);

  const fetchDesigns = async () => {
    try {
      const auth = getAuth();
      const firestore = getFirestore();

      if (auth.currentUser) {
        const email = auth.currentUser.email;
        const userRef = collection(firestore, "users");
        const userSnapshot = await getDocs(
          query(
            userRef,
            where("email", "==", email),
            where("role", "==", "Tailor")
          )
        );

        if (!userSnapshot.empty) {
          const userDoc = userSnapshot.docs[0];
          const tailorDesignsRef = collection(
            userDoc.ref,
            "TailorUploadedDesigns"
          );
          const designsSnapshot = await getDocs(tailorDesignsRef);

          if (!designsSnapshot.empty) {
            const designsData = [];
            designsSnapshot.forEach((doc) => {
              const design = doc.data();
              designsData.push({
                id: doc.id, // Add document ID to fetched design data
                selectedImages: design.selectedImages,
                description: design.description,
              });
            });
            setFetchedDesigns(designsData);
          } else {
            console.log("No designs found for the current Tailor.");
          }
        } else {
          console.log("User not found or not a Tailor.");
        }
      } else {
        console.log("No user signed in.");
      }
      setLoading(false);
    } catch (error) {
      console.error("Error fetching designs:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDesigns();
  }, [designsUploaded]);

  console.log("Fetched Designs:", fetchedDesigns);

  const getCurrentUserEmail = async () => {
    try {
      const auth = getAuth();
      const firestore = getFirestore();

      if (auth.currentUser) {
        const email = auth.currentUser.email;
        const userRef = collection(firestore, "users");
        const querySnapshot = await getDocs(userRef);

        for (const doc of querySnapshot.docs) {
          if (doc.data().email === email && doc.data().role === "Tailor") {
            const userDocRef = doc.ref;
            const tailorDesignsCollection = collection(
              userDocRef,
              "TailorUploadedDesigns"
            );

            await addDoc(tailorDesignsCollection, {
              description,
              selectedImages,
              timestamp: new Date(),
            });

            console.log("Designs to be uploaded:", {
              description,
              selectedImages,
            });

            Alert.alert(
              "Designs Uploaded",
              "Your designs have been uploaded successfully!",
              [
                {
                  text: "OK",
                  onPress: () => {
                    setModalVisible(false);
                    setDesignsUploaded(true);
                    setUploadMode(false);
                    setSelectedImages([]);
                    setDescription("");
                  },
                },
              ]
            );

            console.log("Designs uploaded successfully!");
            return;
          }
        }

        console.log("User not found as Tailor or no user signed in.");
      } else {
        console.log("No user signed in.");
      }
    } catch (error) {
      console.error("Error fetching tailor email:", error);
    }
  };

  const handleAddDesign = async () => {
    console.log("handleAddDesign function called"); // Log when the function is called
    setModalVisible(true);
    setSelectedImages([]);
    setUploadMode(true);
    console.log("modalVisible set to true"); // Log when modalVisible state is set to true
  };

  const handlePickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      console.log("ImagePicker result:", result);

      if (!result.cancelled && result.assets && result.assets.length > 0) {
        const imageUri = result.assets[0].uri;
        setSelectedImages((prevImages) => [...prevImages, imageUri]); // Update selectedImages state with the new image URI
      }
    } catch (error) {
      console.log("Error picking image:", error);
    }
  };

  const handleBackPress = () => {
    setModalVisible(false);
    setUploadMode(false);
  };

  const handleViewLikes = () => {
    console.log("likes button pressed");
  };

  const handleImagePress = (index) => {
    setFullScreenImageUri(fetchedDesigns[index].selectedImages[0]);
  };

  const handleUploadDesign = () => {
    getCurrentUserEmail();
    fetchDesigns(); // Call fetchDesigns first
    setModalVisible(false); // Then set modal visibility to false
  };

  const handleDeleteDesign = async (index) => {
    try {
      const auth = getAuth();
      const firestore = getFirestore();

      if (auth.currentUser) {
        const email = auth.currentUser.email;
        const userRef = collection(firestore, "users");
        const querySnapshot = await getDocs(userRef);

        for (const doc of querySnapshot.docs) {
          if (doc.data().email === email && doc.data().role === "Tailor") {
            const userDocRef = doc.ref;
            const tailorDesignsCollection = collection(
              userDocRef,
              "TailorUploadedDesigns"
            );

            // Delete the design from Firestore
            const designSnapshot = await getDocs(tailorDesignsCollection);
            const designDocs = designSnapshot.docs;
            if (designDocs.length > index) {
              const designDocToDelete = designDocs[index];
              await deleteDoc(designDocToDelete.ref);
            }

            // Update fetchedDesigns state to reflect the deletion
            const updatedDesigns = [...fetchedDesigns];
            updatedDesigns.splice(index, 1);
            setFetchedDesigns(updatedDesigns);
            break; // Exit loop after finding the current user
          }
        }
      } else {
        console.log("No user signed in.");
      }
    } catch (error) {
      console.error("Error deleting design:", error);
    }
  };

  const currentUserIsTailor = userData?.role === "Tailor";

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.profileContainer}>
        {/* Profile Image and User Info */}
        {userData && userData.profilePicture ? (
          <Image
            source={{ uri: userData.profilePicture }}
            style={styles.profileImage}
          />
        ) : (
          <Ionicons name="md-image" size={50} color="white" />
        )}
        <View style={styles.userInfo}>
          <Text style={styles.username}>
            {userData ? userData.username : "User"}
          </Text>
        </View>
      </View>

      <View style={styles.buttonContainer}>
        <Pressable onPress={handleAddDesign} style={styles.addButton}>
          <AntDesign name="pluscircleo" size={24} color="white" />
          <Text style={styles.buttonText}>Add New Design</Text>
        </Pressable>
        <Pressable onPress={handleViewLikes} style={styles.likesButton}>
          <MaterialIcons name="thumb-up" size={24} color="white" />
          <Text style={styles.buttonText}>Total Likes</Text>
        </Pressable>
      </View>

      <View style={styles.horizontalLine}></View>

      <View style={styles.designsContainer}>
        {loading ? (
          <ActivityIndicator size="large" color="#0000ff" />
        ) : fetchedDesigns.length > 0 ? (
          <View>
            <Text style={styles.designsHeading}>Your Uploaded Designs</Text>
            <View style={styles.designsGallery}>
              {fetchedDesigns.map((design, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.designItemContainer}
                  onPress={() => handleImagePress(index)}
                >
                  <View style={styles.designItem}>
                    <Image
                      source={{ uri: design.selectedImages[0] }}
                      style={styles.designImage}
                    />
                    {currentUserIsTailor && ( // Render delete icon only if the current user is a Tailor
                      <TouchableOpacity
                        style={styles.deleteButton}
                        onPress={() => handleDeleteDesign(index)}
                      >
                        <MaterialIcons name="delete" size={24} color="red" />
                      </TouchableOpacity>
                    )}
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        ) : (
          <Text style={styles.noDesignsText}>
            You have no Designs Uploaded yet.
          </Text>
        )}
      </View>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={handleBackPress}
            >
              <AntDesign name="closecircle" size={32} color="white" />
            </TouchableOpacity>

            <View style={styles.uploadDesignsContainer}>
              <Text style={styles.uploadDesignsText}>Upload Designs </Text>
              <TouchableOpacity onPress={handlePickImage}>
                <AntDesign
                  name="plus"
                  size={24}
                  color="white"
                  style={styles.plusIcon}
                />
              </TouchableOpacity>
            </View>
            <View style={styles.noteContainer}>
              <ScrollView horizontal>
                {selectedImages.map((imageUri, index) => (
                  <TouchableOpacity
                    key={index}
                    onPress={() => handleImagePress(index)}
                  >
                    <View style={styles.imageContainer}>
                      <Image
                        source={{ uri: imageUri }}
                        style={styles.uploadedImage}
                      />
                    </View>
                  </TouchableOpacity>
                ))}
                {/* Always render the plus icon */}
                <TouchableOpacity onPress={handlePickImage}>
                  <View style={styles.imageContainer}>
                    <AntDesign
                      name="plus"
                      size={24}
                      color="white"
                      style={styles.uploadedIcon}
                    />
                  </View>
                </TouchableOpacity>
              </ScrollView>
            </View>
            <View style={styles.descriptionContainer}>
              <Text style={styles.descriptionLabel}>Add Description </Text>
              <TextInput
                style={styles.descriptionInput}
                onChangeText={(text) => setDescription(text)}
                value={description}
                placeholder="Enter description..."
              />
              <TouchableOpacity
                style={styles.continueButton}
                onPress={handleUploadDesign}
              >
                <Text style={styles.continueButtonText}>Continue</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};

export default AddDesigns;

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    alignItems: "center",
    justifyContent: "flex-start",
    paddingTop: 30,
  },
  profileContainer: {
    // flexDirection: "row",
    left: 20,
    bottom: 15,
    
  },
  profileImage: {
    width: 70,
    height: 70,
    borderRadius: 35,
    right: 20
  },
  userInfo: {
    marginLeft: 10,
    top: 65,
    right: 65,
  },
  username: {
    fontWeight: "600",
    fontSize: 30,
    bottom:65,
    left: 35
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
    marginBottom: 20,
    top: 30,
    left: 5
  },
  addButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#059fa5",
    paddingHorizontal: 13,
    paddingVertical: 10,
    borderRadius: 10,
  },
  likesButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#059fa5",
    paddingHorizontal: 25,
    paddingVertical: 10,
    borderRadius: 10,
  },
  buttonText: {
    marginLeft: 7,
    fontWeight: "bold",
    color: "white",
  },
  horizontalLine: {
    borderBottomColor: "black",
    borderBottomWidth: 1,
    width: "90%",
    marginBottom: 20,
    top: 30
  },
  designsContainer: {
    marginTop: 20,
    marginBottom: 10,
    paddingHorizontal: 20,
    top: 340,
  },
  designsHeading: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    bottom: 340,
  },
  designsGallery: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    bottom: 310,
  },
  designItemContainer: {
    width: "100%",
    marginBottom: 20,
    alignItems: "center",
  },
  designItem: {
    position: "relative",
    width: "90%",
    aspectRatio: 1,
  },
  designImage: {
    width: "100%",
    height: "100%",
    borderRadius: 10,
  },
  deleteButton: {
    position: "absolute",
    top: 5,
    right: 5,
    zIndex: 1,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0, 0,  0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "white",
    borderRadius: 10,
    padding: 20,
    width: "80%",
    maxHeight: "80%",
  },
  closeButton: {
    position: "absolute",
    top: 10,
    right: 10,
    zIndex: 1,
  },
  uploadDesignsContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  uploadDesignsText: {
    fontSize: 16,
    marginRight: 10,
    fontWeight: "bold",
  },
  imageContainer: {
    marginRight: 5,
    backgroundColor: "#059FA5",
    width: 80,
    height: 80,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 60,
  },
  uploadedImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  plusIcon: {
    position: "absolute",
  },
  noteContainer: {
    alignItems: "center",
    width: "100%",
    height: 100,
    borderWidth: 1,
    borderColor: "black",
    paddingVertical: 10,
    borderRadius: 10,
  },
  descriptionContainer: {
    marginTop: 20,
  },
  descriptionLabel: {
    fontSize: 16,
    marginBottom: 10,
    fontWeight: "bold",
  },
  descriptionInput: {
    borderWidth: 1,
    borderColor: "black",
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
  },
  continueButton: {
    backgroundColor: "#059FA5",
    padding: 10,
    borderRadius: 10,
    alignItems: "center",
  },
  continueButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  noDesignsText: {
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 30,
    bottom: 340
  },
});
