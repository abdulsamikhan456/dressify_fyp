import React, { useContext, useEffect, useState } from "react";
import { Text, View, ActivityIndicator, StyleSheet, width } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { getDoc, doc, getFirestore } from "firebase/firestore";
import Lottie from 'lottie-react-native';
import { useUser } from '../UserContext'; // Import the useUser hook

const WelcomeScreen = ({ route, navigation }) => {
  
  const { userRole, uid: routeUid } = route.params || {};
  const [loading, setLoading] = useState(true);
  const [username, setUsername] = useState("");
  const { uid, setUid } = useUser(); // Use the useUser hook to access uid and setUid

  useEffect(() => {
    const auth = getAuth();
    const firestore = getFirestore();
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const userDoc = await getDoc(doc(firestore, "users", user.uid));
          if (userDoc.exists()) {
            const userData = userDoc.data();
            setUsername(userData.username || "User");
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      }
      setLoading(false);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  useEffect(() => {
    let timer;
    if (!loading) {
      timer = setTimeout(() => {
        navigateToNextScreen();
      }, 3000);
    }

    return () => clearTimeout(timer);
  }, [loading]);

  const navigateToTailorTabs = (uid) => {
    navigation.navigate('TailorTab', { uid });
  };

  const navigateToNextScreen = () => {
    if (userRole === 'Tailor') {
      setUid(routeUid); // Set the uid using setUid from the context
      navigateToTailorTabs(routeUid); // Pass uid to TailorTabScreen
    } else {
      // Handle other user roles
      navigation.navigate('Tab');
    }
  };

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#FFFFFF",
      }}
    >
      {loading ? (
        <ActivityIndicator size="large" color="#000000" />
      ) : (
        <View>
          <View style={{ flexDirection: "row" }}>
            <View style={styles.lottie}>
              <Lottie source={require('../assets/animations/Welcome.json')} autoPlay loop />
            </View>

            <Text style={{ fontSize: 40, color: "#000000", marginBottom: 100 }}>
              , {username}
            </Text>
          </View>
          <Text
            style={{
              textAlign: "center",
              alignItems: "center",
              color: "#000000",
              fontSize: 15,
              bottom: -10
            }}
          >
            Enjoy your experience!
          </Text>
        </View>
      )}
    </View>
  );
};

export default WelcomeScreen;

const styles = StyleSheet.create({
  lottie: {
    width: 150,
    height: 60,
  },
});
