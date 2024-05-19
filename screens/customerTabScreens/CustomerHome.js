import React, { useEffect, useState, useCallback } from "react";
import {
  StyleSheet,
  Text,
  View,
  Pressable,
  Image,
  TextInput,
  FlatList,
  Alert,
  Linking,
} from "react-native";
import { MaterialIcons, Ionicons } from "@expo/vector-icons";
import * as Location from "expo-location";
import { createStackNavigator } from "@react-navigation/stack";
import { useNavigation, useFocusEffect } from "@react-navigation/native";

import "firebase/firestore";

import Services from "../../Services";
import { db } from "../../firebase"; // Import db directly

import { Modal, Provider, List, Divider } from "react-native-paper";
import * as ImagePicker from "expo-image-picker";

import { auth } from "../../firebase"; // Import auth from firebase
import {
  collection,
  doc,
  setDoc,
  getDocs,
  addDoc,
  where,
  query,
} from "firebase/firestore";

const Stack = createStackNavigator();

const CustomerHome = () => {
  const navigation = useNavigation();
  const [currentUserEmail, setCurrentUserEmail] = useState("");
  const [displayCurrentAddress, setDisplayCurrentAddress] = useState(
    "Location is loading..."
  );
  const [tailors, setTailors] = useState([]);
  const [filteredTailors, setFilteredTailors] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [profilePicture, setProfilePicture] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [loading, setLoading] = useState(true); // Add loading state
  const [tailorRatings, setTailorRatings] = useState({}); // State to store tailor ratings

  useEffect(() => {
    getCurrentUserEmail();
    getCurrentLocation();
    fetchTailors();
    initializeTailorRatings(); // Initialize tailor ratings when component mounts
  }, []);

  useFocusEffect(
    useCallback(() => {
      setModalVisible(false); // Set modalVisible to false when the screen is focused
    }, [])
  );

  const openMaps = async () => {
    try {
      await getCurrentLocation(); // Retrieve current location

      const mapUrl = `https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(
        displayCurrentAddress
      )}&destination=${encodeURIComponent(
        displayCurrentAddress
      )}&travelmode=driving&waypoints=${filteredTailors
        .map((tailor) => tailor.area)
        .join("|")}`;
      Linking.openURL(mapUrl);
    } catch (error) {
      console.error("Error opening maps:", error);
    }
  };

  const getCurrentUserEmail = async () => {
    try {
      if (auth.currentUser) {
        const currentUserEmail = auth.currentUser.email;
        setCurrentUserEmail(currentUserEmail);

        // Find the user document in Firestore with the current user's email
        const userRef = collection(db, "users");
        const querySnapshot = await getDocs(userRef);

        for (const doc of querySnapshot.docs) {
          if (doc.data().email === currentUserEmail) {
            const customerDetailsRef = collection(
              doc.ref,
              "customerSignDetails"
            );
            const customerDetailsSnapshot = await getDocs(
              customerDetailsRef
            );
            if (!customerDetailsSnapshot.empty) {
              const profilePicture =
                customerDetailsSnapshot.docs[0].data().profilePicture;
              setProfilePicture(profilePicture);
              break;
            }
          }
        }

        console.log("Current user email:", currentUserEmail);
      } else {
        console.log("No user signed in.");
      }
    } catch (error) {
      console.error("Error fetching current user email:", error);
    }
  };

  const getCurrentLocation = async () => {
    try {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Permission Denied",
          "Allow the app to use the services",
          [
            {
              text: "Cancel",
              onPress: () => console.log("Cancel Pressed"),
              style: "cancel",
            },
            { text: "OK", onPress: () => console.log("OK Pressed") },
          ],
          { cancelable: false }
        );
        return; // Return early if permission is not granted
      }

      // Retrieve current user's email
      const currentUserEmail = auth.currentUser?.email;

      // Query Firestore to find the user's details
      if (currentUserEmail) {
        const userRef = collection(db, "users");
        const querySnapshot = await getDocs(userRef);

        for (const doc of querySnapshot.docs) {
          if (doc.data().email === currentUserEmail) {
            const customerDetailsRef = collection(
              doc.ref,
              "customerSignDetails"
            );
            const customerDetailsSnapshot = await getDocs(
              customerDetailsRef
            );

            if (!customerDetailsSnapshot.empty) {
              const customerData = customerDetailsSnapshot.docs[0].data();
              const { city, area } = customerData; // Extract city and area

              // Use city and area to fetch longitude and latitude
              const locationResponse = await Location.geocodeAsync(
                `${city}, ${area}`
              );
              if (locationResponse && locationResponse.length > 0) {
                const { latitude, longitude } = locationResponse[0];
                setDisplayCurrentAddress(`${city}, ${area}`); // Set display address
                // Update the state or perform any action with latitude and longitude
              } else {
                console.error(
                  "Location not found for city and area:",
                  city,
                  area
                );
              }
            } else {
              console.error(
                "Customer details not found for user:",
                currentUserEmail
              );
            }
            break; // Break loop once user's details are found
          }
        }
      } else {
        console.error("No user signed in.");
      }
    } catch (error) {
      console.error("Error getting current location:", error);
    }
  };

  const fetchTailors = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "users"));
      const tailorsData = await Promise.all(
        querySnapshot.docs.map(async (doc) => {
          const tailorData = doc.data();
          if (tailorData.role === "Tailor") {
            const email = tailorData.email;
            const tailorDetailsCollectionRef = collection(
              db,
              "users",
              doc.id,
              "tailorDetails"
            );
            const tailorDetailsQuerySnapshot = await getDocs(
              tailorDetailsCollectionRef
            );
            if (!tailorDetailsQuerySnapshot.empty) {
              const tailorDetailsData =
                tailorDetailsQuerySnapshot.docs[0].data();
              return {
                email,
                profilePicture: tailorDetailsData.profilePicture,
                username: tailorData.username,
                city: tailorDetailsData.city, // Include city here
                area: tailorDetailsData.area, // Include area here
                ...tailorDetailsData,
              };
            } else {
              console.log("No tailor details found for", email);
              return { email };
            }
          }
        })
      );
      console.log("Tailors Data:", tailorsData);
      setTailors(tailorsData.filter(Boolean));
      setFilteredTailors(tailorsData.filter(Boolean)); // Set filteredTailors to all tailors
      setLoading(false); // Set loading to false after setting tailors and filteredTailors
    } catch (error) {
      console.error("Error fetching tailors:", error);
      setLoading(false); // Set loading to false in case of error
    }
  };

  const handleTailorPress = (
    selectedTailorEmail,
    selectedTailorProfilePicture,
    selectedTailorShopName,
    selectedTailorShopAddress,
    city,
    area
  ) => {
    navigation.navigate("SelectedTailor", {
      selectedTailorEmail,
      selectedTailorProfilePicture,
      selectedTailorShopName,
      currentUserEmail,
      selectedTailorShopAddress,
      city,
      area,
    });
  };

  const showModal = () => setModalVisible(true);
  const hideModal = () => setModalVisible(false);

  const handleUploadPhoto = async () => {
    try {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });
      console.log("Image picker result:", result);
      console.log("Result keys:", Object.keys(result));
      if (!result.cancelled && result.assets && result.assets.length > 0) {
        const uri = result.assets[0].uri;
        console.log("Profile picture URI:", uri);
        setProfilePicture(uri);
        uploadProfilePicture(uri);
      }
    } catch (error) {
      console.log("Error uploading photo:", error);
    }
    hideModal();
  };

  const uploadProfilePicture = async (uri) => {
    try {
      if (!auth.currentUser) {
        console.log("No user signed in.");
        return;
      }

      const currentUserEmail = auth.currentUser.email;

      const userRef = collection(db, "users");
      const querySnapshot = await getDocs(userRef);
      querySnapshot.forEach(async (doc) => {
        if (doc.data().email === currentUserEmail) {
          const userDocRef = doc.ref;

          const customerDetailsRef = collection(
            userDocRef,
            "CustomerDetails"
          );
          const customerDetailsSnapshot = await getDocs(customerDetailsRef);

          if (customerDetailsSnapshot.empty) {
            await addDoc(customerDetailsRef, { profilePicture: uri });
          } else {
            const customerDetailsDocRef = doc(
              customerDetailsRef,
              "profilePicture"
            );
            await setDoc(customerDetailsDocRef, { profilePicture: uri });
          }

          console.log("Profile picture uploaded successfully.");
        }
      });
    } catch (error) {
      console.error("Error uploading profile picture:", error);
    }
  };

  const filterTailorsByCity = (city) => {
    if (city === "") {
      setFilteredTailors(tailors); // Display all tailors if search bar is empty
    } else if (city.toLowerCase() === "tailor near me") {
      const currentUserCity = displayCurrentAddress.split(" ")[1];
      const filtered = tailors.filter((tailor) => {
        return (
          tailor.city &&
          tailor.city.toLowerCase() === currentUserCity.toLowerCase()
        );
      });
      if (filtered.length > 0) {
        setFilteredTailors(filtered);
      } else {
        setFilteredTailors(tailors); // Display all tailors if no tailor found near user
      }
    } else {
      const filtered = tailors.filter((tailor) => {
        return (
          tailor.city && tailor.city.toLowerCase() === city.toLowerCase()
        );
      });
      if (filtered.length > 0) {
        setFilteredTailors(filtered);
      } else {
        setFilteredTailors([]); // Display no tailors if no match found for the entered city
      }
    }
  };

  // Function to initialize tailor ratings state
  const initializeTailorRatings = async () => {
    const ratings = {}; // Initialize empty object
    filteredTailors.forEach((tailor) => {
      ratings[tailor.email] = "Loading..."; // Set initial loading state for each tailor
    });
    setTailorRatings(ratings); // Update state with initial ratings
  };

  // Function to fetch star rating for a tailor
  const getStarRating = async (email) => {
    try {
      const querySnapshot = await getDocs(collection(db, "users"));
      const tailorDoc = querySnapshot.docs.find(
        (doc) => doc.data().email === email
      );

      if (tailorDoc) {
        console.log("Tailor found with email:", email);
        const tailorId = tailorDoc.id;
        const totalRatingRef = collection(db, "users", tailorId, "totalRating");
        const totalRatingSnapshot = await getDocs(totalRatingRef);

        if (!totalRatingSnapshot.empty) {
          const rating = totalRatingSnapshot.docs[0].data().rating;
          return "⭐️".repeat(rating); // Return stars based on rating
        } else {
          console.log("No rating found for tailor:", email);
          return "No Rating"; // Return "No Rating" if rating not found
        }
      } else {
        console.log("Tailor not found with email:", email);
        return "No Rating"; // Return "No Rating" if tailor not found
      }
    } catch (error) {
      console.error("Error getting star rating:", error);
      return "No Rating"; // Return "No Rating" in case of error
    }
  };

  // Function to fetch and update tailor ratings
  const updateTailorRatings = async () => {
    const ratings = {};
    await Promise.all(
      filteredTailors.map(async (tailor) => {
        const rating = await getStarRating(tailor.email);
        ratings[tailor.email] = rating;
      })
    );
    setTailorRatings(ratings); // Update state with fetched ratings
  };

  useEffect(() => {
    // Update tailor ratings whenever filtered tailors change
    updateTailorRatings();
  }, [filteredTailors]);

  // Sort tailors by star ratings in descending order
  const sortedTailors = filteredTailors.slice().sort((a, b) => {
    const ratingA = tailorRatings[a.email];
    const ratingB = tailorRatings[b.email];
  
    if (ratingA === undefined && ratingB === undefined) {
      return 0; // Keep the order unchanged if both ratings are undefined
    } else if (ratingA === undefined) {
      return 1; // Place tailors with undefined ratings after those with defined ratings
    } else if (ratingB === undefined) {
      return -1; // Place tailors with defined ratings before those with undefined ratings
    } else {
      return ratingB.localeCompare(ratingA); // Compare ratings in descending order
    }
  });

  // Conditional rendering based on loading state
  if (loading) {
    return <Text>Loading...</Text>;
  }

  return (
    <Provider>
      <View style={{ flex: 1 }}>
        <>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              padding: 15,
              marginVertical: -5,
            }}
          >
            <MaterialIcons name="location-on" size={30} color="#fd5c63" />
            <View>
              <Pressable onPress={openMaps}>
                <Text style={{ fontSize: 18, fontWeight: "600" }}>Home</Text>
                <Text>{displayCurrentAddress}</Text>
              </Pressable>
            </View>
            <Pressable
              onPress={showModal}
              style={{
                marginLeft: "auto",
                marginRight: 7,
                width: 50,
                height: 50,
                borderRadius: 25,
                borderWidth: 0.5,
              }}
            >
              {profilePicture ? (
                <Image
                  style={{ width: 50, height: 50, borderRadius: 25 }}
                  source={{ uri: profilePicture }}
                />
              ) : (
                <Image
                  style={{ width: 50, height: 50, borderRadius: 25 }}
                  source={{
                    uri:
                      "https://lh3.googleusercontent.com/ogw/AGvuzYamIvAVScEkeQl1ee3hTDCzMeNARiBR7f0mcgcB=s32-c-mo",
                  }}
                />
              )}
            </Pressable>
          </View>

          <View
            style={{
              backgroundColor: "white",
              padding: 8,
              flexDirection: "row",
              margin: 5,
              alignItems: "center",
              justifyContent: "space-between",
              borderWidth: 0.8,
              borderColor: "#c0c0c0",
              borderRadius: 15,
              marginTop: 10,
              marginHorizontal: 13,
            }}
          >
            <TextInput
              placeholder="enter city name for tailor at your city"
              onChangeText={(text) => setSearchText(text)}
              value={searchText}
            />
            <Ionicons
              name="md-search-outline"
              size={24}
              color="#fd5c63"
              onPress={() => filterTailorsByCity(searchText)}
            />
          </View>

          <Services />

          <View style={{ flexDirection: "row", alignItems: "center", paddingHorizontal: 24, marginTop: 10 }}>
            <Text style={{ fontSize: 18, fontWeight: "500" }}>Best Tailors</Text>
          </View>

          {sortedTailors.length > 0 ? (
            <FlatList
              contentContainerStyle={{ paddingBottom: 150 }}
              data={sortedTailors}
              renderItem={({ item }) => (
                <Pressable
                  onPress={() =>
                    handleTailorPress(
                      item.email,
                      item.profilePicture,
                      item.shopName,
                      item.shopAddress,
                      item.city,
                      item.area
                    )
                  }
                >
                  <View style={styles.tailorContainer}>
                    {item.profilePicture && (
                      <Image
                        style={styles.profilePicture}
                        source={{ uri: item.profilePicture }}
                      />
                    )}
                    <View style={styles.detailsContainer}>
                      {item.username && (
                        <Text style={styles.detailText2}>{item.username}</Text>
                      )}
                      {item.shopAddress && (
                        <Text style={styles.detailText1}>
                          Shop Address: {item.shopAddress}
                        </Text>
                      )}
                      {item.city && (
                        <Text style={styles.detailText1}>City: {item.city}</Text>
                      )}
                      {item.area && (
                        <Text style={styles.detailText1}>Area: {item.area}</Text>
                      )}
                      <View style={styles.ratingContainer}>
                        <Text style={styles.ratingStars}>
                          {tailorRatings[item.email]}
                        </Text>
                      </View>
                    </View>
                  </View>
                </Pressable>
              )}
              
            
              keyExtractor={(item) => item.email}
            />
          ) : (
            <Text style={{ alignSelf: "center", marginTop: 10 }}>
              No tailors found.
            </Text>
          )}

