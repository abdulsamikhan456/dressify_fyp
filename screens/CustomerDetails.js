import { View, Text, TouchableOpacity, Pressable, StyleSheet, ScrollView, TextInput, Modal } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { db } from '../firebase'; // Import your firebase configuration
import { collection, getDocs } from 'firebase/firestore'; // Import firestore methods

const CustomerDetails = () => {
  const navigation = useNavigation();
  const [customers, setCustomers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const usersSnapshot = await getDocs(collection(db, 'users'));
        const fetchedCustomers = usersSnapshot.docs
          .filter(doc => doc.data().role === 'Customer')
          .map(doc => ({ id: doc.id, ...doc.data() }));
        setCustomers(fetchedCustomers);
      } catch (error) {
        console.error('Error fetching customers:', error);
      }
    };

    fetchCustomers();
  }, []);

  const handleCustomerPress = customer => {
    setSelectedCustomer(customer);
    setModalVisible(true);
  };

  const filteredCustomers = customers.filter(customer =>
    customer.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const deleteCustomer = async () => {
    try {
      const querySnapshot = await db.collection('users').where('email', '==', selectedCustomer.email).get();
      if (querySnapshot.empty) {
        console.log('No matching documents.');
        return;
      }
      // Assuming there's only one document with the matching email
      const docSnapshot = querySnapshot.docs[0];
      await db.collection('users').doc(docSnapshot.id).delete();
      setModalVisible(false);
      // Optionally, you can refresh the customer list after deletion
      // or perform any other necessary actions.
    } catch (error) {
      console.error('Error deleting customer:', error);
    }
  };
  
  
  

  return (
    <ScrollView style={{ flex: 1, backgroundColor: 'black' }}>
      <View style={{ justifyContent: 'center', alignItems: 'center', marginTop: 20 }}>
        {/* Header and back button */}
        <TouchableOpacity onPress={() => navigation.goBack()} style={{ position: 'absolute', top: 5, left: 20 }}>
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        
        {/* Header text */}
        <View style={styles.headerContainer}>
          <Text style={styles.heading}>Customer Details</Text>
          <Text style={styles.description}>All customer details will be shown here.</Text>
        </View>
        
        {/* Separator line */}
        <View style={styles.line}></View>

        {/* Search bar */}
        <TextInput
          style={styles.searchInput}
          placeholder="Enter customer username"
          value={searchQuery}
          onChangeText={text => setSearchQuery(text)}
        />

        {/* Customer containers */}
        {filteredCustomers.map((customer, index) => (
          <Pressable
            key={customer.id}
            style={[styles.customerContainer, searchQuery && customer.username.toLowerCase() === searchQuery.toLowerCase() && styles.highlightedContainer]}
            onPress={() => handleCustomerPress(customer)}
          >
            <View style={styles.customerDetails}>
              <Text style={styles.customerName}>{customer.username}</Text>
              <Text style={styles.customerEmail}>{customer.email}</Text>
            </View>
          </Pressable>
        ))}

        {/* Modal for displaying customer details */}
        <Modal
  animationType="slide"
  transparent={true}
  visible={modalVisible}
  onRequestClose={() => setModalVisible(false)}
>
  <View style={styles.modalContainer}>
    <Text style={styles.modalHeading}>Customer Details</Text>
    <Text style={[styles.modalText, { color: 'black' }]}>Username: {selectedCustomer?.username}</Text>
    <Text style={[styles.modalText, { color: 'black' }]}>Email: {selectedCustomer?.email}</Text>
    <Text style={[styles.modalText, { color: 'black' }]}>Phone: {selectedCustomer?.phoneNumber}</Text>
    <View style={styles.buttonContainer}>
      <TouchableOpacity  style={[styles.modalButton, { backgroundColor: '#059fa5' }]}>
        <Text style={styles.buttonText}>View Orders</Text>
      </TouchableOpacity>
      <TouchableOpacity  style={[styles.modalButton, { backgroundColor: '#059fa5' }]}>
        <Text style={styles.buttonText}>Personal Info</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={deleteCustomer} style={[styles.modalButton, { backgroundColor: 'red' }]}>
        <Text style={styles.buttonText}>Delete Customer</Text>
      </TouchableOpacity>
    </View>
    <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.closeButton}>
      <Text style={styles.closeButtonText}>Close</Text>
    </TouchableOpacity>
  </View>
</Modal>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    alignItems: 'center',
    marginBottom: 20
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  description: {
    fontSize: 16,
    color: 'white',
    marginTop: 5,
  },
  line: {
    borderBottomWidth: 1,
    borderBottomColor: 'white',
    width: '90%',
    marginBottom: 20,
  },
  searchInput: {
    width: '90%',
    borderWidth: 1,
    borderColor: 'white',
    borderRadius: 20,
    padding: 10,
    marginBottom: 20,
    color: 'black',
    backgroundColor: 'white'
  },
  customerContainer: {
    width: '90%',
    borderWidth: 1,
    borderColor: 'white',
    borderRadius: 10,
    marginBottom: 10,
  },
  highlightedContainer: {
    borderColor: 'yellow',
    borderWidth: 2,
  },
  customerDetails: {
    padding: 10,
  },
  customerName: {
    fontSize: 18,
    color: 'white',
  },
  customerEmail: {
    fontSize: 14,
    color: 'white',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white', 
    // Set background color to white
  },
  modalHeading: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'black',
   bottom: 200
  },
  modalText: {
    fontSize: 18,
   bottom: 200,
  },
  closeButton: {
    backgroundColor: 'black',
    padding: 10,
    borderRadius: 5,
    marginTop: 20,
    width:'30%'
    
  },
  closeButtonText: {
    fontSize: 16,
    color: 'white',
    fontWeight: 'bold',
    left: 28
   
  },
  buttonContainer: {
    marginTop: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '90%',
  },
  modalButton: {
    width: '30%',
    padding: 15,
    alignItems: 'center',
    borderRadius: 10,
    bottom: 90
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default CustomerDetails;
