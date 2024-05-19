import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import LottieView from 'lottie-react-native';

const SelectGender = ({ route, navigation }) => {
  const { selectedDate, selectedTimeSlot, selectedTailorShopName, selectedTailorShopAddress, selectedTailorEmail, measurementMethod } = route.params;

  const [isMalePressed, setIsMalePressed] = useState(false);
  const [isFemalePressed, setIsFemalePressed] = useState(false);

  const handleMalePress = () => {
    setIsMalePressed(true);
    setIsFemalePressed(false);
  };

  const handleFemalePress = () => {
    setIsMalePressed(false);
    setIsFemalePressed(true);
  };

  const handleContinuePress = () => {
    if (measurementMethod === 'Measured with Q*') {
      navigation.navigate('QChart', { // Navigate to QChart if measurementMethod is 'Q*'
        selectedDate,
        selectedTimeSlot,
        selectedTailorShopName,
        selectedTailorShopAddress,
        selectedTailorEmail,
        measurementMethod,
        gender: isMalePressed ? 'Male' : 'Female',
      });
    } else {
      navigation.navigate('MeasurementHome', { // Otherwise, navigate to MeasurementHome
        selectedDate,
        selectedTimeSlot,
        selectedTailorShopName,
        selectedTailorShopAddress,
        selectedTailorEmail,
        measurementMethod,
        gender: isMalePressed ? 'Male' : 'Female',
      });
    }
  };

  const handleBackPress = () => {
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <TouchableOpacity style={styles.leftArrowContainer} onPress={handleBackPress}>
          <AntDesign name="leftcircleo" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.headerText}>Select Your Gender</Text>
      </View>

      {/* Centered Image */}
      <LottieView
        source={require('../assets/animations/gender.json')}
        autoPlay
        loop
        style={styles.lottieAnimation}
      />

      {/* Two Text Input Fields */}
      <Text style={{ bottom: 200, alignContent: 'center', textAlign: 'center', fontWeight: 'bold' }}>
        Get a Professional Tailor to be measured at Home.
      </Text>

      {/* Male and Female Buttons */}
      <View style={styles.genderButtonsContainer}>
        <TouchableOpacity
          style={[styles.genderButton, isFemalePressed && { backgroundColor: '#059FA5' }]}
          onPress={handleFemalePress}
        >
          <Text style={styles.buttonText}>Female</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.genderButton, isMalePressed && { backgroundColor: '#059FA5' }]}
          onPress={handleMalePress}
        >
          <Text style={styles.buttonText}>Male</Text>
        </TouchableOpacity>
      </View>

      {/* Continue Button */}
      <TouchableOpacity
        style={[
          styles.continueButton,
          (isMalePressed || isFemalePressed) && { backgroundColor: '#059FA5' },
        ]}
        onPress={handleContinuePress}
      >
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
    top: 20
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 550,
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
    bottom: 130,
  },
  genderButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  genderButton: {
    backgroundColor: '#ffffff',
    padding: 10,
    borderRadius: 5,
    width: '48%',
    bottom: 160,
    borderWidth: 1,
    
  },
  buttonText: {
    color: 'black',
    textAlign: 'center',
    fontWeight: 'bold'
  },
  continueButton: {
    backgroundColor: '#ffffff',
    padding: 25,
    borderRadius: 15,
    bottom: 115,
    borderWidth: 1,
   
  },
});

export default SelectGender;
