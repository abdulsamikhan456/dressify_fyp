import React, { useEffect, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import {
  View,
  Text,
  TouchableOpacity,
  Pressable,
  StyleSheet,
  ScrollView,
  TextInput,
  Modal,
} from "react-native";
import { db } from "../firebase";
import { collection, getDocs, where, query ,deleteDoc} from "firebase/firestore";

const TailorDetails = () => {
  const navigation = useNavigation();
  const [tailors, setTailors] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedTailor, setSelectedTailor] = useState(null);
  const [selectedTailorOrders, setSelectedTailorOrders] = useState([]);
  const [highlightedOrder, setHighlightedOrder] = useState(null);
  const [orderDetailsModalVisible, setOrderDetailsModalVisible] =
    useState(false);
  const [selectedOrderDetails, setSelectedOrderDetails] = useState(null);

  useEffect(() => {
    fetchTailors();
  }, []);

  const fetchTailors = async () => {
    try {
      const q = query(collection(db, "users"), where("role", "==", "Tailor"));
      const querySnapshot = await getDocs(q);
      const tailorData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setTailors(tailorData);
    } catch (error) {
      console.error("Error fetching tailors:", error);
    }
  };

  const fetchTailorOrders = async (email) => {
    try {
      console.log("Tailor email:", email);

      const q = query(
        collection(db, "users"),
        where("email", "==", email),
        where("role", "==", "Tailor")
      );

      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        console.log("Email matched with a Tailor's email.");

        // Get the first document as there should be only one tailor with the given email
        const tailorDoc = querySnapshot.docs[0];

        // Check if the subcollection 'customerRequests' exists
        const customerRequestsRef = collection(
          tailorDoc.ref,
          "customerRequests"
        );
        const customerRequestsSnapshot = await getDocs(customerRequestsRef);

        if (!customerRequestsSnapshot.empty) {
          console.log("Customer Requests collection exists.");

          // Fetch orders from the subcollection
          const orders = customerRequestsSnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));

          console.log("Fetched orders:", orders);
          return orders;
        } else {
          console.log("No orders found for the tailor.");
          return [];
        }
      } else {
        console.log("No Tailor found with the provided email.");
        return [];
      }
    } catch (error) {
      console.error("Error fetching tailor orders:", error);
      return [];
    }
  };

  // Function to handle when an order is pressed
  const handleCancelOrder = async () => {
    try {
      console.log("Attempting to cancel order with orderId:", selectedOrderDetails.orderNumber);
  
      if (!selectedOrderDetails) {
        console.error("No order selected to cancel.");
        return;
      }
  
      console.log("Selected tailor email:", selectedOrderDetails.selectedTailorEmail);
  
      const usersCollectionRef = collection(db, "users");
      const q = query(usersCollectionRef, where("email", "==", selectedOrderDetails.selectedTailorEmail), where("role", "==", "Tailor"));
      const querySnapshot = await getDocs(q);
  
      if (!querySnapshot.empty) {
        console.log("Tailor found with the provided email.");
  
        // Get the first document as there should be only one tailor with the given email
        const tailorDoc = querySnapshot.docs[0];
  
        console.log("Searching for order in customerRequests collection...");
  
        // Check if the subcollection 'customerRequests' exists
        const customerRequestsRef = collection(tailorDoc.ref, "customerRequests");
        const orderQuery = query(customerRequestsRef, where("orderNumber", "==", selectedOrderDetails.orderNumber));
        const orderSnapshot = await getDocs(orderQuery);
  
        if (!orderSnapshot.empty) {
          console.log("Order found in the customerRequests collection.");
          orderSnapshot.forEach(async (doc) => {
            try {
              await deleteDoc(doc.ref);
              console.log("Order canceled successfully.");
              setOrderDetailsModalVisible(false);
            } catch (error) {
              console.error("Error deleting order document:", error);
            }
          });
        } else {
          console.log("Order not found in the customerRequests collection.");
        }
      } else {
        console.log("No Tailor found with the provided email.");
      }
    } catch (error) {
      console.error("Error canceling order:", error);
    }
  };

  const handleOrderPress = (orderNumber) => {
    const selectedOrder = selectedTailorOrders.find(order => order.orderNumber === orderNumber);
    setSelectedOrderDetails(selectedOrder);
    setOrderDetailsModalVisible(true);
  };
  
  
  
  
  
  

  return (
    <ScrollView style={{ flex: 1, backgroundColor: "black" }}>
      <View
        style={{
          justifyContent: "center",
          alignItems: "center",
          marginTop: 20,
        }}
      >
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={{ position: "absolute", top: 5, left: 20 }}
        >
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>

        <View style={styles.headerContainer}>
          <Text style={styles.heading}>Tailor Details</Text>
          <Text style={styles.description}>
            All Tailor details will be shown here.
          </Text>
        </View>

        <View style={styles.line}></View>

        <TextInput
          style={styles.searchInput}
          placeholder="Enter tailor username"
          value={searchQuery}
          onChangeText={(text) => setSearchQuery(text)}
        />

        {tailors.map((tailor) => (
          <Pressable
            key={tailor.id}
            onPress={async () => {
              setSelectedTailor(tailor);
              setModalVisible(true);
              const orders = await fetchTailorOrders(tailor.email);
              setSelectedTailorOrders(orders);
            }}
            style={[
              styles.customerContainer,
              selectedTailor &&
                selectedTailor.id === tailor.id &&
                styles.highlightedContainer,
            ]}
          >
            <View style={styles.customerDetails}>
              <Text style={styles.customerName}>{tailor.username}</Text>
              <Text style={styles.customerEmail}>{tailor.email}</Text>
            </View>
          </Pressable>
        ))}

        <Modal
          visible={modalVisible}
          animationType="slide"
          transparent={true}
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={modalStyles.modalContainer}>
            <Text style={modalStyles.modalHeading}>Selected Tailor</Text>
            {selectedTailor ? (
              <View>
                <Text style={modalStyles.modalText}>
                  All details about the Tailor
                </Text>
                <Text style={modalStyles.modalText1}>
                  Tailor Orders Details:
                </Text>
                <View style={modalStyles.searchBarContainer}>
                  <TextInput
                    style={modalStyles.searchInput}
                    placeholder="Enter order ID"
                    value={searchQuery}
                    onChangeText={(text) => handleOrderPress(text)}
                  />
                  <TouchableOpacity onPress={() => handleOrderPress("")}>
                    <Ionicons
                      name="close-circle-outline"
                      size={24}
                      color="black"
                    />
                  </TouchableOpacity>
                </View>
                <View style={modalStyles.customerContainer}>
                  <Text style={modalStyles.columnHeading}>Order ID</Text>
                  <Text style={modalStyles.columnHeading}>Order Status</Text>
                </View>
                {selectedTailorOrders.map((order, index) => (
                  <Pressable
                    key={order.id}
                    onPress={() => handleOrderPress(order.orderNumber)}
                    style={[
                      modalStyles.customerContainer1,
                      highlightedOrder &&
                        highlightedOrder.id === order.id &&
                        modalStyles.highlightedOrderContainer,
                    ]}
                  >
                    <Text>{order.orderNumber}</Text>
                    <Text>{order.status || "Under review"}</Text>
                  </Pressable>
                ))}
              </View>
            ) : (
              <Text>No tailor selected.</Text>
            )}
            <Pressable
              onPress={() => setModalVisible(false)}
              style={modalStyles.closeButton}
            >
              <Text style={modalStyles.closeButtonText}>Close</Text>
            </Pressable>
          </View>
        </Modal>

        <Modal
          visible={orderDetailsModalVisible}
          animationType="slide"
          transparent={true}
          onRequestClose={() => setOrderDetailsModalVisible(false)}
        >
          <View style={modalStyles.modalContainer}>
  <Text style={modalStyles.modalHeading}>Order Details</Text>
  {selectedOrderDetails ? (
    <View style={modalStyles.orderDetailsContainer}>
      <Text>Order Number: {selectedOrderDetails.orderNumber}</Text>
      <Text>Status: {selectedOrderDetails.status}</Text>
      <Text>Gender: {selectedOrderDetails.gender}</Text>
      <Text>Delivery Address: {selectedOrderDetails.deliveryAddress}</Text>
      <Text>Pickup Address: {selectedOrderDetails.pickupAddress}</Text>
      <Text>Time Slot: {selectedOrderDetails.selectedTimeSlot}</Text>
      <Text>SelectedTailor: {selectedOrderDetails.selectedTailorEmail}</Text>
      <Text>Order Date: {selectedOrderDetails.selectedDate}</Text>
      {/* Display other order details here */}
    </View>
  ) : (
    <Text>No order details available.</Text>
  )}
  <Pressable
    onPress={() => handleCancelOrder(selectedOrderDetails.id)}
    style={[modalStyles.closeButton, { backgroundColor: "red", bottom: 110, right: 75 }]}
  >
    <Text style={modalStyles.closeButtonText}>Cancel Order</Text>
  </Pressable>
  <Pressable
    onPress={() => setOrderDetailsModalVisible(false)}
    style={modalStyles.closeButton}
  >
    <Text style={modalStyles.closeButtonText}>Close</Text>
  </Pressable>
</View>

        </Modal>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  heading: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
  },
  description: {
    fontSize: 16,
    color: "white",
    marginTop: 5,
  },
  line: {
    borderBottomWidth: 1,
    borderBottomColor: "white",
    width: "90%",
    marginBottom: 20,
  },
  searchInput: {
    width: "90%",
    borderWidth: 1,
    borderColor: "white",
    borderRadius: 20,
    padding: 10,
    marginBottom: 20,
    color: "black",
    backgroundColor: "white",
  },
  customerContainer: {
    width: "90%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "white",
    borderRadius: 10,
    marginBottom: 10,
    padding: 10,
  },
  highlightedContainer: {
    borderColor: "yellow",
    borderWidth: 2,
  },
  customerDetails: {},
  customerName: {
    fontSize: 18,
    color: "white",
  },
  customerEmail: {
    fontSize: 14,
    color: "white",
  },
});

