import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import React from 'react';
import { AntDesign } from '@expo/vector-icons';
import LottieView from 'lottie-react-native';

const QMeasurement = ({route,navigation}) => {

 const { selectedDate, selectedTimeSlot, selectedTailorShopName, selectedTailorShopAddress, selectedTailorEmail, measurementMethod } = route.params;
  const handleContinuePress = () => {
    console.log("Selected Date:", selectedDate);
    console.log("Selected Time Slot:", selectedTimeSlot);
    console.log("Selected Tailor Shop Name:", selectedTailorShopName);
    console.log("Selected Tailor Shop Address:", selectedTailorShopAddress);
    console.log("Selected Tailor Email:", selectedTailorEmail);
    console.log("Measurement Method:", measurementMethod);
    
    
    navigation.navigate('SelectGender', {
      selectedDate,
      selectedTimeSlot,
      selectedTailorShopName,
      selectedTailorShopAddress,
      selectedTailorEmail,
      measurementMethod
    });
  }
  const handleBackPress = () => {
    navigation.goBack();
  };
  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <TouchableOpacity style={styles.leftArrowContainer} onPress={handleBackPress}>
          <AntDesign name="leftcircleo" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.headerText}>Measurement with Q*</Text>
      </View>

      {/* Lottie Animation */}
      <LottieView
        source={require('../assets/animations/body3.json')}
        autoPlay
        loop
        style={styles.lottieAnimation}
      />

      

      <TouchableOpacity style={styles.backButton} onPress={handleContinuePress}>
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
    top: 30,
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
    marginLeft: 59,
  },
  lottieAnimation: {
    width: 250,
    height: 250,
    alignSelf: 'center',
    bottom: 50
  },
  backButton: {
    backgroundColor: '#059FA5',
    padding: 17,
    borderRadius: 10,
    bottom: -20
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
    fontSize: 16,
  },
});

export default QMeasurement;
