import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Image,
  TextInput,
  SafeAreaView
} from "react-native";
import { AntDesign } from "@expo/vector-icons";
import { getFirestore, collection, getDocs } from "firebase/firestore";
import { auth } from "../../firebase"; // Import auth from firebase

const db = getFirestore();

const TailorsScreen = ({ navigation }) => {
  const [tailors, setTailors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentUserEmail, setCurrentUserEmail] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [highlightedTailorIndex, setHighlightedTailorIndex] = useState(-1);
  const [filteredTailors, setFilteredTailors] = useState([]);
  const [tailorRatings, setTailorRatings] = useState({});

  useEffect(() => {
    fetchTailors();
    getCurrentUserEmail();
  }, []);

  const getCurrentUserEmail = async () => {
    try {
      if (auth.currentUser) {
        const currentUserEmail = auth.currentUser.email;
        setCurrentUserEmail(currentUserEmail);
        console.log("Current user email:", currentUserEmail);
      } else {
        console.log("No user signed in.");
      }
    } catch (error) {
      console.error("Error fetching current user email:", error);
    }
  };

  // const fetchTailors = async () => {
  //   try {
  //     const querySnapshot = await getDocs(collection(db, 'users'));
  //     const tailorsData = await Promise.all(
  //       querySnapshot.docs.map(async (doc) => {
  //         const tailorData = doc.data();
  //         if (tailorData.role === 'Tailor') {
  //           const email = tailorData.email;
  //           const tailorDetailsCollectionRef = collection(db, 'users', doc.id, 'tailorDetails');
  //           const tailorDetailsQuerySnapshot = await getDocs(tailorDetailsCollectionRef);
  //           if (!tailorDetailsQuerySnapshot.empty) {
  //             const tailorDetailsData = tailorDetailsQuerySnapshot.docs[0].data();
  //             return {
  //               email,
  //               profilePicture: tailorDetailsData.profilePicture,
  //               username: tailorData.username,
  //               city: tailorDetailsData.city, // Include city here
  //               ...tailorDetailsData,
  //             };
  //           } else {
  //             console.log('No tailor details found for', email);
  //             return { email };
  //           }
  //         }
  //       })
  //     );
  //     console.log('Tailors Data:', tailorsData);
  //     setTailors(tailorsData.filter(Boolean));
  //     setLoading(false); // Set loading to false after setting tailors
  //   } catch (error) {
  //     console.error('Error fetching tailors:', error);
  //     setLoading(false); // Set loading to false in case of error
  //   }
  // };

  const navigateToSelectedTailorScreen = (tailor) => {
    if (currentUserEmail) {
      navigation.navigate("SelectedTailor", {
        tailor,
        selectedTailorProfilePicture: tailor.profilePicture, // Pass the profile picture
        currentUserEmail,
        selectedTailorShopName: tailor.shopName,
      });
    } else {
      console.log("Current user email not available.");
    }
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
    const lowercaseQuery = query.toLowerCase();
    const index = tailors.findIndex((tailor) =>
      tailor.username.toLowerCase().includes(lowercaseQuery)
    );
    setHighlightedTailorIndex(index);
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

          const customerDetailsRef = collection(userDocRef, "CustomerDetails");
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
        return tailor.city && tailor.city.toLowerCase() === city.toLowerCase();
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

  // Conditional rendering based on loading state
  if (loading) {
    return <Text>Loading...</Text>;
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
    <ScrollView
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={true}
    >
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <View style={styles.backButton}>
            {/* <AntDesign name="arrowleft" size={24} color="black" /> */}
          </View>
        </TouchableOpacity>
        <Text style={styles.headerText}>All our Tailors</Text>
      </View>
      <TextInput
        style={styles.searchBar}
        placeholder="Search by username..."
        value={searchQuery}
        onChangeText={handleSearch}
      />

      <Text style={styles.noteText}>
        All the tailors are shown below, appoint them for your order.
      </Text>
      {loading ? (
        <Text>Loading...</Text>
      ) : (
        tailors.map((tailor, index) => {
          const isMatching =
            searchQuery &&
            tailor.username.toLowerCase().includes(searchQuery.toLowerCase());
          if (isMatching) {
            return (
              <TouchableOpacity
                key={index}
                style={[
                  styles.noticeBox,
                  index === highlightedTailorIndex && styles.highlightedTailor,
                  isMatching && styles.searchMatch,
                ]}
                onPress={() => navigateToSelectedTailorScreen(tailor)}
              >
                <Image
                  source={{ uri: tailor.profilePicture }}
                  style={styles.profilePicture}
                />
                <View style={styles.textContainer}>
                  <Text style={styles.tailorName}>{tailor.username}</Text>
                  <Text style={styles.tailorEmail}>{tailor.email}</Text>
                  <Text style={styles.tailorCity}>{tailor.city}</Text>
                  <Text style={styles.tailorShopName}>{tailor.shopName}</Text>
                  <View style={styles.ratingContainer}>
                    <Text style={styles.ratingStars}>⭐️⭐️⭐️⭐️⭐️</Text>
                  </View>
                  {/* Add more tailor information here as needed */}
                </View>
               
              </TouchableOpacity>
            );
          }
          return null;
        })
      )}
      {loading
        ? null
        : tailors.map((tailor, index) => {
            const isMatching =
              searchQuery &&
              tailor.username.toLowerCase().includes(searchQuery.toLowerCase());
            if (!isMatching) {
              return (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.noticeBox,
                    index === highlightedTailorIndex &&
                      styles.highlightedTailor,
                  ]}
                  onPress={() => navigateToSelectedTailorScreen(tailor)}
                >
                  <Image
                    source={{ uri: tailor.profilePicture }}
                    style={styles.profilePicture}
                  />
                  <View style={styles.textContainer}>
                    <Text style={styles.tailorName}>{tailor.username}</Text>
                    <Text style={styles.tailorEmail}>{tailor.email}</Text>
                    <Text style={styles.tailorCity}>{tailor.city}</Text>
                    <Text style={styles.tailorShopName}>{tailor.shopName}</Text>
                    <View style={styles.ratingContainer}>
                      <Text style={styles.ratingStars}>⭐️⭐️⭐️⭐️⭐️</Text>
                    </View>
                    {/* Add more tailor information here as needed */}
                  </View>
                  
                </TouchableOpacity>
                
              );
              
            }
            return null;
          })}
           <View style={{ height: 200 }} />
    </ScrollView>
    </SafeAreaView>
  );
};
export default TailorsScreen;

