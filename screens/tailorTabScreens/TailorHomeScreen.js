import React, { useEffect, useState } from "react";
import { View, Text, Pressable, StyleSheet, Image } from "react-native";
import { Ionicons, Entypo } from "@expo/vector-icons";
import {
  getDoc,
  doc,
  getFirestore,
  collection,
  getDocs,
  where,
  query,
} from "firebase/firestore";
import { useUser } from "../../UserContext"; // Adjust the import path
import { useNavigation } from "@react-navigation/native";
import { getAuth } from "firebase/auth";
import { MaterialIcons } from '@expo/vector-icons';
import { AntDesign } from '@expo/vector-icons';
const TailorHomeScreen = ({ uid }) => {
  const { uid: contextUid } = useUser();
  const [userData, setUserData] = useState(null);
  const [hasNewMessages, setHasNewMessages] = useState(false); // State to check if there are new messages
  const navigation = useNavigation();

  useEffect(() => {
    const fetchUserData = async () => {
      const auth = getAuth();
      const firestore = getFirestore();

      // Determine the UID to fetch data for
      const userUid = contextUid || uid || auth.currentUser?.uid;

      if (userUid) {
        try {
          // Fetch user data from the 'users' collection
          const userDoc = await getDoc(doc(firestore, "users", userUid));
          if (userDoc.exists()) {
            const userData = userDoc.data();

            // Fetch tailorDetails data from the 'tailorDetails' subcollection
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
              // If tailorDetails subcollection is not empty, extract the first document
              const tailorDetailsDoc = tailorDetailsQuerySnapshot.docs[0];
              tailorDetailsData = tailorDetailsDoc.data();
            }

            // Merge the data from both 'users' and 'tailorDetails'
            setUserData({ ...userData, ...tailorDetailsData });

            // Check if there are new messages for the tailor
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      }
    };

    fetchUserData();
  }, [contextUid, uid]);

  const navigateToNewOrders = () => {
    navigation.navigate("NewOrdersRequest", { tailorEmail: userData.email });
    console.log("Navigate to New Orders");
  };

  const navigateToPendingOrders = () => {
    navigation.navigate("PendingOrders", { tailorEmail: userData.email });
    console.log("Navigate to Pending Orders");
  };

  const navigateToCompletedOrders = () => {
    navigation.navigate("CompletedOrders", { tailorEmail: userData.email });
    console.log("Navigate to Completed Orders");
  };

  const navigateToWaitingOrders = () => {
    // Implement navigation logic for Waiting Orders
    console.log("Navigate to Waiting Orders");
  };

  return (
    <View style={styles.container}>
      {/* Profile Picture and Name */}
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

      {/* Notification Icon */}
      <Pressable style={styles.notificationIcon}>
        <Ionicons name="md-notifications" size={24} color="#E13030" />
      </Pressable>

      <Text
        style={{
          flexDirection: "row",
          bottom: 80,
          padding: 5,
          right: 100,
          fontWeight: "800",
          color: "#059FA5",
          fontSize: 15,
        }}
      >
        Activities OnGoing
        
      </Text>

      {/* Four Buttons */}
      <View style={styles.buttonsContainer}>
        <View style={styles.buttonRow}>
          <Pressable style={styles.button1} onPress={navigateToNewOrders}>
            <Text style={styles.buttonText}>New Orders Requests</Text>
            <Entypo
              name="chevron-small-right"
              size={24}
              color="white"
              style={styles.icon}
            />
            <Entypo name="new" size={30} color="white" 
            style={styles.icon1}/>
          </Pressable>
          <Pressable style={styles.button2} onPress={navigateToPendingOrders}>
            <Text style={styles.buttonText}>Pending Orders</Text>
            <Entypo
              name="chevron-small-right"
              size={24}
              color="white"
              style={styles.icon}
            />
            <MaterialIcons name="pending-actions" size={40} color="white" 
            style={styles.icon2}/>
          </Pressable>
        </View>

        <View style={styles.buttonRow}>
          <Pressable style={styles.button3} onPress={navigateToCompletedOrders}>
            <Text style={styles.buttonText}>Completed Orders</Text>
            <Entypo
              name="chevron-small-right"
              size={24}
              color="white"
              style={styles.icon}
            />
            <MaterialIcons name="done-all" size={30} color="white" 
            style={styles.icon3}/>
          </Pressable>
          <Pressable style={styles.button4} onPress={navigateToWaitingOrders}>
            <Text style={styles.buttonText}>Waiting Orders</Text>
            <Entypo
              name="chevron-small-right"
              size={24}
              color="white"
              style={styles.icon}
            />
            <AntDesign name="loading1" size={30} color="white" style={styles.icon4} />

          </Pressable>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  icon: {
    position: "absolute",
    right: 10,
    bottom: 10,
  },
  icon1: {
    position: "absolute",
    right: 65,
    top: 55,
  },
  icon2: {
    position: "absolute",
    right: 60,
    top: 100,
  },
  icon3: {
    position: "absolute",
    right: 60,
    top: 40,
  },
  icon4: {
    position: "absolute",
    right: 150,
    top: 40,
  },
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    
    // backgroundColor: "black"
  },
  profileContainer: {
    flexDirection: "row",
    right: 90,
    bottom: 85,
  },
  profileImage: {
    width: 70,
    height: 70,
    borderRadius: 35,
    left: 60,
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
  notificationIcon: {
    position: "absolute",
    top: 80,
    left: 330,
    padding: 5,
    borderRadius: 5,
  },
  buttonsContainer: {
    flexDirection: "column",
    alignItems: "center",
    top: 130,
  },
  buttonRow: {
    flexDirection: "row",
    marginBottom: 10,
  },
  button1: {
    backgroundColor: "#059FA5",
    padding: 10,
    borderRadius: 10,
    marginHorizontal: 10,
    bottom: 200,
    right: 10,
    width: 150,
    height: 110,
    shadowColor: "#ffffff",
  },
  button2: {
    backgroundColor: "#059FA5",
    padding: 10,
    borderRadius: 10,
    marginHorizontal: 10,
    bottom: 200,
    right: 5,
    width: 150,
    height: 250,
    shadowColor: "#ffffff",
  },
  button3: {
    backgroundColor: "#059FA5",
    padding: 10,
    borderRadius: 10,
    marginHorizontal: 10,
    bottom: 320,
    left: 80,
    width: 150,
    height: 110,
    shadowColor: "#ffffff",
  },
  button4: {
    backgroundColor: "#059FA5",
    padding: 10,
    borderRadius: 10,
    marginHorizontal: 10,
    bottom: 180,
    right: 90,
    width: 330,
    height: 110,
    shadowColor: "#ffffff",
  },
  buttonText: {
    color: "white",
    fontWeight: "500",
  },
});

export default TailorHomeScreen;
