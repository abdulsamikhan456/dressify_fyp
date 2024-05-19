import React, { useState } from 'react';
import { StyleSheet, Text, View, Image, TextInput, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const Payment = () => {
  const navigation = useNavigation();
  const [cardNumber, setCardNumber] = useState('');
  const [cardholderName, setCardholderName] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCVV] = useState('');

  const handlePayNow = async () => {
    if (!cardNumber || !cardholderName || !expiryDate || !cvv) {
      alert('Please fill in all fields.');
     
      return;
    }
    Alert.alert('Network Error', 'An error occurred. Please try again later.');
    
    
  };

  // Simulated payment logic (replace this with actual payment logic)
  const simulatePayment = () => {
    return new Promise((resolve, reject) => {
      // Simulate a network request
      setTimeout(() => {
        // Simulate success
        resolve();
        // Simulate failure
        // reject(new Error('Network error'));
      }, 2000);
    });
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
        <Ionicons name="arrow-back-outline" size={24} color="white" />
      </TouchableOpacity>
      <Image source={require('../assets/images/Credit-Card.png')} style={styles.cardImage} />
      <Text style={styles.heading}>Credit Card Payment</Text>
      <View style={styles.cardContainer}>
        <Text style={styles.cardLabel}>Card Number</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter card number"
          keyboardType="numeric"
          value={cardNumber}
          onChangeText={setCardNumber}
        />
        <Text style={styles.cardLabel}>Cardholder Name</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter cardholder name"
          value={cardholderName}
          onChangeText={setCardholderName}
        />
        <View style={styles.row}>
          <View style={[styles.flex, { marginRight: 10 }]}>
            <Text style={styles.cardLabel}>Expiry Date</Text>
            <TextInput
              style={[styles.input, { width: '100%' }]}
              placeholder="MM/YY"
              keyboardType="numeric"
              maxLength={5}
              value={expiryDate}
              onChangeText={setExpiryDate}
            />
          </View>
          <View style={styles.flex}>
            <Text style={styles.cardLabel}>CVV</Text>
            <TextInput
              style={styles.input}
              placeholder="CVV"
              keyboardType="numeric"
              maxLength={3}
              value={cvv}
              onChangeText={setCVV}
            />
          </View>
        </View>
      </View>
      <TouchableOpacity style={styles.button} onPress={handlePayNow}>
        <Text style={styles.buttonText}>Pay Now</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    padding: 20,
    backgroundColor: 'black'
  },
  backButton: {
    position: 'absolute',
    top: 20,
    left: 20,
    zIndex: 1,
  },
  cardImage: {
    width: 200,
    height: 120,
    resizeMode: 'contain',
    marginBottom: 20,
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: 'white'
  },
  cardContainer: {
    width: '100%',
  },
  cardLabel: {
    fontSize: 16,
    marginBottom: 5,
    color: 'white'

  },
  input: {
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 5,
    padding: 10,
    marginBottom: 15,
    color: 'black',
    backgroundColor: 'white'

  },
  row: {
    flexDirection: 'row',
    marginBottom: 15,
  },
  flex: {
    flex: 1,
  },
  button: {
    backgroundColor: '#059fa5',
    padding: 15,
    borderRadius: 10,
    marginTop: 20,
    width: '100%',
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default Payment;
