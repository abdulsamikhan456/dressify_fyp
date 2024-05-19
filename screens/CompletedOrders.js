import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  ActivityIndicator,
  TextInput,
} from "react-native";
import { AntDesign } from "@expo/vector-icons";
import {
  getFirestore,
  collection,
  query,
  where,
  getDocs,
  updateDoc,
} from "firebase/firestore";

const CompletedOrders = ({ isVisible, onRequestClose, route, navigation }) => {
  const { tailorEmail } = route.params;
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [selectedOrderDetails, setSelectedOrderDetails] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [additionalDetailsModalVisible, setAdditionalDetailsModalVisible] =
    useState(false);
  const [showDropdown, setShowDropdown] = useState({});
  const [status, setStatus] = useState({});
  const [searchInput, setSearchInput] = useState("");
  const [highlightedIndex, setHighlightedIndex] = useState(-1);

  useEffect(() => {
    const fetchOrders = async () => {
      const firestore = getFirestore();
      try {
        const usersCollectionRef = collection(firestore, "users");
        const q = query(
          usersCollectionRef,
          where("email", "==", tailorEmail),
          where("role", "==", "Tailor")
        );
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
          console.log("Email matches with tailorEmail and role is Tailor.");
          const tailorDoc = querySnapshot.docs[0];
          const customerRequestsRef = collection(
            tailorDoc.ref,
            "customerRequests"
          );
          const customerRequestsSnapshot = await getDocs(customerRequestsRef);

          if (!customerRequestsSnapshot.empty) {
            console.log("Orders found for this tailor email.");
            const ordersData = customerRequestsSnapshot.docs.map((doc) =>
              doc.data()
            );
            const completedOrders = ordersData.filter(
              (order) => order.status === "Completed"
            );
            setOrders(completedOrders);
            // Initialize status and showDropdown states for each order
            const initialStatus = {};
            const initialShowDropdown = {};
            completedOrders.forEach((order) => {
              initialStatus[order.orderNumber] = "Completed";
              initialShowDropdown[order.orderNumber] = false;
            });
            setStatus(initialStatus);
            setShowDropdown(initialShowDropdown);
          } else {
            console.log("No orders found for this tailor email.");
          }
        } else {
          console.log("No user found with this email or role is not Tailor.");
        }
      } catch (error) {
        console.error("Error fetching order details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [tailorEmail]);

  // Function to open the modal and display order details
  const openModal = (orderNumber) => {
    // Find the order with the matching orderNumber
    const selectedOrder = orders.find(
      (order) => order.orderNumber === orderNumber
    );
    if (selectedOrder) {
      setSelectedOrder(selectedOrder);
      setSelectedOrderDetails(selectedOrder.additionalDetails); // Assuming additional details are stored in the `additionalDetails` field of the order object
      setModalVisible(true);
    } else {
      console.error(`Order with orderNumber ${orderNumber} not found.`);
    }
  };

  // Function to close the modal
  const closeModal = () => {
    setModalVisible(false);
  };

  // Function to toggle the additional details modal
  const toggleAdditionalDetailsModal = () => {
    setAdditionalDetailsModalVisible(!additionalDetailsModalVisible);
  };

  // Function to handle the back button press
  const handleBackPress = () => {
    navigation.goBack();
  };

  // Function to handle search input change
  const handleSearchInputChange = (text) => {
    setSearchInput(text);
    const foundIndex = orders.findIndex(
      (order) => order.orderNumber === parseInt(text)
    );
    setHighlightedIndex(foundIndex);
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <TouchableOpacity
          style={styles.leftArrowContainer}
          onPress={handleBackPress}
        >
          <AntDesign name="leftcircleo" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.headerText}>Completed Orders</Text>
        <Text style={styles.header}>All your Completed Orders here.</Text>
        <Text style={styles.header1}>
          All your Orders that has been completed displayed here.
        </Text>

        {/* Search bar */}
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Enter Order Number"
            onChangeText={handleSearchInputChange}
            value={searchInput}
            keyboardType="numeric"
          />
        </View>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <View>
          {/* Display the highlighted order at the top */}
          {highlightedIndex !== -1 && (
            <TouchableOpacity
              style={[
                styles.noticeBox,
                highlightedIndex > 0 && styles.noticeBoxWithMargin,
                styles.highlightedNoticeBox,
              ]}
              onPress={() =>
                openModal(orders[highlightedIndex].orderNumber)
              }
            >
              <Text style={styles.noticeText}>
                Order Status: Completed
              </Text>
              <Text style={styles.noticeText}>
                Order Number: {orders[highlightedIndex].orderNumber}
              </Text>
              <View style={styles.line}></View>
              <TouchableOpacity
                style={styles.viewDetailsButton}
                onPress={() =>
                  openModal(orders[highlightedIndex].orderNumber)
                }
              >
                <Text style={styles.viewDetailsButtonText}>
                  View Order Details
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.informCustomerButton}
                onPress={() =>
                  setShowDropdown((prevShowDropdown) => ({
                    ...prevShowDropdown,
                    [orders[highlightedIndex].orderNumber]:
                      !prevShowDropdown[orders[highlightedIndex].orderNumber],
                  }))
                }
              >
                <Text style={styles.informCustomerButtonText}>
                  Inform the Customer
                </Text>
                <AntDesign
                  name={
                    showDropdown[orders[highlightedIndex].orderNumber]
                      ? "up"
                      : "down"
                  }
                  size={20}
                  color="white"
                />
              </TouchableOpacity>
              {showDropdown[orders[highlightedIndex].orderNumber] && (
                <View style={styles.dropdown}>
                  <TouchableOpacity
                    style={styles.dropdownOption}
                    onPress={() =>
                      handleStatusSelect(
                        orders[highlightedIndex].orderNumber,
                        "Completed"
                      )
                    }
                  >
                    <Text style={styles.dropdownOptionText}>Completed</Text>
                  </TouchableOpacity>
                </View>
              )}
            </TouchableOpacity>
          )}

          {/* Display other orders */}
          {orders.map((order, index) => (
            index !== highlightedIndex && (
              <View key={index}>
                <TouchableOpacity
                  style={[
                    styles.noticeBox,
                    index > 0 && styles.noticeBoxWithMargin,
                  ]}
                  key={index}
                  onPress={() => openModal(order)}
                >
                  <Text style={styles.noticeText}>
                    Order Status: Completed
                  </Text>
                  <Text style={styles.noticeText}>
                    Order Number: {order.orderNumber}
                  </Text>
                  <View style={styles.line}></View>
                  <TouchableOpacity
                    style={styles.viewDetailsButton}
                    onPress={() => openModal(order.orderNumber)}
                  >
                    <Text style={styles.viewDetailsButtonText}>
                      View Order Details
                    </Text>
                  </TouchableOpacity>
                  
                    
                  </TouchableOpacity>
                  {/* {showDropdown[order.orderNumber] && (
                   
                  )} */}
                {/* </TouchableOpacity> */}
              </View>
            )
          ))}
        </View>
      )}

      {/* Modal for displaying order details */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={onRequestClose}
      >
        {/* Modal content */}
      </Modal>

      {/* Additional Details Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={additionalDetailsModalVisible}
        onRequestClose={toggleAdditionalDetailsModal}
      >
        {/* Modal content */}
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    paddingVertical: 20,
    paddingHorizontal: 10,
    backgroundColor: "#eeeee4",
  },
  header: {
    fontSize: 15,
    fontWeight: "bold",
    marginBottom: 10,
    left: 15,
  },
  header1: {
    fontSize: 13,
    fontWeight: "400",
    marginBottom: 20,
    left: 15,
  },
  leftArrowContainer: {
    left: 15,
  },
  headerText: {
    fontSize: 18,
    fontWeight: "bold",
    left: 125,
    bottom: 22,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    
  },
  searchInput: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 10,
    
  },
  noticeBox: {
    padding: 20,
    backgroundColor: "#ffffff",
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    bottom: -10, // Add margin between notice boxes
  },
  noticeBoxWithMargin: {
    marginTop: 20, // Add margin at the top for all but the first notice box
  },
  highlightedNoticeBox: {
    borderColor: "yellow",
    borderWidth: 2,
    bottom:20
  },
  noticeText: {
    marginBottom: 10,
    fontWeight: "bold",
  },
  line: {
    borderBottomColor: "#D1D1D1",
    borderBottomWidth: 1,
    marginBottom: 10,
  },
  viewDetailsButton: {
    backgroundColor: "#059FA5",
    borderRadius: 5,
    padding: 10,
    alignItems: "center",
    marginTop: 10,
  },
  viewDetailsButtonText: {
    color: "white",
    fontWeight: "bold",
  },
  informCustomerButton: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 10,
    backgroundColor: "#059FA5",
    borderRadius: 5,
    marginBottom: 15,
    top: 10,
  },
  informCustomerButtonText: {
    color: "white",
    fontWeight: "bold",
  },
  dropdown: {
    backgroundColor: "#fff",
    borderRadius: 5,
    padding: 10,
    marginTop: 5,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  dropdownOption: {
    padding: 10,
  },
  dropdownOptionText: {
    color: "black",
    fontWeight: "bold",
  },
  // Modal styles
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  orderDetailsContainer: {
    backgroundColor: "#ffffff",
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
    width: "80%",
  },
  orderText: {
    marginBottom: 10,
    fontWeight: "bold",
  },
  closeButton: {
    position: "absolute",
    top: 20,
    right: 20,
  },

  additionalDetailsButton: {
    backgroundColor: "#059FA5",
    borderRadius: 5,
    padding: 10,
    alignItems: "center",
    marginTop: 10,
  },
  additionalDetailsButtonText: {
    color: "white",
    fontWeight: "bold",
  },
});

export default CompletedOrders;
