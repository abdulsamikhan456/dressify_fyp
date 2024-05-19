import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  ScrollView,
  Image,
  Linking,
  ActivityIndicator,
} from "react-native";
import {
  Ionicons,
  AntDesign,
  FontAwesome,
  EvilIcons,
} from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  doc,
  deleteDoc,
  setDoc
} from "firebase/firestore";
import { db } from "../firebase"; // Import Firestore instance from your firebase.js file

const placeholderImage = "https://via.placeholder.com/150"; // Placeholder image URL

const SelectedTailorScreen = ({ route }) => {
  const {
    city,
    area,
    currentUserEmail,
    selectedTailorProfilePicture,
    selectedTailorShopName,
    selectedTailorShopAddress,
    selectedTailorEmail,
  } = route.params;
  console.log("currentUserEmail:", currentUserEmail);

  const navigation = useNavigation();
  const [isFav, setIsFav] = useState(false); // Track if the tailor is a favorite or not
  const [tailorInfo, setTailorInfo] = useState({
    profilePicture: placeholderImage,
    rating: 0,
    feedback: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkIfFav(); // Check if the tailor is in favorites when the component mounts
    fetchTailorInfo();
  }, []);

  const saveRatingToFirebase = async (rating) => {
    try {
      // Query to find the user document with the provided email
      const userQuery = query(
        collection(db, "users"),
        where("email", "==", selectedTailorEmail)
      );
      const userSnapshot = await getDocs(userQuery);
  
      if (!userSnapshot.empty) {
        userSnapshot.forEach(async (userDoc) => {
          console.log("Email matched with selectedTailorEmail:", selectedTailorEmail);
          try {
            // Create a collection of totalRating under the user's document
            const totalRatingCollection = collection(db, `users/${userDoc.id}`, "totalRating");
  
            // Add a new document with the rating value in the totalRating collection
            await addDoc(totalRatingCollection, { rating });
            console.log("Rating saved to Firebase successfully!");
          } catch (error) {
            console.error("Error adding document:", error);
          }
        });
      } else {
        console.log("User not found with email: ", selectedTailorEmail);
      }
    } catch (error) {
      console.error("Error saving rating to Firebase:", error);
    }
  };

  const fetchTailorInfo = async () => {
    try {
      const userQuery = query(
        collection(db, "users"),
        where("email", "==", selectedTailorEmail)
      );
      const userSnapshot = await getDocs(userQuery);

      if (!userSnapshot.empty) {
        userSnapshot.forEach(async (userDoc) => {
          const tailorDetailsRef = collection(
            db,
            `users/${userDoc.id}/RatingAndFeedback`
          );
          const tailorDetailsSnapshot = await getDocs(tailorDetailsRef);
          if (!tailorDetailsSnapshot.empty) {
            const feedbackData = [];
            tailorDetailsSnapshot.forEach((doc) => {
              feedbackData.push(doc.data());
            });
            // Set tailorInfo state with feedback data
            setTailorInfo((prevState) => ({
              ...prevState,
              feedback: feedbackData,
            }));
            setLoading(false);
          }
        });
      } else {
        console.log("Tailor not found with email: ", selectedTailorEmail);
        setLoading(false);
      }
    } catch (error) {
      console.error("Error fetching tailor information:", error);
      setLoading(false);
    }
  };

  const checkIfFav = async () => {
    try {
      const userQuery = query(
        collection(db, "users"),
        where("email", "==", currentUserEmail)
      );
      const userSnapshot = await getDocs(userQuery);

      if (!userSnapshot.empty) {
        userSnapshot.forEach(async (userDoc) => {
          const addToFavCollection = collection(
            db,
            `users/${userDoc.id}/AddToFav`
          );
          const q = query(
            addToFavCollection,
            where("selectedTailorShopName", "==", selectedTailorShopName)
          );
          const querySnapshot = await getDocs(q);
          if (!querySnapshot.empty) {
            setIsFav(true); // Set isFav to true if the tailor is in favorites
          }
        });
      } else {
        console.log("User not found with email: ", currentUserEmail);
      }
    } catch (error) {
      console.error("Error checking if the tailor is in favorites:", error);
    }
  };

  const openMaps = () => {
    // Construct the URL with city and area parameters
    const mapUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
      city + ", " + area
    )}`;

    // Open the URL using Linking
    Linking.openURL(mapUrl).catch((err) =>
      console.error("An error occurred", err)
    );
  };

  const handleAppointPress = () => {
    navigation.navigate("SelectOppointDate", {
      selectedTailorShopName,
      selectedTailorShopAddress,
      selectedTailorEmail,
    });
  };

  const handleDesignPress = () => {
    navigation.navigate("TailorDesigns", {
      selectedTailorShopName,
      selectedTailorShopAddress,
      selectedTailorEmail,
      
    });
  };

  const handleAddToFavPress = async () => {
    try {
      const userQuery = query(
        collection(db, "users"),
        where("email", "==", currentUserEmail)
      );
      const userSnapshot = await getDocs(userQuery);

      if (!userSnapshot.empty) {
        userSnapshot.forEach(async (userDoc) => {
          const addToFavCollection = collection(
            db,
            `users/${userDoc.id}/AddToFav`
          );

          if (!isFav) {
            // If the tailor is not in favorites, add it to the AddToFav collection
            const docRef = await addDoc(addToFavCollection, {
              selectedTailorProfilePicture,
              selectedTailorShopName,
              selectedTailorShopAddress,
              selectedTailorEmail,
              currentUserEmail,
            });
            console.log("Document written with ID: ", docRef.id);
            setIsFav(true); // Set isFav to true
          } else {
            // If the tailor is already in favorites, remove it from the AddToFav collection
            const q = query(
              addToFavCollection,
              where("selectedTailorShopName", "==", selectedTailorShopName)
            );
            const querySnapshot = await getDocs(q);
            querySnapshot.forEach(async (doc) => {
              await deleteDoc(doc.ref);
              console.log("Document deleted successfully!");
              setIsFav(false); // Set isFav to false
            });
          }
        });
      } else {
        console.log("User not found with email: ", currentUserEmail);
      }
    } catch (error) {
      console.error("Error adding/removing tailor from favorites:", error);
    }
  };
  const calculateAverageRating = () => {
    let totalStars = 0;
    let totalFeedbacks = 0;

    tailorInfo.feedback.forEach((review) => {
      totalStars += review.rating;
      totalFeedbacks++;
    });

    // Calculate the average rating based on the total number of stars
    const averageRating = totalFeedbacks > 0 ? Math.min(5, Math.ceil(totalStars / (totalFeedbacks * 2))) : 0;

    return averageRating;
  };
  
  
  // Inside the component, update the rating value
  const rating = calculateAverageRating();

  useEffect(() => {
    if (tailorInfo.feedback.length > 0) {
      saveRatingToFirebase(rating);
    }
  }, [rating, tailorInfo.feedback]);

  return (
    <>
      <ScrollView style={{ marginVertical: 25 }}>
        <View style={styles.container}>
          {/* Profile Picture and Name */}
          <Pressable onPress={() => navigation.navigate("Tab")}>
            <AntDesign
              style={{ bottom: 250, right: 160, position: "relative" }}
              name="leftcircleo"
              size={24}
              color="black"
            />
          </Pressable>
          <Text
            style={{ bottom: 271, fontSize: 20, fontWeight: "bold", left: 15 }}
          >
            Selected Tailor
          </Text>
          <Pressable style={styles.profileContainer}>
            <Image
              style={{ width: 70, height: 70, borderRadius: 40 }}
              source={{ uri: selectedTailorProfilePicture }}
            />
          </Pressable>
          <View style={{ left: 8 }}>
            <Text
              style={{
                flexDirection: "row",
                bottom: 335,
                right: 45,
                fontWeight: "600",
                fontSize: 20,
              }}
            >
              {selectedTailorShopName}
            </Text>
            <Text
              style={{
                flexDirection: "row",
                bottom: 330,
                right: 45,
                fontWeight: "600",
              }}
            >
              Description
            </Text>
          </View>

          {/* Rating, Direction, and Verification in the same row */}
          <View style={styles.iconRow}>
            <Pressable
              onPress={handleAppointPress}
              style={styles.iconContainer}
            >
              <FontAwesome
                style={{ right: 80 }}
                name="star"
                size={30}
                color="#f39c12"
              />
              <Text style={styles.iconText1}>{rating}</Text>
            </Pressable>

            <Pressable onPress={openMaps} style={styles.iconContainer}>
              <EvilIcons
                style={{ left: 10 }}
                name="location"
                size={40}
                color="#3498db"
              />
              <Text style={styles.iconText2}>See location</Text>
            </Pressable>

            <Pressable style={styles.iconContainer}>
              <FontAwesome
                style={{ left: 90 }}
                name="check-circle"
                size={30}
                color="#2ecc71"
              />
              <Text style={styles.iconText3}>Verified</Text>
            </Pressable>
          </View>

          {/* Row of buttons */}
          <View style={styles.buttonRow}>
            <Pressable
              onPress={handleAppointPress}
              style={styles.buttonContainer1}
            >
              <FontAwesome name="calendar-plus-o" size={24} color="white" />
              <Text style={styles.buttonText}>Appoint</Text>
            </Pressable>

            <Pressable
              style={[styles.buttonContainer2]}
              onPress={handleDesignPress}
            >
              <FontAwesome name="scissors" size={24} color="white" />
              <Text style={[styles.buttonText, { color: "white" }]}>
                Tailor Designs
              </Text>
            </Pressable>

            <Pressable
              style={[
                styles.buttonContainer3,
                {
                  color: isFav ? "red" : "white",
                  fontWeight: isFav ? "bold" : "normal",
                },
              ]}
              onPress={handleAddToFavPress}
            >
              <FontAwesome
                name="heart"
                size={24}
                color={isFav ? "red" : "white"}
              />
              <Text
                style={[
                  styles.buttonText,
                  { color: "white", fontWeight: isFav ? "bold" : "normal" },
                ]}
              >
                Add to Fav
              </Text>
            </Pressable>
          </View>

          <View style={styles.horizontalLine} />

          <View style={{ bottom: 200, right: 125 }}>
            <Text style={{ fontSize: 15, fontWeight: "bold", left: 40 }}>
              Feedback and Ratings
            </Text>
            <View style={{ top: 20 }}>
              {!loading &&
                Array.isArray(tailorInfo.feedback) &&
                tailorInfo.feedback.map((review, index) => (
                  <View key={index}>
                    <Pressable
                      style={{
                        padding: 10,
                        borderRadius: 50,
                        top: 20,
                        bottom: 125,
                        left: 30,
                      }}
                    >
                      <Image
                        style={{ width: 70, height: 70, borderRadius: 35 }}
                        source={{ uri: review.profile }}
                      />
                    </Pressable>
                    <View style={{ flexDirection: "row" , left: 50, top: 15}}>
                      {[...Array(review.rating)].map((_, i) => (
                        <FontAwesome
                          key={i}
                          name="star"
                          size={13}
                          color="#f39c12"
                        />
                      ))}
                    </View>
                    <Text style={{ left: 120, bottom: 60 }}>
                      {review.feedback}
                    </Text>
                  </View>
                ))}
            </View>
          </View>
        </View>
      </ScrollView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
    marginTop: 230,
  },
  horizontalLine: {
    borderBottomColor: "#000000",
    borderBottomWidth: 1,
    marginVertical: 10,
    width: "100%",
    bottom: 220,
  },
  profileContainer: {
    flexDirection: "row",
    padding: 10,
    borderRadius: 70,
    marginBottom: 20,
    bottom: 240,
    right: 135,
  },
  iconRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    bottom: 270,
  },
  iconContainer: {
    alignItems: "center",
  },
  iconText1: {
    marginTop: 5,
    right: 80,
  },
  iconText2: {
    marginTop: 5,
    left: 10,
  },
  iconText3: {
    marginTop: 5,
    left: 90,
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 20,
  },
  buttonContainer1: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#059FA5",
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderRadius: 15,
    bottom: 240,
  },
  buttonContainer2: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#059FA5",
    paddingVertical: 10,
    paddingHorizontal: 5,
    borderRadius: 15,
    bottom: 240,
    left: 5,
  },
  buttonContainer3: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#059FA5",
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderRadius: 15,
    bottom: 240,
    left: 10,
  },
  buttonText: {
    color: "white",
    marginLeft: 10,
  },
});

export default SelectedTailorScreen;