const modalStyles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
  },
  modalHeading: {
    fontSize: 24,
    fontWeight: "bold",
    color: "black",
    bottom: 230,
    marginTop: 60,
  },
  modalText: {
    fontSize: 18,
    color: "black",
    bottom: 230,
    left: 75,
  },
  modalText1: {
    fontSize: 18,
    color: "black",
    bottom: 200,
    left: 5,
    fontWeight: "bold",
  },
  customerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "black",
    borderRadius: 10,
    marginBottom: 10,
    padding: 10,
    bottom: 180,
    width: "68%",
    left: 7,
  },
  customerContainer1: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "black",
    borderRadius: 10,
    marginBottom: 10,
    padding: 10,
    bottom: 180,
    width: "63%",
    left: 5,
  },
  line: {
    borderBottomWidth: 1,
    borderBottomColor: "black",
    width: "90%",
  },
  columnHeading: {
    fontSize: 16,
    color: "black",
    fontWeight: "bold",
  },
  deleteColumn: {
    alignItems: "center",
  },
  closeButton: {
    backgroundColor: "black",
    padding: 10,
    borderRadius: 5,
    marginTop: 20,
  },
  closeButtonText: {
    fontSize: 16,
    color: "white",
    fontWeight: "bold",
  },
  searchBarContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 10,
    marginBottom: 10,
    backgroundColor: "white",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "black",
    width: "92%",
    bottom: 180,
    left: 5,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 10,
  },
  highlightedOrderContainer: {
    backgroundColor: "yellow",
  },

  orderDetailsContainer: {
    backgroundColor: "lightgrey",
    padding: 10,
    borderRadius: 5,
    marginBottom: -30,
    bottom: 150,
  },
});

export default TailorDetails;
