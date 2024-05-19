import { StyleSheet, Text, View, TouchableOpacity } from 'react-native'
import React from 'react'
import { useNavigation } from '@react-navigation/native';

const AdminDashboard = () => {
  const navigation = useNavigation();

  const handleCustomerDetailsPress = () => {
    navigation.navigate('CustomerDetails');
  };

  const handleTailorDetailsPress = () => {
    navigation.navigate('TailorDetails');
  };

  return (
    <View style={styles.container}>
  <Text style={styles.dressifyText}>Dressify.</Text>
  <Text style={styles.welcomeText}>Welcome Admin!</Text>
  <View style={styles.horizontalLine} />
  <View style={styles.buttonContainer}>
    <TouchableOpacity style={styles.button} onPress={handleCustomerDetailsPress}>
      <Text style={styles.buttonText}>Customer Details</Text>
    </TouchableOpacity>
    <TouchableOpacity style={styles.button} onPress={handleTailorDetailsPress}>
      <Text style={styles.buttonText}>Tailor Details</Text>
    </TouchableOpacity>
  </View>
</View>
  )
}

export default AdminDashboard

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dressifyText: {
    fontSize: 60,
    fontWeight: 'bold',
    color: '#059fa5',
    marginBottom: 10,
    bottom: 90
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 20,
  },
  horizontalLine: {
    width: '80%',
    height: 1,
    backgroundColor: 'white',
    marginBottom: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  button: {
    backgroundColor: '#059fa5',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 10,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
