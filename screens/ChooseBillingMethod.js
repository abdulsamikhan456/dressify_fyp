import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { AntDesign } from '@expo/vector-icons';

const ChooseBillingMethod = ({ route, navigation }) => {
  const { selectedDate, selectedTimeSlot, selectedTailorShopName, selectedTailorShopAddress, selectedTailorEmail, measurementMethod, gender, pickupAddress, deliveryAddress, 
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

  const [selectedMethod, setSelectedMethod] = useState(null);

  const handlePaymentMethodPress = (method) => {
    setSelectedMethod(method);
    console.log(`${method} Pressed`);
  };

  const handleContinuePress = () => {
    // Log all the information to the console
    console.log('Selected Date:', selectedDate);
    console.log('Selected Time Slot:', selectedTimeSlot);
    console.log('Selected Tailor Shop Name:', selectedTailorShopName);
    console.log('Selected Tailor Shop Address:', selectedTailorShopAddress);
    console.log('Selected Tailor Email:', selectedTailorEmail);
    console.log('Measurement Method:', measurementMethod);
    console.log('Gender:', gender);
    console.log('Selected Payment Method:', selectedMethod);
    console.log('pickupAddress:', pickupAddress);
    console.log('deliveryAddress:', deliveryAddress);
    
    if(measurementMethod === 'Measured with Q*'){
      navigation.navigate('ReqSend', {
        selectedDate,
        selectedTimeSlot,
        selectedTailorShopName,
        selectedTailorShopAddress,
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
    }else {
      navigation.navigate('ReqSend', { 
        selectedDate,
        selectedTimeSlot,
        selectedTailorShopName,
        selectedTailorShopAddress,
        selectedTailorEmail,
        pickupAddress,
        deliveryAddress,
        measurementMethod,
        gender,
      });
    }

  }

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <TouchableOpacity style={styles.leftArrowContainer} onPress={() => console.log('Left Arrow Pressed')}>
          <AntDesign name="leftcircleo" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.headerText}>Select Payment Method</Text>
      </View>

      <View style={styles.noteContainer}>
        <Text style={styles.noteText}>
          Note: Please choose your preferred payment method below.
        </Text>
      </View>

      {/* Payment Method Buttons */}
      <TouchableOpacity
        style={[styles.paymentMethodButton, selectedMethod === 'Cash on Delivery' && styles.selectedButton]}
        onPress={() => handlePaymentMethodPress('Cash on Delivery')}
      >
        <Text style={styles.buttonText}>Cash on Delivery</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.paymentMethodButton, selectedMethod === 'Online Payment' && styles.selectedButton]}
        onPress={() => handlePaymentMethodPress('Online Payment')}
      >
        <Text style={styles.buttonText}>Online Payment</Text>
      </TouchableOpacity>

      {/* Continue Button */}
      <TouchableOpacity style={styles.continueButton} onPress={handleContinuePress}>
        <Text style={styles.buttonText}>Continue</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 30,
    bottom: 75,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 60,
    bottom: 75,
  },
  leftArrowContainer: {
    marginRight: 10,
  },
  headerText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 50,
  },
  noteContainer: {
    backgroundColor: 'lightgrey',
    padding: 15,
    borderRadius: 5,
    marginBottom: 30,
    bottom: 70,
  },
  noteText: {
    fontSize: 14,
    color: 'black',
    fontWeight: 'bold'
  },
  paymentMethodButton: {
    backgroundColor: '#ffffff',
    padding: 20,
    borderRadius: 15,
    marginBottom: 10,
    borderWidth: 1,
  },
  selectedButton: {
    backgroundColor: '#059FA5',
  },
  buttonText: {
    color: 'black',
    textAlign: 'center',
    fontWeight: 'bold'
  },
  continueButton: {
    backgroundColor: '#059FA5',
    padding: 25,
    borderRadius: 15,
    top: 80,
  },
});

export default ChooseBillingMethod;
