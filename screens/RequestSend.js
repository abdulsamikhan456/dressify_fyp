import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import React from 'react';
import { AntDesign } from '@expo/vector-icons';
import LottieView from 'lottie-react-native';
import { db } from '../firebase';
import { collection, getDocs, query, where, addDoc } from 'firebase/firestore';

const RequestSend = ({ route, navigation }) => {
  console.log('Received Route Params:', route.params);

  const { selectedDate, selectedTimeSlot, selectedTailorEmail, selectedTailorShopName, selectedTailorShopAddress, measurementMethod, gender, pickupAddress, deliveryAddress, selectedMethod, 
    heightFeet,
      heightInches,
      neckSize,
      shoulderWidth,
      sleeveLength,
      cuffCircumference,
      chestCircumference,
      waistCircumference,
      damanCircumference,
      armholeCircumference,
      kameezOnKneesLength,
      kameezOffKneesLength,
      shalwarLength,
      paichaCircumference, } = route.params;

  const handleSeeRequest = async () => {
    try {
      // Query the users collection to find the document with the matching email
      const usersCollectionRef = collection(db, 'users');
      const q = query(usersCollectionRef, where('email', '==', selectedTailorEmail));
      const querySnapshot = await getDocs(q);
  
      if (!querySnapshot.empty) {
        // If the tailor exists, fetch their UID
        const tailorDoc = querySnapshot.docs[0];
        const tailorUid = tailorDoc.id;
  
        // Generate a random order number
        const orderNumber = generateOrderNumber();
  
        // Store the request information in the customerRequests collection
        const customerRequestsRef = collection(db, 'users', tailorUid, 'customerRequests');

        if (measurementMethod === "Measured with Q*") {
          await addDoc(customerRequestsRef, {
            orderNumber,
            selectedDate,
            selectedTimeSlot,
            selectedTailorEmail,
            measurementMethod,
            gender,
            pickupAddress,
            deliveryAddress,
            heightFeet,
      heightInches,
      neckSize,
      shoulderWidth,
      sleeveLength,
      cuffCircumference,
      chestCircumference,
      waistCircumference,
      damanCircumference,
      armholeCircumference,
      kameezOnKneesLength,
      kameezOffKneesLength,
      shalwarLength,
      paichaCircumference,
          });
        } else {
          // Store only specific data
          await addDoc(customerRequestsRef, {
            orderNumber,
            selectedDate,
            selectedTimeSlot,
            selectedTailorEmail,
            measurementMethod,
            gender,
            pickupAddress,
            deliveryAddress
          });
        }
  
        // Navigate to the Orders screen, passing the order number and other information
        navigation.navigate('Orders', { orderNumber, ...route.params });
      } else {
        // If no matching tailor is found
        console.log('Tailor does not exist.');
      }
    } catch (error) {
      console.error('Error adding request:', error);
    }
  };

  // Function to generate a random order number
  const generateOrderNumber = () => {
    return Math.floor(100000 + Math.random() * 900000); // Generates a random 6-digit number
  };

  
  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        {/* <TouchableOpacity style={styles.leftArrowContainer} onPress={() => console.log('Left Arrow Pressed')}>
          <AntDesign name="leftcircleo" size={24} color="black" />
        </TouchableOpacity> */}
        <Text style={styles.headerText}></Text>
      </View>

      {/* Lottie Animation */}
      <LottieView
        source={require('../assets/animations/Req_send.json')}
        autoPlay
        loop
        style={styles.lottieAnimation}
      />

      {/* Back to Home Button */}
      <Text style={{alignContent:'center', textAlign: 'center', bottom: 60, fontWeight: 'bold'}}>Request Send to Tailor</Text>
      <TouchableOpacity style={styles.backButton} onPress={handleSeeRequest}>
        <Text style={styles.buttonText}>See the Request</Text>
      </TouchableOpacity>
    </View>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 30,
    top: 10,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    bottom: 175
  },
  leftArrowContainer: {
    marginRight: 10,
  },
  headerText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 70,
  },
  lottieAnimation: {
    width: 200,
    height: 200,
    alignSelf: 'center',
    bottom: 60
  },
  backButton: {
    backgroundColor: '#059FA5',
    padding: 17,
    borderRadius: 10,
    bottom: 30
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
    fontSize: 16,
  },

});

export default RequestSend;
