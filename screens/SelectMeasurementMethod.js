import React from 'react';
import { View, TouchableOpacity, StyleSheet, Text } from 'react-native';
import { AntDesign } from '@expo/vector-icons';

const SelectMeasurementMethod = ({ route, navigation }) => {
  const { selectedDate, selectedTimeSlot, selectedTailorShopName, selectedTailorShopAddress, selectedTailorEmail } = route.params;

  // Function to handle going back to the previous screen
  const handleBackPress = () => {
    navigation.goBack();
  };

  // Function to handle measurement method selection
  const handleMeasurementPress = () => {
    // Store or process the selected measurement method here
    console.log('Measurement Pressed');
    navigation.navigate('GiveMeasurement', {
      selectedDate,
      selectedTimeSlot,
      selectedTailorShopName,
      selectedTailorShopAddress,
      selectedTailorEmail,
      measurementMethod: 'Measurement',
    });
  };

  // Function to handle sample method selection
  const handleSamplePress = () => {
    // Store or process the selected sample method here
    console.log('I have a Sample Pressed');
    navigation.navigate('SelectGender', {
      selectedDate,
      selectedTimeSlot,
      selectedTailorShopName,
      selectedTailorShopAddress,
      selectedTailorEmail,
      measurementMethod: 'Sample',
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <TouchableOpacity style={styles.leftArrowContainer} onPress={handleBackPress}>
          <AntDesign name="leftcircleo" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.headerText}>Select Measurement Method</Text>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.measurementButton} onPress={handleMeasurementPress}>
          <Text style={styles.buttonText}>Measurement</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.sampleButton} onPress={handleSamplePress}>
          <Text style={styles.buttonText}>I have a Sample</Text>
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
    bottom: 310,
  },
  leftArrowContainer: {
    marginRight: 10,
  },
  headerText: {
    fontSize: 18,
    fontWeight: 'bold',
    left: 40,
  },
  buttonContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    bottom: 250
  },
  measurementButton: {
    backgroundColor: '#059FA5',
    paddingVertical: 20,
    paddingHorizontal: 120,
    borderRadius: 25,
    bottom: 120,
    
  },
  sampleButton: {
    backgroundColor: '#059FA5',
    paddingVertical: 20,
    paddingHorizontal: 115,
    borderRadius: 25,
    bottom: 70
    
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    
  },
});

export default SelectMeasurementMethod;
