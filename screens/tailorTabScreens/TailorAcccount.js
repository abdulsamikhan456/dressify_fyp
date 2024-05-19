import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  ScrollView,
} from "react-native";
import { AntDesign, MaterialIcons , Ionicons} from "@expo/vector-icons";
import {
  getDoc,
  doc,
  getFirestore,
  collection,
  getDocs,
} from "firebase/firestore";
import { useUser } from "../../UserContext"; // Adjust the import path
import { useNavigation } from "@react-navigation/native";
import { getAuth } from "firebase/auth"; // Import getAuth function

const TailorAcccount = ({ uid }) => {
  const { uid: contextUid } = useUser();
  const [userData, setUserData] = useState(null);
  const navigation = useNavigation();
  const auth = getAuth(); // Initialize auth

  useEffect(() => {
    const fetchUserData = async () => {
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

  const signOutUser = () => {
    auth
      .signOut()
      .then(() => {
        navigation.replace("LoginScreen");
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const navigateToTailorPersonalInfo = (userEmail) => {
    navigation.navigate("TailorPersonalInfo", { userEmail });
  };

  const handleInventoryPress = (userEmail) => {
    navigation.navigate("InventoryManagement", { userEmail });
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
          <Text style={styles.username}>
            {userData ? userData.email : "User"}
          </Text>
        </View>
      </View>

      <View style={styles.horizontalLine}></View>

      <View style={styles.noticeContainer}>
        <TouchableOpacity
          style={styles.noticeBox}
          onPress={() => navigateToTailorPersonalInfo(userData?.email)}
        >
          <AntDesign name="infocirlceo" size={24} color="#059FA5" />
          <Text style={styles.noticeText}>Personal Information</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.noticeBox} onPress={() => handleInventoryPress(userData?.email)}>
          <MaterialIcons name="inventory" size={24} color="#059fa5" />
          <Text style={styles.noticeText}>Inventory Management</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.noticeBox} onPress={""}>
          <MaterialIcons name="design-services" size={24} color="#059FA5" />
          <Text style={styles.noticeText}>Your Designs</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.noticeBox}
          onPress={() => showNotice("Wish List", "hearto")}
        >
          <MaterialIcons
            name="history-toggle-off"
            size={24}
            color="#059FA5"
          />
          <Text style={styles.noticeText}>Orders History</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.logoutButton} onPress={signOutUser}>
        <AntDesign
          name="logout"
          size={24}
          color="white"
          style={styles.logoutIcon}
        />
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default TailorAcccount;

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    alignItems: "center",
    justifyContent: "flex-start",
    paddingTop: 30,
  },

  noticeContainer: {
    flexDirection: "column",
    alignItems: "flex-start",
    position: "absolute",
    bottom: 300,
    paddingHorizontal: 20,

    width: "100%", // Set a fixed width for the container
  },

  noticeBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 20,
    marginBottom: 10,
    width: "100%",
    borderWidth: 0.5,
    borderColor: "grey",
  },
  noticeText: {
    color: "black",
    fontSize: 14,
    marginLeft: 10,
  },
  profileContainer: {
    flexDirection: "row",
    right: 100,
    bottom: 15,
  },
  profileImage: {
    width: 70,
    height: 70,
    borderRadius: 35,
    left: 60,
  },
  userInfo: {
    marginLeft: 10,
    top: 15,
    left: 60,
  },
  username: {
    fontWeight: "600",
    fontSize: 15,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
    marginBottom: 20,
    top: 30,
    left: 5,
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
    top: 10,
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

  logoutButton: {
    backgroundColor: "#059FA5", // Example button color
    padding: 15,
    borderRadius: 8,
    marginTop: 30,
    flexDirection: "row", // Add flexDirection to align icon and text horizontally
    alignItems: "center",
    top: 220, // Center align items horizontally
  },
  logoutIcon: {
    marginRight: 5, // Add some spacing between icon and text
  },
  logoutText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
    textAlign: "center",
  },
});
