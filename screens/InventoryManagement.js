import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, FlatList, TouchableOpacity, Modal, TextInput, Button } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';

const initialInventoryData = [
  {
    id: '1',
    name: 'Cotton Fabric',
    quantity: 20,
    price: 15,
    description: 'High quality cotton fabric',
    icon: 'shirt-outline',
  },
  {
    id: '2',
    name: 'Silk Thread',
    quantity: 50,
    price: 5,
    description: 'Smooth silk thread',
    icon: 'color-wand-outline',
  },
];

const InventoryManagement = () => {
  const navigation = useNavigation();
  const route = useRoute();
  
    const { userEmail } = route.params;

    console.log("User Email:", userEmail);

  const [inventoryData, setInventoryData] = useState(route.params?.inventoryData || initialInventoryData);
  const [modalVisible, setModalVisible] = useState(false);
  const [newItemData, setNewItemData] = useState({
    name: '',
    quantity: '',
    price: '',
    description: '',
    icon: 'cube-outline', // Default icon
  });
  const [editItemData, setEditItemData] = useState({
    id: '',
    name: '',
    quantity: '',
    price: '',
    description: '',
    icon: '', // Add icon field
  });

  useEffect(() => {
    if (route.params?.newItem) {
      const newItem = route.params.newItem;
      setInventoryData(prevData => [...prevData, newItem]);
    } else if (route.params?.updatedItem) {
      const updatedItem = route.params.updatedItem;
      setInventoryData(prevData =>
        prevData.map(item => (item.id === updatedItem.id ? updatedItem : item))
      );
    }
  }, [route.params]);

  const toggleModal = () => {
    setModalVisible(!modalVisible);
  };

  const handleAddItem = () => {
    const newItem = {
      id: String(Date.now()), // Generate unique ID
      ...newItemData,
    };
    setInventoryData(prevData => [...prevData, newItem]);
    setModalVisible(false);
    // Reset newItemData for next addition
    setNewItemData({
      name: '',
      quantity: '',
      price: '',
      description: '',
      icon: 'cube-outline',
    });
  };

  const handleEditItem = () => {
    const updatedItem = {
      id: editItemData.id,
      name: editItemData.name,
      quantity: parseInt(editItemData.quantity), // Parse quantity to integer
      price: parseFloat(editItemData.price), // Parse price to float
      description: editItemData.description,
      icon: editItemData.icon, // Include icon field in updated item
    };
    setInventoryData(prevData =>
      prevData.map(item => (item.id === updatedItem.id ? updatedItem : item))
    );
    setModalVisible(false);
    // Reset editItemData for next edit
    setEditItemData({
      id: '',
      name: '',
      quantity: '',
      price: '',
      description: '',
      icon: '',
    });
  };

  const renderItem = ({ item }) => (
    <View style={styles.itemContainer}>
      <Ionicons name={item.icon} size={50} color="black" style={styles.itemIcon} />
      <View style={styles.itemDetails}>
        <Text style={styles.itemName}>{item.name}</Text>
        <Text style={styles.itemQuantity}>Quantity: {item.quantity}</Text>
        <Text style={styles.itemPrice}>Price:Rs {item.price}</Text>
      </View>
      <TouchableOpacity
        onPress={() => {
          setEditItemData(item);
          setModalVisible(true);
        }}
      >
        <Ionicons name="pencil" size={24} color="black" style={styles.icon} />
      </TouchableOpacity>
      <TouchableOpacity onPress={() => {/* Handle delete action */}}>
        <Ionicons name="trash" size={24} color="black" style={styles.icon} />
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.headerText}>Inventory Management</Text>
      </View>
      <FlatList
        data={inventoryData}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.list}
      />
      <TouchableOpacity
        style={styles.addButton}
        onPress={toggleModal} // Open modal on button press
      >
        <Ionicons name="add" size={30} color="white" style={{right: 12}}/>
        <Text style={styles.addButtonText}>Add Item</Text>
      </TouchableOpacity>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={toggleModal} // Close modal on Android back button press
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            {editItemData.id ? (
              <>
                <Text style={styles.modalTitle}>Edit Item</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Name"
                  value={editItemData.name}
                  onChangeText={text => setEditItemData({...editItemData, name: text})}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Quantity"
                  value={String(editItemData.quantity)} // Convert quantity to string
                  onChangeText={text => setEditItemData({...editItemData, quantity: text})}
                  keyboardType="numeric"
                />
                <TextInput
                  style={styles.input}
                  placeholder="Price"
                  value={String(editItemData.price)} // Convert price to string
                  onChangeText={text => setEditItemData({...editItemData, price: text})}
                  keyboardType="numeric"
                />
                <TextInput
                  style={styles.input}
                  placeholder="Description"
                  value={editItemData.description}
                  onChangeText={text => setEditItemData({...editItemData, description: text})}
                />
                <Button title="Save" onPress={handleEditItem} />
              </>
            ) : (
              <>
                <Text style={styles.modalTitle}>Add New Item</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Name"
                  value={newItemData.name}
                  onChangeText={text => setNewItemData({...newItemData, name: text})}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Quantity"
                  value={newItemData.quantity}
                  onChangeText={text => setNewItemData({...newItemData, quantity: text})}
                  keyboardType="numeric"
                />
                <TextInput
                  style={styles.input}
                  placeholder="Price"
                  value={newItemData.price}
                  onChangeText={text => setNewItemData({...newItemData, price: text})}
                  keyboardType="numeric"
                />
                <TextInput
                  style={styles.input}
                  placeholder="Description"
                  value={newItemData.description}
                  onChangeText={text => setNewItemData
                    ({...newItemData, description: text})}
                    /><Button title="Add Now" onPress={handleAddItem} />
                    </>
                  )}
                </View>
              </View>
            </Modal>
          </View>
        );
      };
      
      export default InventoryManagement;
      
      const styles = StyleSheet.create({
        container: {
          flex: 1,
          backgroundColor: '#fff',
        },
        header: {
          flexDirection: 'row',
          alignItems: 'center',
          backgroundColor: '#f9f9f9',
          paddingVertical: 20,
          paddingHorizontal: 16,
          borderBottomWidth: 1,
          borderBottomColor: '#ddd',
          top: 10,
        },
        headerText: {
          fontSize: 18,
          fontWeight: 'bold',
          marginLeft: 16,
          left: 55
        },
        list: {
          flexGrow: 1,
        },
        itemContainer: {
          flexDirection: 'row',
          alignItems: 'center',
          padding: 16,
          marginVertical: 12,
          marginHorizontal: 8,
          borderWidth: 3,
          borderColor: '#059fa5',
          borderRadius: 15,
          backgroundColor: '#f9f9f9',
        },
        itemIcon: {
          marginRight: 16,
        },
        itemDetails: {
          flex: 1,
        },
        itemName: {
          fontSize: 18,
          fontWeight: 'bold',
        },
        itemQuantity: {
          fontSize: 14,
          color: '#888',
        },
        itemPrice: {
          fontSize: 14,
          color: '#888',
        },
        icon: {
          marginHorizontal: 8,
        },
        addButton: {
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#059fa5',
          padding: 25,
          borderRadius: 30,
          marginTop: 12,
          bottom: 5
        },
        addButtonText: {
          color: '#fff',
          fontSize: 20 ,
          fontWeight: 'bold',
          marginLeft: 8,
          right: 12
        },
        modalContainer: {
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
           // Semi-transparent black background
        
        },
        modalContent: {
          backgroundColor: '#fff',
          padding: 20,
          borderRadius: 10,
          elevation: 5, // Android elevation
        },
        modalTitle: {
          fontSize: 20,
          fontWeight: 'bold',
          marginBottom: 10,
        },
        input: {
          height: 40,
          borderColor: 'gray',
          borderWidth: 1,
          paddingHorizontal: 8,
          marginBottom: 10,
        },
      });