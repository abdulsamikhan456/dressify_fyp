import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { getFirestore, collection, query, where, getDocs, doc, getDoc, setDoc } from 'firebase/firestore';



const TailorPersonalInfo = () => {
    const navigation = useNavigation();
    const route = useRoute();
    const { userEmail } = route.params;
  
    const [userDetails, setUserDetails] = useState(null);
    const [username, setUsername] = useState('');
    const [city, setCity] = useState('');
    const [area, setArea] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
      const fetchUserDetails = async () => {
          try {
              if (!userEmail) {
                  console.error('User email is undefined');
                  return;
              }
  
              const firestore = getFirestore();
              const usersCollectionRef = collection(firestore, 'users');
              const q = query(usersCollectionRef, where('email', '==', userEmail));
              const querySnapshot = await getDocs(q);
              if (!querySnapshot.empty) {
                  const userDoc = querySnapshot.docs[0];
                  const userData = userDoc.data();
                  if (userData.role === 'Tailor') {
                      const tailorDetailsCollectionRef = collection(userDoc.ref, 'tailorDetails');
                      const tailorDetailsQuerySnapshot = await getDocs(tailorDetailsCollectionRef);
                      if (!tailorDetailsQuerySnapshot.empty) {
                          const tailorDetailsDoc = tailorDetailsQuerySnapshot.docs[0];
                          const tailorDetailsData = tailorDetailsDoc.data();
                          setUserDetails({
                              name: userData.username,
                              email: userData.email,
                              city: tailorDetailsData.city || '',
                              area: tailorDetailsData.area || '',
                              phoneNumber: tailorDetailsData.phoneNumber || '',
                          });
                      }
                  }
              }
          } catch (error) {
              console.error('Error fetching user details:', error);
          }
      };
      fetchUserDetails();
  }, [userEmail]);



  const handleEditInfo = () => {
    setIsEditing(true);
    setUsername('');
    setCity('');
    setArea('');
    setPhoneNumber('');
  };

  const handleSubmitChanges = async () => {
    try {
        const firestore = getFirestore();
        const usersCollectionRef = collection(firestore, 'users');
        const q = query(usersCollectionRef, where('email', '==', userEmail));
        const querySnapshot = await getDocs(q);
        if (!querySnapshot.empty) {
            const userDoc = querySnapshot.docs[0];
            const tailorDetailsCollectionRef = collection(userDoc.ref, 'tailorDetails');
            await setDoc(doc(tailorDetailsCollectionRef), {
                city,
                area,
                phoneNumber,
            }, { merge: true });
            // Update userDetails state with new data
            setUserDetails(prevDetails => ({
                ...prevDetails,
                city,
                area,
                phoneNumber,
            }));
            // Optionally, show a success message or navigate back
            console.log('Changes submitted successfully');
            setIsEditing(false); // Reset editing state after submitting changes
        }
    } catch (error) {
        console.error('Error submitting changes:', error);
    }
};

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons
            name="arrow-back"
            size={24}
            color="black"
            style={styles.arrowIcon}
          />
        </TouchableOpacity>
        <Text style={styles.headerText}>Personal Details</Text>
      </View>
      <Text style={styles.paragraph}>
        Dressify uses this information to verify your identity and to keep our
        community safe. You decide what to change according to our requirements.
      </Text>
      <View style={styles.noticeBox}>
        <Text style={styles.noticeText}>
          Please ensure that your personal information is accurate and
          up-to-date.
        </Text>
      </View>

      <View style={styles.detailsBox}>
        <Text style={styles.detailsText}>User Details:</Text>
        <View style={styles.inputContainer}>
          <Ionicons
            name="person-outline"
            size={24}
            color="black"
            style={styles.inputIcon}
          />
          <TextInput
            style={styles.inputField}
            placeholder="Username"
            onChangeText={setUsername}
            value={isEditing ? username : userDetails?.name || ""}
            editable={isEditing}
          />
        </View>
        <View style={styles.inputContainer}>
          <Ionicons
            name="mail-outline"
            size={24}
            color="black"
            style={styles.inputIcon}
          />
          <TextInput
            style={styles.inputField}
            placeholder="Email"
            onChangeText={(text) => console.log(text)}
            value={userDetails?.email || ""}
            editable={false}
          />
        </View>
        <View style={styles.inputContainer}>
          <Ionicons
            name="location-outline"
            size={24}
            color="black"
            style={styles.inputIcon}
          />
          <TextInput
            style={styles.inputField}
            placeholder="City"
            onChangeText={setCity}
            value={isEditing ? city : userDetails?.city || ""}
            editable={isEditing}
          />
        </View>
        <View style={styles.inputContainer}>
          <Ionicons
            name="map-outline"
            size={24}
            color="black"
            style={styles.inputIcon}
          />
          <TextInput
            style={styles.inputField}
            placeholder="Area"
            onChangeText={setArea}
            value={isEditing ? area : userDetails?.area || ""}
            editable={isEditing}
          />
        </View>
        <View style={styles.inputContainer}>
          <Ionicons
            name="call-outline"
            size={24}
            color="black"
            style={styles.inputIcon}
          />
          <TextInput
            style={styles.inputField}
            placeholder="Contact Number"
            onChangeText={setPhoneNumber}
            value={isEditing ? phoneNumber : userDetails?.phoneNumber || ""}
            editable={isEditing}
          />
        </View>
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.editButton} onPress={handleEditInfo}>
            <Text style={styles.buttonText}>Edit Info</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.submitButton}
            onPress={handleSubmitChanges}
            disabled={!isEditing} // Disable the button when not editing
          >
            <Text style={styles.buttonText}>Submit Changes</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  arrowIcon: {
    marginRight: 10,
  },
  headerText: {
    fontSize: 23,
    fontWeight: "bold",
    top: 35,
    right: 30,
  },
  paragraph: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 20,
    top: 30,
    left: 5,
  },
  noticeBox: {
    backgroundColor: "#f0f0f0",
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
    elevation: 3,
    top: 430,
  },
  noticeText: {
    fontSize: 14,
    textAlign: "center",
    color: "#333",
  },
  detailsBox: {
    backgroundColor: "#f9f9f9",
    padding: 15,
    borderRadius: 10,
    elevation: 3,
    bottom: 60,
    height: 330,
  },
  detailsText: {
    fontSize: 16,
    marginBottom: 5,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  inputIcon: {
    marginRight: 10,
  },
  inputField: {
    flex: 1,
    borderWidth: 1,
    borderColor: "gray",
    borderRadius: 5,
    paddingVertical: 8,
    paddingHorizontal: 10,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
    top: 10,
  },
  editButton: {
    backgroundColor: "#059fa5",
    borderRadius: 5,
    paddingVertical: 10,
    paddingHorizontal: 40,
    left: 10,
  },
  submitButton: {
    backgroundColor: "#059fa5",
    borderRadius: 5,
    paddingVertical: 10,
    paddingHorizontal: 15,
    right: 10,
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
  },
});

export default TailorPersonalInfo;
