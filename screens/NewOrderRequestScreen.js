import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  ActivityIndicator,
  Alert,
  ScrollView,
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
  deleteDoc,
} from "firebase/firestore";

const NewOrderRequestScreen = ({ route, navigation }) => {
  const { tailorEmail } = route.params;
  const [status, setStatus] = useState({});
  const [showDropdown, setShowDropdown] = useState({});
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [selectedOrderDetails, setSelectedOrderDetails] = useState(null);
  const [selectedOrderMessages, setSelectedOrderMessages] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const scrollViewRef = useRef(null);
  const [additionalDetailsModalVisible, setAdditionalDetailsModalVisible] =
    useState(false);
  const [ordersWithNewMessages, setOrdersWithNewMessages] = useState([]);
  const [priceInput, setPriceInput] = useState("");
  const [submittedPrice, setSubmittedPrice] = useState("");
  const [confirmClear, setConfirmClear] = useState(false);
  const [confirmClearModalVisible, setConfirmClearModalVisible] =
    useState(false);

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
            // Initialize submittedPrice for each order to empty string
            const ordersWithSubmittedPrice = ordersData.map((order) => ({
              ...order,
              submittedPrice: "",
            }));
            setOrders(ordersWithSubmittedPrice);
            const initialStatus = {};
            const initialShowDropdown = {};
            ordersData.forEach((order) => {
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

  const clearAllOrders = async () => {
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
        const customerRequestsSnapshot = await getDocs(customerRequestsRef);

        // Delete all orders associated with the tailorEmail
        customerRequestsSnapshot.forEach(async (doc) => {
          await deleteDoc(doc.ref);
        });

        // Clear orders from the state
        setOrders([]);
        setStatus({});
        setShowDropdown({});
      } else {
        console.log("No user found with this email or role is not Tailor.");
      }
    } catch (error) {
      console.error("Error clearing orders:", error);
    }
  };

  const fetchMessagesForOrder = async (orderNumber) => {
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
          const messagesRef = collection(doc.ref, "Messages");
          const messagesSnapshot = await getDocs(messagesRef);

          if (!messagesSnapshot.empty) {
            const messagesData = messagesSnapshot.docs.map((doc) => doc.data());
            setSelectedOrderMessages(messagesData);
            setOrdersWithNewMessages((prevOrders) => [
              ...prevOrders,
              orderNumber,
            ]);
          } else {
            setSelectedOrderMessages([]);
          }
        } else {
          console.log("No order found with the given order number.");
        }
      } else {
        console.log("No user found with this email or role is not Tailor.");
      }
    } catch (error) {
      console.error("Error fetching messages:", error);
      setSelectedOrderMessages([]);
    }
  };

  const handleStatusSelect = async (
    orderNumber,
    selectedStatus,
    submittedPrice
  ) => {
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
          if (selectedStatus === "Approved") {
            // Log the submitted price before update
            console.log("Submitted price before update:", submittedPrice);

            // Update the status and store the selected price
            await updateDoc(doc.ref, {
              status: selectedStatus,
              submittedPrice: priceInput, // Use the priceInput state here
            });
            console.log("Status and price updated successfully.");

            Alert.alert(
              "Order Approved",
              "The order has been shifted to the Pending Orders section.",
              [{ text: "OK", onPress: () => console.log("OK Pressed") }],
              { cancelable: false }
            );
          } else {
            // Only update the status if not approved
            await updateDoc(doc.ref, { status: selectedStatus });
            console.log("Status updated successfully.");
          }
        } else {
          console.log("No order found with the given order number.");
        }
      } else {
        console.log("No user found with this email or role is not Tailor.");
      }
    } catch (error) {
      console.error("Error updating status:", error);
    }
    setStatus((prevStatus) => ({
      ...prevStatus,
      [orderNumber]: selectedStatus,
    }));
    setShowDropdown((prevShowDropdown) => ({
      ...prevShowDropdown,
      [orderNumber]: false,
    }));
  };

  const closeModal = () => {
    setModalVisible(false);
  };

  const openModal = async (order) => {
    setSelectedOrder(order);
    setSelectedOrderDetails(order.additionalDetails);
    fetchMessagesForOrder(order.orderNumber);
    setModalVisible(true);
  };

  const toggleAdditionalDetailsModal = () => {
    setAdditionalDetailsModalVisible(!additionalDetailsModalVisible);
  };

  const handleBackPress = () => {
    navigation.goBack();
  };

  const calculateScrollViewMinHeight = () => {
    if (scrollViewRef.current) {
      let totalHeight = 0;
      orders
        .filter((order) => order.status !== "Approved")
        .forEach((order) => {
          totalHeight += styles.noticeBox.marginBottom;
        });
      return totalHeight;
    }
    return 0;
  };

  const orderHasMessages = (orderNumber) => {
    return selectedOrderMessages.some(
      (message) => message.orderNumber === orderNumber
    );
  };

  const navigateToMsgsScreen = (orderNumber) => {
    if (ordersWithNewMessages.includes(orderNumber)) {
      navigation.navigate("TailorMsgsScreen", { orderNumber, tailorEmail });
      setOrdersWithNewMessages((prevOrders) =>
        prevOrders.filter((order) => order !== orderNumber)
      );
    }
  };

  const handleSubmitPrice = async (orderNumber) => {
    if (priceInput.trim() !== "") {
      console.log("Price input before update:", priceInput);
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
            // Update the submittedPrice field in the document
            await updateDoc(doc.ref, { submittedPrice: priceInput });
            console.log("Price updated successfully.");
            // Update submittedPrice in the state for the corresponding order
            const updatedOrders = orders.map((order) => {
              if (order.orderNumber === orderNumber) {
                return {
                  ...order,
                  submittedPrice: priceInput,
                };
              }
              return order;
            });
            setOrders(updatedOrders);
          } else {
            console.log("No order found with the given order number.");
          }
        } else {
          console.log("No user found with this email or role is not Tailor.");
        }
      } catch (error) {
        console.error("Error updating price:", error);
      }
    }
  };

  const handleChangePrice = () => {
    setSubmittedPrice("");
    setPriceInput("");
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.headerContainer}>
        <TouchableOpacity
          style={styles.leftArrowContainer}
          onPress={handleBackPress}
        >
          <AntDesign name="leftcircleo" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.headerText}>New Orders</Text>
        <TouchableOpacity onPress={() => setConfirmClearModalVisible(true)}>
          <Text style={styles.clearOrders}>...</Text>
        </TouchableOpacity>
        <Text style={styles.header}>New Order Requests</Text>
        <Text style={styles.header1}>
          All new Order Requests will be shown here.
        </Text>
      </View>
      {/* Clear All Orders Confirmation Modal */}
      {confirmClearModalVisible && (
        <Modal
          animationType="slide"
          transparent={true}
          visible={confirmClearModalVisible}
          onRequestClose={() => setConfirmClearModalVisible(false)}
        >
          <View
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
              backgroundColor: "rgba(0,0,0,0.5)",
            }}
          >
            <View
              style={{
                backgroundColor: "#fff",
                borderRadius: 10,
                padding: 20,
                width: "80%",
              }}
            >
              <Text
                style={{
                  fontSize: 18,
                  fontWeight: "bold",
                  marginBottom: 20,
                  textAlign: "center",
                }}
              >
                Are you sure you want to clear all orders?
              </Text>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                <TouchableOpacity
                  style={{
                    paddingHorizontal: 20,
                    paddingVertical: 10,
                    borderRadius: 5,
                    backgroundColor: "#ff4d4d",
                  }}
                  onPress={() => setConfirmClearModalVisible(false)}
                >
                  <Text
                    style={{
                      color: "#fff",
                      fontSize: 16,
                      fontWeight: "bold",
                      textAlign: "center",
                    }}
                  >
                    Cancel
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={{
                    paddingHorizontal: 20,
                    paddingVertical: 10,
                    borderRadius: 5,
                    backgroundColor: "#4CAF50",
                  }}
                  onPress={() => {
                    clearAllOrders();
                    setConfirmClearModalVisible(false);
                  }}
                >
                  <Text
                    style={{
                      color: "#fff",
                      fontSize: 16,
                      fontWeight: "bold",
                      textAlign: "center",
                    }}
                  >
                    Clear All
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      )}

      <View style={{ minHeight: calculateScrollViewMinHeight() }}>
        {loading ? (
          <ActivityIndicator size="large" color="#0000ff" />
        ) : (
          <View>
            {orders
              .filter((order) => order.status !== "Approved")
              .map((order, index) => (
                <TouchableOpacity
                  style={[
                    styles.noticeBox,
                    index > 0 && styles.noticeBoxWithMargin,
                  ]}
                  key={index}
                  onPress={() => openModal(order)}
                >
                  {ordersWithNewMessages.includes(order.orderNumber) && (
                    <TouchableOpacity
                      onPress={() => navigateToMsgsScreen(order.orderNumber)}
                    >
                      <View style={styles.newMessagesButtonContainer}>
                        <Text style={styles.newMessagesButtonText}>
                          You have new messages
                        </Text>
                      </View>
                    </TouchableOpacity>
                  )}
                  <View style={styles.bellIconContainer}>
                    <AntDesign
                      name="bells"
                      size={24}
                      color={
                        orderHasMessages(order.orderNumber) ? "red" : "black"
                      }
                    />
                  </View>
                  <View style={styles.noticeContent}>
                    <Text style={styles.noticeText}>
                      Order Number: {order.orderNumber}
                    </Text>
                    <Text style={styles.noticeText}>
                      Order Date: {order.orderDate}
                    </Text>
                    <Text style={styles.submittedPrice}>
                      {order.submittedPrice
                        ? `Submitted Price: Rs ${order.submittedPrice}`
                        : ""}
                    </Text>
                  </View>
                  <View style={styles.line}></View>
                  <TouchableOpacity
                    style={styles.button}
                    onPress={() =>
                      setShowDropdown((prevShowDropdown) => ({
                        ...prevShowDropdown,
                        [order.orderNumber]:
                          !prevShowDropdown[order.orderNumber],
                      }))
                    }
                  >
                    <Text style={styles.buttonText}>
                      {status[order.orderNumber] || "Select Status"}
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
                          handleStatusSelect(order.orderNumber, "Approved")
                        }
                      >
                        <Text style={styles.dropdownOptionText}>Approved</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={styles.dropdownOption}
                        onPress={() =>
                          handleStatusSelect(order.orderNumber, "Not Approved")
                        }
                      >
                        <Text style={styles.dropdownOptionText}>
                          Not Approved
                        </Text>
                      </TouchableOpacity>
                    </View>
                  )}
                  <TouchableOpacity
                    style={styles.viewDetailsButton}
                    onPress={() => setModalVisible(true)}
                  >
                    <Text style={styles.viewDetailsButtonText}>
                      View Order Details
                    </Text>
                  </TouchableOpacity>
                </TouchableOpacity>
              ))}
          </View>
        )}
      </View>

      <Modal animationType="slide" transparent={true} visible={modalVisible}>
        <View style={styles.modalContainer}>
          {selectedOrder && (
            <View style={styles.orderDetailsContainer}>
              <Text
                style={{ fontSize: 20, fontWeight: "bold", marginBottom: 10 }}
              >
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

              {submittedPrice ? (
                <Text style={styles.submittedPrice1}>
                  Total Price: {priceInput}
                </Text>
              ) : null}

              <View style={styles.inputContainer}>
                <TextInput
                  placeholder="Enter Price"
                  style={styles.priceInput}
                  value={priceInput}
                  onChangeText={setPriceInput}
                />
                {submittedPrice ? (
                  <TouchableOpacity
                    style={styles.submitButton}
                    onPress={handleChangePrice}
                  >
                    <Text style={styles.submitButtonText}>Change Price</Text>
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity
                    style={styles.submitButton}
                    onPress={() =>
                      handleSubmitPrice(selectedOrder?.orderNumber)
                    }
                  >
                    <Text style={styles.submitButtonText}>Submit</Text>
                  </TouchableOpacity>
                )}
              </View>

              <TouchableOpacity
                style={styles.additionalDetailsButton}
                onPress={toggleAdditionalDetailsModal}
              >
                <Text style={styles.additionalDetailsButtonText}>
                  View Additional Detail
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.additionalDetailsButton}
                onPress={() => {
                  navigation.navigate("DesignsScreen", {
                    orderNumber: selectedOrder?.orderNumber,
                    tailorEmail: tailorEmail,
                  });
                }}
              >
                <Text style={styles.additionalDetailsButtonText}>
                  View Additional Designs
                </Text>
              </TouchableOpacity>
            </View>
          )}

          <TouchableOpacity style={styles.closeButton} onPress={closeModal}>
            <AntDesign name="closecircle" size={24} color="black" />
          </TouchableOpacity>
        </View>
      </Modal>

      <Modal
        animationType="slide"
        transparent={true}
        visible={additionalDetailsModalVisible}
      >
        <View style={styles.modalContainer}>
          <View style={styles.orderDetailsContainer}>
            <Text
              style={{ fontSize: 20, marginBottom: 10, fontWeight: "bold" }}
            >
              Additional Details
            </Text>

            <Text style={{ fontSize: 20, right: 5, bottom: 28 }}>
              Order Details
            </Text>
            <Text style={styles.modalText}>
              Gender: {selectedOrder?.gender}
            </Text>
            <Text style={styles.modalText}>
            heightInches: {selectedOrder?.heightInches}
            </Text>
            <Text style={styles.modalText}>
            heightFeet: {selectedOrder?.heightFeet}
            </Text>
            <Text style={styles.modalText}>kameezOffKneesLength: {selectedOrder?.kameezOffKneesLength}</Text>
            <Text style={styles.modalText}>kameezOnKneesLength: {selectedOrder?.kameezOnKneesLength}</Text>
            <Text style={styles.modalText}>
            paichaCircumference: {selectedOrder?.paichaCircumference}
            </Text>
            <Text style={styles.modalText}>
            shalwarLength: {selectedOrder?.shalwarLength}
            </Text>
            
            <Text style={styles.modalText}>damanCircumference: {selectedOrder?.damanCircumference}</Text>
            <Text style={styles.modalText}>
            cuffCircumference: {selectedOrder?.cuffCircumference}
            </Text>
            <Text style={styles.modalText}>chestCircumference: {selectedOrder?.chestCircumference}</Text>
            <Text style={styles.modalText}>armholeCircumference: {selectedOrder?.armholeCircumference}</Text>

            <TouchableOpacity
              style={styles.closeButton}
              onPress={toggleAdditionalDetailsModal}
            >
              <AntDesign name="  closecircle" size={24} color="black" />
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#eeeee4",
    paddingVertical: 20,
    paddingHorizontal: 10,
  },
  leftArrowContainer: {
    left: 10,
  },
  clearOrders: {
    fontSize: 30,
    fontWeight: "bold",
    left: 330,
    bottom: 60,
  },
  clearOrders1: {
    fontSize: 13,

    left: 260,
    bottom: 30,
  },

  header: {
    fontSize: 15,
    fontWeight: "bold",
    bottom: 40,
    left: 15,
  },
  header1: {
    fontSize: 13,
    fontWeight: "400",
    bottom: 30,
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
    shadowRadius: 3.84,
    elevation: 5,
    marginBottom: 20,
  },
  noticeBoxWithMargin: {
    marginBottom: 10,
  },
  bellIconContainer: {
    position: "absolute",
    top: 12,
    right: 20,
    zIndex: 1,
  },
  newMessagesButtonContainer: {
    backgroundColor: "red",
    padding: 5,
    borderRadius: 5,
    bottom: 10,
  },
  newMessagesButtonText: {
    color: "white",
    fontWeight: "bold",
  },
  noticeContent: {
    marginBottom: 10,
  },
  line: {
    borderBottomColor: "#dcdcdc",
    borderBottomWidth: 1,
    marginVertical: 10,
  },
  button: {
    backgroundColor: "#059FA5",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  buttonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "bold",
  },
  dropdown: {
    backgroundColor: "#ffffff",
    padding: 10,
    borderRadius: 5,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  dropdownOption: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#dcdcdc",
  },
  dropdownOptionText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#037ffc",
  },
  viewDetailsButton: {
    backgroundColor: "#059FA5",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginBottom: 10,
  },
  viewDetailsButtonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  orderDetailsContainer: {
    backgroundColor: "#ffffff",
    padding: 20,
    borderRadius: 10,
    width: "90%",
    position: "relative",
  },
  orderText: {
    fontSize: 16,
    marginBottom: 5,
  },
  closeButton: {
    position: "absolute",
    top: 10,
    right: 10,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  priceInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    paddingHorizontal: 10,
    marginRight: 10,
  },
  submitButton: {
    backgroundColor: "#059FA5",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  submitButtonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "bold",
  },
  additionalDetailsButton: {
    backgroundColor: "#059FA5",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginTop: 10,
  },
  additionalDetailsButtonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
  submittedPrice: {
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 5,
    left: 0,
    top: 5,
  },
  submittedPrice1: {
    fontSize: 20,
    fontWeight: "bold",
    bottom: 4,
    left: 5,
  },
});

export default NewOrderRequestScreen;