const styles = StyleSheet.create({
  container: {
    padding: 15,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  backButton: {
    marginRight: 10,
    padding: 8,
    borderRadius: 50,
    backgroundColor: "#f0f0f0",
    bottom: 20,
    right: 5,
  },
  headerText: {
    fontSize: 24,
    fontWeight: "bold",

    left: 85,
  },
  searchBar: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 15,
    paddingVertical: 8,
    paddingHorizontal: 10,
    marginBottom: 10,
    top: 15,
    backgroundColor: "white",
  },
  noticeBox: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    padding: 20,
    backgroundColor: "#ffffff",
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 10,
    top: 50,
    shadowColor: "#059fa5",
  },
  highlightedTailor: {
    backgroundColor: "#f0f0f0",
  },
  profilePicture: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
    bottom: 15,
    right: 5,
  },
  textContainer: {
    flex: 1,
  },
  tailorName: {
    fontSize: 18,
    fontWeight: "bold",
  },
  tailorEmail: {
    fontSize: 14,
    color: "gray",
  },
  tailorCity: {
    fontSize: 14,
    color: "gray",
  },
  tailorShopName: {
    fontSize: 14,
    color: "gray",
  },
  noteText: {
    fontSize: 13,
    fontWeight: "400",
    marginBottom: 20,
    left: 5,
    top: 15,
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    bottom: 20,
    right: 70,
  },
  ratingText: {
    fontSize: 10,
    marginRight: 5,
  },
  ratingStars: {
    fontSize: 10,
  },
  searchMatch: {
    backgroundColor: "#abdbe3",
  },
});
