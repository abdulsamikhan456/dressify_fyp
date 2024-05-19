import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import MapView, { Marker } from 'react-native-maps';

const GiveMeasureHome = ({ route, navigation }) => {
  const { selectedDate, selectedTimeSlot, selectedTailorShopName, selectedTailorShopAddress, selectedTailorEmail, measurementMethod, gender, 
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

  const [region, setRegion] = useState({
    latitude: 33.6844,
    longitude: 73.0479,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });

  const [pickupAddress, setPickupAddress] = useState('');
  const [deliveryAddress, setDeliveryAddress] = useState('');

  const handleProceed = () => {
    // Check if both fields are filled
    if (pickupAddress.trim() === '' || deliveryAddress.trim() === '') {
      alert('Please enter both pickup and delivery addresses.');
      return;
    }

    if(measurementMethod === 'Measured with Q*'){
      navigation.navigate('BillingMethod', {
        selectedDate,
        selectedTimeSlot,
        selectedTailorShopName,
        selectedTailorShopAddress,
        selectedTailorEmail,
        measurementMethod,
        gender,
        pickupAddress,
        deliveryAddress,
        region,
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
      navigation.navigate('BillingMethod', { // Otherwise, navigate to MeasurementHome
        selectedDate,
        selectedTimeSlot,
        selectedTailorShopName,
        pickupAddress,
        deliveryAddress,
        selectedTailorShopAddress,
        selectedTailorEmail,
        measurementMethod,
        gender
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
        <Text style={styles.headerText}>Address Confirmation</Text>
      </View>

      <MapView style={styles.map} region={region} onRegionChangeComplete={(newRegion) => setRegion(newRegion)}>
        <Marker coordinate={{ latitude: region.latitude, longitude: region.longitude }} />
      </MapView>

      <TextInput
        style={styles.addressInput}
        placeholder="Enter Pickup Address"
        value={pickupAddress}
        onChangeText={(text) => setPickupAddress(text)}
      />
      <TextInput
        style={styles.addressInput1}
        placeholder="Enter Delivery Address"
        value={deliveryAddress}
        onChangeText={(text) => setDeliveryAddress(text)}
      />

      <TouchableOpacity style={styles.proceedButton} onPress={handleProceed}>
        <Text style={styles.buttonText}>Proceed</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    bottom: 170,
  },
  leftArrowContainer: {
    right: 70,
  },
  headerText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  map: {
    width: '90%',
    height: 200,
    borderRadius: 10,
    bottom: 50,
  },
  addressInput: {
    width: '80%',
    height: 40,
    borderWidth: 1,
    borderColor: 'gray',
    bottom: 30,
    padding: 10,
    borderRadius: 5,
  },

  addressInput1: {
    width: '80%',
    height: 40,
    borderWidth: 1,
    borderColor: 'gray',
    bottom: 10,
    padding: 10,
    borderRadius: 5,
  },

  proceedButton: {
    marginTop: 10,
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: '#059FA5',
    borderRadius: 5,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
  },
});

export default GiveMeasureHome;
