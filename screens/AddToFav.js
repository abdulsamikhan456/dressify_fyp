import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, Pressable, Image, ActivityIndicator } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { collection, getDocs, deleteDoc, doc, query, where } from 'firebase/firestore';
import { db, auth } from '../firebase';
import { useNavigation } from '@react-navigation/native';
import LottieView from 'lottie-react-native';
import { AntDesign } from '@expo/vector-icons';

const AddToFav = ({ route, navigation }) => {
  const [favTailors, setFavTailors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentUserEmail, setCurrentUserEmail] = useState(null); // Initialize currentUserEmail state

  useEffect(() => {
    const fetchFavTailors = async () => {
      try {
        // Step 1: Call getCurrentUserEmail to get the current user's email
        getCurrentUserEmail();

        // Step 2: Fetch favorite tailors based on the currentUserEmail
        const userQuery = collection(db, 'users');
        const querySnapshot = await getDocs(userQuery);

        querySnapshot.forEach(async (userDoc) => {
          if (userDoc.data().email === currentUserEmail) {
            const addToFavCollectionRef = collection(db, `users/${userDoc.id}/AddToFav`);
            const addToFavSnapshot = await getDocs(addToFavCollectionRef);

            const favTailorsData = [];
            addToFavSnapshot.forEach((doc) => {
              favTailorsData.push({ id: doc.id, ...doc.data() });
            });
            setFavTailors(favTailorsData);
            setLoading(false);
          }
        });
      } catch (error) {
        console.error('Error fetching favorite tailors:', error);
        setLoading(false);
      }
    };

    fetchFavTailors();
  }, [currentUserEmail]);

  // Function to fetch current user's email
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

  // Function to delete a favorite tailor
  const deleteFavoriteTailor = async (id) => {
    try {
      const userQuery = query(collection(db, 'users'), where("email", "==", currentUserEmail));
      const userSnapshot = await getDocs(userQuery);
      
      if (!userSnapshot.empty) {
        userSnapshot.forEach(async (userDoc) => {
          const addToFavCollection = collection(db, `users/${userDoc.id}/AddToFav`);
          await deleteDoc(doc(addToFavCollection, id));
          setFavTailors(favTailors.filter(tailor => tailor.id !== id));
          console.log("Favorite tailor deleted successfully!");
        });
      } else {
        console.log("User not found with email: ", currentUserEmail);
      }
    } catch (error) {
      console.error("Error deleting favorite tailor:", error);
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable onPress={() => navigation.goBack()}>
          <MaterialIcons name="arrow-back" size={24} color="black" />
        </Pressable>
      </View>

      {/* Heading */}
      <Text style={styles.heading}>Your Fav Tailors</Text>

      {/* Note */}
      {loading && <ActivityIndicator style={styles.activityIndicator} size="large" color="#059FA5" />}
      {!loading && favTailors.length === 0 && (
        <>
          <Text style={styles.noDataText}>You have no wishlist for tailors.</Text>
          {/* <View style={styles.lottieContainer}>
            <LottieView
              source={require('../assets/animations/nolist.json')}
              autoPlay
              loop
              style={styles.lottieAnimation}
            />
          </View> */}
        </>
      )}
      {!loading && favTailors.length > 0 && <Text style={styles.note}>Your wish list will be shown here.</Text>}

      {/* Favorite Tailors */}
      <View style={styles.noticeContainer}>
        {favTailors.map((tailor, index) => (
          <Pressable
            key={index}
            onPress={() => {
              navigation.navigate('SelectedTailor', {
                currentUserEmail: currentUserEmail,
                selectedTailorProfilePicture: tailor.selectedTailorProfilePicture,
                selectedTailorShopName: tailor.selectedTailorShopName,
                selectedTailorShopAddress: tailor.selectedTailorShopAddress,
                selectedTailorEmail: tailor.selectedTailorEmail,
              });
            }}
          >
            <View style={styles.noticeBox}>
              {tailor.selectedTailorProfilePicture && <Image style={styles.profilePicture} source={{ uri: tailor.selectedTailorProfilePicture }} />}
              <View style={styles.detailsContainer}>
                {tailor.selectedTailorShopName && <Text style={styles.detailText2}>{tailor.selectedTailorShopName}</Text>}
                {tailor.selectedTailorShopAddress && <Text style={styles.detailText1}>Shop Address: {tailor.selectedTailorShopAddress}</Text>}
                {tailor.selectedTailorEmail && <Text style={styles.detailText1}>Email: {tailor.selectedTailorEmail}</Text>}
              </View>
              <Pressable style={{bottom:30}} onPress={() => deleteFavoriteTailor(tailor.id)}>
              <MaterialIcons name="delete-outline" size={24} color="red" />
              </Pressable>
            </View>
          </Pressable>
        ))}
      </View>
    </View>
  );
};

export default AddToFav;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginBottom: 20,
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    bottom: 49,
    left: 100
  },
  activityIndicator: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noDataText: {
    fontSize: 16,
    marginBottom: 20,
    bottom: 30,
    left: 75,
    color: 'gray',
    fontStyle: 'italic',
  },
  note: {
    fontSize: 16,
    marginBottom: 20,
    bottom: 30,
    left: 8
  },
  noticeContainer: {
    flex: 1,
  },
 
  noticeBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 20,
    marginBottom: 10,
    borderColor: 'grey',
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 10,
    shadowColor: '#059fa5'
  },
  profilePicture: {
    width: 70,
    height: 70,
    borderRadius: 35,
    marginRight: 20,
  },
  detailsContainer: {
    flex: 1,
  },
  detailText2: {
    fontWeight: 'bold',
    fontStyle: 'italic',
    fontSize: 20,
  },
  detailText1: {
    fontWeight: 'bold',
    fontStyle: 'italic',
  },
});

