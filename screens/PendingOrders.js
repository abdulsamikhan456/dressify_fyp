import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  ActivityIndicator,
  ScrollView
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

const PendingOrders = ({ isVisible, onRequestClose, route, navigation }) => {
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
            const approvedOrders = ordersData.filter(
              (order) => order.status === "Approved"
            );
            setOrders(approvedOrders);
            // Initialize status and showDropdown states for each order
            const initialStatus = {};
            const initialShowDropdown = {};
            approvedOrders.forEach((order) => {
              initialStatus[order.orderNumber] = null;
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

  const handleStatusSelect = async (orderNumber, selectedStatus) => {
    try {
      const firestore = getFirestore();
      const tailorCollectionRef = collection(firestore, "users");
      const q = query(
        tailorCollectionRef,
        where("email", "==", tailorEmail),
        where("role", "==", "Tailor")
      );
      const tailorSnapshot = await getDocs(q);
  
      if (!tailorSnapshot.empty) {
        console.log("Email matches with tailorEmail and role is Tailor.");
        const tailorDoc = tailorSnapshot.docs[0];
        const customerRequestsRef = collection(
          tailorDoc.ref,
          "customerRequests"
        );
        const q2 = query(
          customerRequestsRef,
          where("orderNumber", "==", orderNumber)
        );
        const customerRequestsSnapshot = await getDocs(q2);
  
        if (!customerRequestsSnapshot.empty) {
          const doc = customerRequestsSnapshot.docs[0];
          await updateDoc(doc.ref, { status: selectedStatus });
          if (selectedStatus === "Completed") {
            // Add workingStatus field in the document
            await updateDoc(doc.ref, { workingStatus: "Notified" });
            // Remove the order from the list
            setOrders((prevOrders) =>
              prevOrders.filter((order) => order.orderNumber !== orderNumber)
            );
            // Display alert message
            alert("We notified the Customer for their Order.");
          }
          console.log("Status updated successfully.");
        } else {
          console.log("No order found with the given order number.");
        }
      } else {
        console.log("No user found with this email or role is not Tailor.");
      }
    } catch (error) {
      console.error("Error updating status:", error);
    }
    // Update status and close dropdown for the selected order
    setStatus((prevStatus) => ({
      ...prevStatus,
      [orderNumber]: selectedStatus,
    }));
    setShowDropdown((prevShowDropdown) => ({
      ...prevShowDropdown,
      [orderNumber]: false,
    }));
  };
  
  
  

  return (
    <ScrollView>
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <TouchableOpacity
          style={styles.leftArrowContainer}
          onPress={handleBackPress}
        >
          <AntDesign name="leftcircleo" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.headerText}>Pending Orders</Text>
        <Text style={styles.header}>All your Pending Orders here.</Text>
        <Text style={styles.header1}>
          Must Inform the Customer once you completed the order.
        </Text>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <View>
          {orders.map((order, index) => (
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
                  Order Status: {order.status}
                </Text>
                <Text style={styles.noticeText}>
                  Order Number: {order.orderNumber}
                </Text>
                <Text style={styles.orderText1}>
                {" "}
                Total Price: {order?.submittedPrice}{" "}
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
                <TouchableOpacity
                  style={styles.informCustomerButton}
                  onPress={() =>
                    setShowDropdown((prevShowDropdown) => ({
                      ...prevShowDropdown,
                      [order.orderNumber]: !prevShowDropdown[order.orderNumber],
                    }))
                  }
                >
                  <Text style={styles.informCustomerButtonText}>
                    Inform the Customer
                  </Text>
                  <AntDesign
                    name={showDropdown[order.orderNumber] ? "up" : "down"}
                    size={20}
                    color="white"
                  />
                </TouchableOpacity>
                {showDropdown[order.orderNumber] && (
                  <View style={styles.dropdown}>
                    <TouchableOpacity
                      style={styles.dropdownOption}
                      onPress={() =>
                        handleStatusSelect(order.orderNumber, "Completed")
                      }
                    >
                      <Text style={styles.dropdownOptionText}>Completed</Text>
                    </TouchableOpacity>
                  </View>
                )}
              </TouchableOpacity>
            </View>
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
        <View style={styles.modalContainer}>
          {selectedOrder && (
            <View style={styles.orderDetailsContainer}>
              <Text style={{ fontSize: 20, fontWeight: "bold", bottom: 10 }}>
                Order Details
              </Text>
              <Text style={styles.orderText}>
                Order Number: {selectedOrder.orderNumber}
              </Text>
              <Text style={styles.orderText}>
                {" "}
                Pickup Date: {selectedOrder?.selectedDate}{" "}
              </Text>
              <Text style={styles.orderText}>
                {" "}
                Pickup Time Slot: {selectedOrder?.selectedTimeSlot}{" "}
              </Text>
              <Text style={styles.orderText}>
                {" "}
                Pickup Address: {selectedOrder?.pickupAddress}{" "}
              </Text>
              <Text style={styles.orderText}>
                {" "}
                Delivery Address: {selectedOrder?.deliveryAddress}{" "}
              </Text>
              <Text style={styles.orderText}>
                {" "}
                Gender: {selectedOrder?.gender}{" "}
              </Text>
              <Text style={styles.orderText}>
                {" "}
                Total Price: {selectedOrder?.selectedPrice}{" "}
              </Text>

              {/* Add more order details as needed */}

              {/* Button to view additional details */}
              <TouchableOpacity
                style={styles.additionalDetailsButton}
                onPress={toggleAdditionalDetailsModal}
              >
                <Text style={styles.additionalDetailsButtonText}>
                  View Additional Details
                </Text>
              </TouchableOpacity>
            </View>
          )}

          {/* Button to close the modal */}
          <TouchableOpacity style={styles.closeButton} onPress={closeModal}>
            <AntDesign name="closecircle" size={24} color="black" />
          </TouchableOpacity>
        </View>
      </Modal>

      {/* Additional Details Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={additionalDetailsModalVisible}
        onRequestClose={toggleAdditionalDetailsModal}
      >
        <View style={styles.modalContainer}>
          <View style={styles.orderDetailsContainer}>
            <Text
              style={{ fontSize: 20, marginBottom: 10, fontWeight: "bold" }}
            >
              Additional Details
            </Text>

            <Text style={styles.orderText}>
              {" "}
              neckLength: {selectedOrder?.neckLength}{" "}
            </Text>
            <Text style={styles.orderText}>
              {" "}
              totalHeight: {selectedOrder?.totalHeight}{" "}
            </Text>
            <Text style={styles.orderText}>
              {" "}
              chest: {selectedOrder?.chest}{" "}
            </Text>
            <Text style={styles.orderText}>
              {" "}
              waist: {selectedOrder?.waist}{" "}
            </Text>
            <Text style={styles.orderText}>
              {" "}
              shoulder: {selectedOrder?.chest}{" "}
            </Text>
            <Text style={styles.orderText}>
              {" "}
              armLength: {selectedOrder?.armLength}{" "}
            </Text>
            <Text style={styles.orderText}>
              {" "}
              inseam: {selectedOrder?.inseam}{" "}
            </Text>
            <Text style={styles.orderText}> hip: {selectedOrder?.hip} </Text>
            <Text style={styles.orderText}> seat: {selectedOrder?.seat} </Text>
            <Text style={styles.orderText}>
              {" "}
              biceps: {selectedOrder?.biceps}{" "}
            </Text>
            <Text style={styles.orderText}>
              {" "}
              wrist: {selectedOrder?.wrist}{" "}
            </Text>
            <Text style={styles.orderText}>
              {" "}
              thigh: {selectedOrder?.thigh}{" "}
            </Text>

            {selectedOrderDetails &&
              Object.entries(selectedOrderDetails).map(([key, value]) => (
                <Text key={key} style={styles.orderText}>
                  {key}: {value}
                </Text>
              ))}
          </View>

          {/* Button to close the modal */}
          <TouchableOpacity
            style={styles.closeButton}
            onPress={toggleAdditionalDetailsModal}
          >
            <AntDesign name="closecircle" size={24} color="black" />
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
    </ScrollView>
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
    left: 145,
    bottom: 22,
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
  orderText1: {
    marginBottom: 10,
    fontWeight: "bold",
    right: 3
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

export default PendingOrders;