<Modal visible={modalVisible} onDismiss={hideModal} contentContainerStyle={styles.modalContainer}>
          <View style={{ padding: 5 }}>
            <List.Item
              title="Profile Picture"
              left={() => <List.Icon icon="plus-circle" color="white" />}
              onPress={handleUploadPhoto}
              style={{ marginBottom: 10 }}
              titleStyle={{ color: "white" }}
            />
            <Divider style={{ backgroundColor: "white" }} />
            <List.Item
              title="Account"
              left={() => <List.Icon icon="cog" color="white" />}
              onPress={() => {
                console.log("Settings pressed");
                hideModal();
                navigation.navigate("Account", {
                  userEmail: currentUserEmail,
                  userProfilePicture: profilePicture,
                });
              }}
              style={{ marginTop: 10 }}
              titleStyle={{ color: "white" }}
            />
          </View>
        </Modal>
        </>
      </View>
    </Provider>
  );
};


  const styles = StyleSheet.create({
    tailorContainer: {
      flexDirection: "row",
      alignItems: "center",
      paddingVertical: 5,
      paddingHorizontal: 15,
      backgroundColor: "#fff",
      borderRadius: 100,
      marginBottom: 5,
      elevation: 5,
      top: 25,
      shadowColor: "#059fa5",
      shadowOpacity: 0.25,
      borderWidth: 0.1
    },
    profilePicture: {
      width: 70,
      height: 70,
      borderRadius: 40,
      marginRight: 20,
      bottom: 13,
      left: 10,
    },
    detailsContainer: {
      flex: 1,
      left: 10,
    },
    detailText2: {
      fontWeight: "bold",
      fontStyle: "italic",
      fontSize: 20,
      color: "#000000",
    },
    detailText1: {
      fontWeight: "bold",
      fontStyle: "italic",
    },
    modalContainer: {
      backgroundColor: "black",
      padding: 15,
      margin: 50,
      borderRadius: 8,
      bottom: 50,
    },
    ratingContainer: {
      flexDirection: "row",
      alignItems: "center",
      bottom: 12,
      right: 83,
    },
    ratingText: {
      fontSize: 10,
      marginRight: 5,
    },
    ratingStars: {
      fontSize: 10,
      left: 10
    },
  });
export default CustomerHome;
