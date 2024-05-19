import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  Modal,
} from "react-native";
import React, { useState, useEffect } from "react";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../firebase";

const TailorDesigns = ({ route }) => {
  const { selectedTailorEmail } = route.params;
  console.log("selectedTailorEmail:", selectedTailorEmail); // Corrected console log
  const navigation = useNavigation();

  const [fetchedDesigns, setFetchedDesigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  const fetchDesigns = async () => {
    try {
      const firestore = db;

      const userRef = collection(firestore, "users");
      const userSnapshot = await getDocs(
        query(
          userRef,
          where("email", "==", selectedTailorEmail),
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
              id: doc.id,
              selectedImages: design.selectedImages,
              description: design.description,
            });
          });
          setFetchedDesigns(designsData);
        } else {
          console.log("No designs found for the current Tailor.");
          // Set fetched designs to an empty array
          setFetchedDesigns([]);
        }
      } else {
        console.log("User not found or not a Tailor.");
      }
      setLoading(false);
    } catch (error) {
      console.error("Error fetching designs:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    console.log("Received selectedTailorEmail:", selectedTailorEmail);
    fetchDesigns();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Ionicons
          name="arrow-back"
          size={24}
          color="black"
          onPress={() => navigation.goBack()}
        />
        <Text style={styles.heading}>Tailor Designs</Text>
        <Text style={{top: 40, right: 160}}>Here you can view the Tailor designs and expertise</Text>
        <View style={styles.horizontalLine}></View>
      </View>

      <View style={styles.content}>
       

        
          <Text
            style={{
              fontWeight: "bold",
              fontSize: 20,
              marginTop: 50,
              right: 90,
            }}
          >
            Updated Designs:
          </Text>
        

        {fetchedDesigns.length === 0 ? (
          <Text style={{ top: 80, fontWeight: "bold", fontSize: 30 }}>
            No designs uploaded
          </Text>
        ) : (
          <View style={styles.rowContainer}>
            {fetchedDesigns.map((design) => (
              <TouchableOpacity
                key={design.id}
                onPress={() => {
                  setSelectedImage(design.selectedImages[0]);
                  setModalVisible(true);
                }}
              >
                {/* Display fetched design image */}
                <Image
                  style={{
                    width: "100%",
                    height: 200,
                    marginBottom: 10,
                    left: 7,
                    top: 20,
                  }}
                  source={{ uri: design.selectedImages[0] }}
                />
                <Text style={{ marginTop: 5, left: 8, top: 10 }}>
                  Description: {design.description}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalContainer}>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setModalVisible(false)}
            >
              <Ionicons name="close" size={30} color="white" />
            </TouchableOpacity>
            <Image
              style={styles.fullScreenImage}
              source={{ uri: selectedImage }}
            />
          </View>
        </Modal>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#ffffff",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  heading: {
    fontSize: 24,
    fontWeight: "bold",
    marginLeft: 10,
    left: 70,
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 310
  },
  horizontalLine: {
    width: "100%",
    height: 1,
    backgroundColor: "black",
    top: 60,
    right: 500
  },
  rowContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    marginBottom: 20,
    top: 20,
    bottom: 70,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: "black",
    justifyContent: "center",
    alignItems: "center",
  },
  closeButton: {
    position: "absolute",
    top: 20,
    right: 20,
    zIndex: 1,
  },
  fullScreenImage: {
    width: "100%",
    height: "100%",
    resizeMode: "contain",
  },
});

export default TailorDesigns;
