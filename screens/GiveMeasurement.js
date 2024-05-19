import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { AntDesign } from '@expo/vector-icons';

const GiveMeasurement = ({ route, navigation }) => {
  // Extracting data from navigation parameters
  const { selectedDate, selectedTimeSlot, selectedTailorShopName, selectedTailorShopAddress, selectedTailorEmail, measurementMethod } = route.params;

  // Function to handle going back to the previous screen
  const handleBackPress = () => {
    navigation.goBack();
  };

  // Function to navigate to the next screen with measurement method choice
  const handleMeasurementPress = () => {
    navigation.navigate('SelectGender', {
      selectedDate,
      selectedTimeSlot,
      selectedTailorShopName,
      selectedTailorShopAddress,
      selectedTailorEmail,
      measurementMethod: 'Home by Tailor', // Update with the choice made
    });
  };

  // Function to navigate to the next screen with measurement method choice
  const handleSamplePress = () => {
    navigation.navigate('Qmeasurement', {
      selectedDate,
      selectedTimeSlot,
      selectedTailorShopName,
      selectedTailorShopAddress,
      selectedTailorEmail,
      measurementMethod: 'Measured with Q*', // Update with the choice made
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <TouchableOpacity style={styles.leftArrowContainer} onPress={handleBackPress}>
          <AntDesign name="leftcircleo" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.headerText}>Give Measurements</Text>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.measurementButton} onPress={handleMeasurementPress}>
          <Text style={styles.buttonText1}>Get Measured at Home by Tailor</Text>
          <Text style={styles.buttonText2}>You can now get measured by calling a professional Tailor at home.</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.sampleButton} onPress={handleSamplePress}>
          <Text style={styles.buttonText3}>Get Measured with Q*</Text>
          <Text style={styles.buttonText4}>Using the latest technology of Q* you can now take measurement of your body easily.</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    top: 320
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    bottom: 320,
  },
  leftArrowContainer: {
    marginRight: 10,
  },
  headerText: {
    fontSize: 18,
    fontWeight: 'bold',
    left: 70,
  },
  buttonContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    bottom: 250
  },
  measurementButton: {
    backgroundColor: '#059FA5',
    paddingVertical: 50,
    paddingHorizontal: 60,
    borderRadius: 25,
    bottom: 120,
  },
  sampleButton: {
    backgroundColor: '#059FA5',
    paddingVertical: 50,
    paddingHorizontal: 35,
    borderRadius: 25,
    bottom: 70
  },
  buttonText1: {
    color: '#D7B47F',
    fontSize: 16,
    fontWeight: 'bold',
    bottom: 30
  },
  buttonText2: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: 'bold',
    bottom: 14
  },
  buttonText3: {
    color: '#D7B47F',
    fontSize: 16,
    fontWeight: 'bold',
    bottom: 35,
    textAlign: 'center'
  },
  buttonText4: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight:'bold',
    bottom: 15
  },
});

export default GiveMeasurement;
