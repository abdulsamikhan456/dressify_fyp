import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  Modal,
  ActivityIndicator,
  TextInput,
  Alert,
  Pressable,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  getFirestore,
  collection,
  query,
  where,
  getDocs,
  deleteDoc,
  addDoc,
  doc,
} from "firebase/firestore";
import { Entypo } from "@expo/vector-icons";
import { Ionicons } from "@expo/vector-icons";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { auth } from "../../firebase";
import { useStripe } from "@stripe/stripe-react-native";
import axios from "axios";

const db = getFirestore();

const CustomerOrdersScreen = ({ route }) => {
  const [orders, setOrders] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [feedbackModalVisible, setFeedbackModalVisible] = useState(false);
  const [feedbackShown, setFeedbackShown] = useState(false); // Track whether feedback modal has been shown
  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState("");
  const navigation = useNavigation();
  const [currentUserEmail, setCurrentUserEmail] = useState("");
  const [profilePicture, setProfilePicture] = useState(null);

  const { initPaymentSheet, presentPaymentSheet } = useStripe();
  const [additionalDetailsModalVisible, setAdditionalDetailsModalVisible] =
    useState(false);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const storedOrders = await AsyncStorage.getItem("orders");
        if (storedOrders) {
          setOrders(JSON.parse(storedOrders));
        }
      } catch (error) {
        console.error("Error fetching orders from AsyncStorage:", error);
      }
    };

    fetchOrders();

    if (orders.length > 0) {
      const orderNumber = orders[0].orderNumber;
      viewOrderDetails(orderNumber);
    }

    getCurrentUserEmail(); // Fetch profile picture when component mounts
  }, []);

  useEffect(() => {
    if (route?.params) {
      const newOrder = route.params;
      setOrders((prevOrders) => [...prevOrders, newOrder]);
    }
  }, [route.params]);

  const saveOrdersToStorage = async () => {
    try {
      await AsyncStorage.setItem("orders", JSON.stringify(orders));
    } catch (error) {
      console.error("Error saving orders to AsyncStorage:", error);
    }
  };

  useEffect(() => {
    saveOrdersToStorage();
  }, [orders]);

  const getCurrentUserEmail = async () => {
    try {
      const user = auth.currentUser;
      if (user) {
        const currentUserEmail = user.email;
        setCurrentUserEmail(currentUserEmail);

        // Find the user document in Firestore with the current user's email
        const userRef = collection(db, "users");
        const querySnapshot = await getDocs(userRef);

        for (const doc of querySnapshot.docs) {
          if (doc.data().email === currentUserEmail) {
            const customerDetailsRef = collection(
              doc.ref,
              "customerSignDetails"
            );
            const customerDetailsSnapshot = await getDocs(customerDetailsRef);
            if (!customerDetailsSnapshot.empty) {
              const profilePicture =
                customerDetailsSnapshot.docs[0].data().profilePicture;
              setProfilePicture(profilePicture);
              console.log("Profile picture:", profilePicture); // Log the profile picture
              break;
            }
          }
        }

        console.log("Current user email:", currentUserEmail);
      } else {
        console.log("No user signed in.");
      }
    } catch (error) {
      console.error("Error fetching current user email:", error);
    }
  };

  const viewOrderDetails = async (orderNumber) => {
    setLoading(true);
    try {
      const usersCollectionRef = collection(db, "users");
      const q = query(usersCollectionRef, where("role", "==", "Tailor"));
      const querySnapshot = await getDocs(q);
      let tailorFound = false;
  
      for (const doc of querySnapshot.docs) {
        const tailorUid = doc.id;
        const customerRequestsRef = collection(
          db,
          "users",
          tailorUid,
          "customerRequests"
        );
        const orderQuery = query(
          customerRequestsRef,
          where("orderNumber", "==", orderNumber)
        );
        const orderSnapshot = await getDocs(orderQuery);
  
        if (!orderSnapshot.empty) {
          const orderData = orderSnapshot.docs[0].data();
          console.log("Order data:", orderData);
          const updatedOrders = orders.map((order) => {
            if (order.orderNumber === orderNumber) {
              return {
                ...order,
                status: orderData.status,
                totalPrice: orderData.selectedPrice, // Adjusted to use selectedPrice as totalPrice
              };
            }
            return order;
          });
          setOrders(updatedOrders);
          setSelectedOrder(orderData);
  
          console.log("Total price:", orderData.selectedPrice); // Adjusted to use selectedPrice
  
          // Check if feedback has been submitted for this order
          const feedbackSubmitted = await AsyncStorage.getItem(
            `feedback_${orderNumber}`
          );
          const feedbackShown = await AsyncStorage.getItem(
            `feedback_shown_${orderNumber}`
          );
  
          if (
            orderData.status === "Completed" &&
            !feedbackSubmitted &&
            !feedbackShown
          ) {
            setModalVisible(false);
            setFeedbackModalVisible(true);
            await AsyncStorage.setItem(`feedback_shown_${orderNumber}`, "true");
          } else {
            setModalVisible(true);
          }
  
          tailorFound = true;
          break;
        }
      }
  
      if (!tailorFound) {
        console.log("Order not found.");
      }
    } catch (error) {
      console.error("Error fetching order details:", error);
    } finally {
      setLoading(false);
    }
  };
  

  const cancelOrder = async () => {
    try {
      if (!selectedOrder) {
        console.error("No order selected to cancel.");
        return;
      }

      const usersCollectionRef = collection(db, "users");
      const q = query(usersCollectionRef, where("role", "==", "Tailor"));
      const querySnapshot = await getDocs(q);

      for (const docSnap of querySnapshot.docs) {
        const tailorUid = docSnap.id;
        const customerRequestsRef = collection(
          db,
          "users",
          tailorUid,
          "customerRequests"
        );
        const orderQuery = query(
          customerRequestsRef,
          where("orderNumber", "==", selectedOrder.orderNumber)
        );
        const orderSnapshot = await getDocs(orderQuery);

        if (!orderSnapshot.empty) {
          orderSnapshot.forEach(async (doc) => {
            try {
              await deleteDoc(doc.ref);
              console.log("Order cancelled successfully.");
            } catch (error) {
              console.error("Error deleting order document:", error);
            }
          });
          break;
        }
      }

      setOrders((prevOrders) =>
        prevOrders.filter(
          (order) => order.orderNumber !== selectedOrder.orderNumber
        )
      );
      setModalVisible(false);
      Alert.alert("Success", "Order has been successfully cancelled.");
    } catch (error) {
      console.error("Error cancelling order:", error);
      Alert.alert("Error", "Failed to cancel order. Please try again.");
    }
  };

  const sendMessage = () => {
    if (
      !selectedOrder ||
      !selectedOrder.selectedTailorEmail ||
      !selectedOrder.orderNumber
    ) {
      console.error("No selected order or tailor email to send message.");
      return;
    }
    navigation.navigate("MsgsScreen", {
      tailorEmail: selectedOrder.selectedTailorEmail,
      orderNumber: selectedOrder.orderNumber,
    });
  };

  const sendDesigns = () => {
    if (
      !selectedOrder ||
      !selectedOrder.selectedTailorEmail ||
      !selectedOrder.orderNumber
    ) {
      console.error("No selected order or tailor email to send message.");
      return;
    }
    setModalVisible(false);

    // Navigate to the desired screen (replace "TargetScreen" with your screen's name)
    navigation.navigate("AdditionalDesigns", {
      tailorEmail: selectedOrder.selectedTailorEmail,
      orderNumber: selectedOrder.orderNumber,
    });
  };

  const closeModal = () => {
    setModalVisible(false);
    setSelectedOrder(null); // Reset selectedOrder state
  };

  const submitFeedback = async () => {
    // Submit feedback to backend or perform any necessary action
    console.log("Rating:", rating);
    console.log("Feedback:", feedback);

    // Close feedback modal
    setFeedbackModalVisible(false);

    // Check if selectedOrder and selectedTailorEmail are available
    if (!selectedOrder || !selectedOrder.selectedTailorEmail) {
      console.error("No selected order or tailor email to navigate.");
      return;
    }

    try {
      // Query the users collection to find the tailor document with the matching email
      const q = query(
        collection(db, "users"),
        where("email", "==", selectedOrder.selectedTailorEmail)
      );
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        // Get the first document found (assuming there's only one document per email)
        const tailorDoc = querySnapshot.docs[0];
        const tailorDocRef = doc(db, "users", tailorDoc.id);
        const ratingAndFeedbackCollectionRef = collection(
          tailorDocRef,
          "RatingAndFeedback"
        );

        // Store ratings and feedback under the subcollection
        await addDoc(ratingAndFeedbackCollectionRef, {
          rating: rating,
          feedback: feedback,
          customer: currentUserEmail,
          profile: profilePicture,
        });

        console.log("Rating and feedback submitted successfully.");
      } else {
        console.error("Tailor not found.");
      }
    } catch (error) {
      console.error("Error submitting rating and feedback:", error);
    }
  };

  // const handlePayment = async () => {
  //   try {
  //     if (!selectedOrder || !selectedOrder.submittedPrice) {
  //       console.error("No order or price to process payment.");
  //       return;
  //     }

  //     const clientSecret = await createPaymentIntent(selectedOrder.submittedPrice);

  //     const { error: initError } = await presentPaymentSheet({
  //       paymentIntentClientSecret: clientSecret,
  //       merchantDisplayName: 'Your App Name',
  //       customFlow: false,
  //       // Add additional options if needed
  //     });

  //     if (initError) {
  //       throw new Error('Failed to initialize Payment Sheet');
  //     }

  //     const { error: paymentError } = await presentPaymentSheet();

  //     if (paymentError) {
  //       throw new Error('Failed to process payment');
  //     }

  //     // Handle successful payment
  //     Alert.alert(
  //       'Payment Success',
  //       'Your payment was successful!',
  //       [
  //         {
  //           text: 'OK',
  //           onPress: () => {
  //             console.log('Payment successful');
  //             // Additional actions after payment success
  //           },
  //         },
  //       ],
  //       { cancelable: false }
  //     );
  //   } catch (error) {
  //     console.error('Error processing payment:', error);
  //     Alert.alert('Payment Error', 'Failed to process payment. Please try again.');
  //   }
  // };
  //   const handleOnlinePayment = () => {
  //     navigation.navigate("Stripes");
  // };

  // const onCheckout = async () => {
  //   // 1. Create a payment intent
  //   try {

  //     const response = await axios.post(
  //       "http://192.168.2.40:4000/payments/intent",
  //       {amount: 10000000},
  //       {
  //         headers: {
  //           'Content-Type': 'application/json',
  //         },
  //       },
  //     );
  //     console.log('payment repsonse is : ', response.data.paymentIntent);

  //   // 2. Initialize the Payment sheet

  //   console.log(response?.data?.paymentIntent);

  //   const { error: paymentSheetError } = await initPaymentSheet({
  //     merchantDisplayName: 'Example, Inc.',
  //     paymentIntentClientSecret: response?.data?.paymentIntent,
  //     defaultBillingDetails: {
  //       name: 'sami',
  //     },
  //   });
  //   console.log(" errrrooo : ", paymentSheetError)
  //   if (paymentSheetError) {
  //     console.log('Something went wrong', paymentSheetError.message);
  //     Alert.alert('Something went wrong', paymentSheetError.message);
  //     return;
  //   }

  //   // 3. Present the Payment Sheet from Stripe

  //   const { error: paymentError } = await presentPaymentSheet();

  //   console.log("payment error is : ", paymentError)

  // if (paymentError) {
  //   console.log("Error code: ${paymentError.code}", paymentError.message)
  //   Alert.alert("Error code: ${paymentError.code}", paymentError.message);
  //   return;
  // }
  // console.log("paymetn is seccessfully")

  // } catch (error) {
  // console.log('erro in payment is : ', error.response);
  // }

  //   };

  // const onCheckout = async () => {
  //   try {
  //     const response = await axios.post(
  //       "http://192.168.2.40:4000/payments/intent",
  //       { amount: 1000000 },
  //       {
  //         headers: {
  //           "Content-Type": "application/json",
  //         },
  //       }
  //     );

  //     console.log("Payment response:", response.data.paymentIntent);

  //     const { error: paymentSheetError } = await initPaymentSheet({
  //       merchantDisplayName: "Example, Inc.",
  //       paymentIntentClientSecret: response.data.paymentIntent,
  //       defaultBillingDetails: {
  //         name: "sami",
  //       },
  //     });

  //     if (paymentSheetError) {
  //       console.log(
  //         "Error initializing Payment Sheet:",
  //         paymentSheetError.message
  //       );
  //       Alert.alert("Something went wrong", paymentSheetError.message);
  //       return;
  //     }

  //     const { error: paymentError } = await presentPaymentSheet();

  //     if (paymentError) {
  //       console.log("Payment error:", paymentError.message);
  //       Alert.alert("Payment error", paymentError.message);
  //       return;
  //     }

  //     console.log("Payment successful");
  //   } catch (error) {
  //     console.log("Error in payment:", error);
  //   }
  // };

  // const onCheckout = async () => {
  //   try {
  //     const response = await axios.post(
  //       "http://192.168.2.40:4000/payments/intent",
  //       { amount: 100000 },
  //       {
  //         headers: {
  //           'Content-Type': 'application/json',
  //         },
  //       },
  //     );

  //     // Extract payment intent client secret from the response
  //     const paymentIntentClientSecret = response.data;

  //     console.log('Payment response:', paymentIntentClientSecret);

  //     const { error: paymentSheetError } = await initPaymentSheet({
  //       merchantDisplayName: 'Example, Inc.',
  //       paymentIntentClientSecret: paymentIntentClientSecret,
  //       defaultBillingDetails: {
  //         name: 'sami',
  //       },
  //     });

  //     if (paymentSheetError) {
  //       console.log('Error initializing Payment Sheet:', paymentSheetError.message);
  //       Alert.alert('Something went wrong', paymentSheetError.message);
  //       return;
  //     }

  //     const { error: paymentError } = await presentPaymentSheet();

  //     if (paymentError) {
  //       console.log('Payment error:', paymentError.message);
  //       Alert.alert('Payment error', paymentError.message);
  //       return;
  //     }

  //     console.log('Payment successful');

  //   } catch (error) {
  //     console.log('Error in payment:', error);
  //   }
  // };
  const toggleAdditionalDetailsModal = () => {
    setAdditionalDetailsModalVisible(!additionalDetailsModalVisible);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>All your Orders</Text>
      <Text style={styles.header1}>
        Status will be approved once Tailor accepts your request.
      </Text>

      {orders.length > 0 ? (
        orders.map((order, index) => (
          <TouchableOpacity
            key={index}
            style={styles.noticeBox}
            onPress={() => viewOrderDetails(order.orderNumber)}
          >
            <Text style={{ bottom: 10, left: 10, fontWeight: "350" }}>
              Status: {order.status}
            </Text>
            <Text
              style={[
                styles.orderStatus,
                {
                  backgroundColor:
                    order?.status === "Approved"
                      ? "green"
                      : order?.status === "Not Approved"
                      ? "red"
                      : order?.status
                      ? "orange"
                      : "grey",
                },
              ]}
            >
              {order?.status || "View Order"}
            </Text>
            <Text
              style={{
                bottom: 10,
                left: 10,
                fontWeight: "350",
                color: "black",
              }}
            >
              Order No: {order.orderNumber}
            </Text>
            <View style={styles.line}></View>
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={styles.button}
                onPress={() => viewOrderDetails(order.orderNumber)}
              >
                <Text style={styles.buttonText1}>View Order</Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        ))
      ) : (
        <Text style={styles.noOrdersMsg}>You have no Orders Now</Text>
      )}

      <View style={styles.extraSpace}></View>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={closeModal}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <TouchableOpacity style={styles.closeButton} onPress={closeModal}>
              <View style={styles.closeButtonCircle}>
                <Text style={styles.closeButtonText}>X</Text>
              </View>
            </TouchableOpacity>
            {loading ? (
              <ActivityIndicator size="large" color="#059FA5" />
            ) : (
              <View>
                <Text style={{ fontSize: 30, left: 15, bottom: 28 }}>
                  Order Details
                </Text>
                <Text style={{ fontWeight: "bold" }}>
                  Tailor Email: {selectedOrder?.selectedTailorEmail}
                </Text>
                <Text style={styles.modalText}>
                  Order Number: {selectedOrder?.orderNumber}
                </Text>
                <Text style={styles.modalText}>
                  Pickup Date: {selectedOrder?.selectedDate}
                </Text>
                <Text style={styles.modalText}>
                  Pickup Time Slot: {selectedOrder?.selectedTimeSlot}
                </Text>
                <Text style={styles.modalText}>
                  Pickup Address: {selectedOrder?.pickupAddress}
                </Text>
                <Text style={styles.modalText}>
                  Delivery Address: {selectedOrder?.deliveryAddress}
                </Text>
                <Text style={styles.modalText}>
                  Gender: {selectedOrder?.gender}
                </Text>
                <Text style={{ fontWeight: "bold" }}>
                  Status: {selectedOrder?.status}
                </Text>
                <Text style={{ fontWeight: "bold" }}>
                  Total Price: Rs {selectedOrder?.submittedPrice}
                </Text>

                <Pressable onPress={sendDesigns}>
                  <Text
                    style={{
                      left: 155,
                      color: "#059FA5",
                      fontWeight: "bold",
                      top: 10,
                    }}
                  >
                    Send Designs
                  </Text>
                </Pressable>

                {selectedOrder?.submittedPrice && (
                  <TouchableOpacity
                    onPress={() => navigation.navigate("Payment")}
                  >
                    <Text
                      style={{
                        color: "#059FA5",
                        fontWeight: "bold",
                        bottom: 10,
                      }}
                    >
                      Pay Now
                    </Text>
                  </TouchableOpacity>
                )}

                <TouchableOpacity
                  style={[styles.button, styles.additionalDetailsButton]}
                  onPress={toggleAdditionalDetailsModal}
                >
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <MaterialCommunityIcons
                      name="details"
                      size={24}
                      color="white"
                    />
                    <Text style={styles.buttonText}>Additional Details</Text>
                  </View>
                </TouchableOpacity>
                <Modal
        animationType="slide"
        transparent={true}
        visible={additionalDetailsModalVisible}
        onRequestClose={toggleAdditionalDetailsModal}
      >
        <View style={styles.centeredView}>
          <View style={styles.additionalDetailsModalView}>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={toggleAdditionalDetailsModal}
            >
              <View style={styles.closeButtonCircle}>
                <Text style={styles.closeButtonText}>X</Text>
              </View>
            </TouchableOpacity>
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
          </View>
        </View>
      </Modal>
                <TouchableOpacity
                  style={[styles.button, styles.cancelOrderButton]}
                  onPress={cancelOrder}
                >
                  <Text
                    style={{ left: 55, color: "white", fontWeight: "bold" }}
                  >
                    Cancel Order
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.button, styles.sendMessageButton]}
                  onPress={sendMessage}
                >
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <Ionicons
                      name="chatbubbles-outline"
                      size={24}
                      color="white"
                    />
                    <Text style={styles.buttonText}>Send a msg to Tailor</Text>
                  </View>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>
      </Modal>

      <Modal
        animationType="slide"
        transparent={true}
        visible={feedbackModalVisible}
        onRequestClose={() => setFeedbackModalVisible(false)}
      >
        <View style={styles.centeredView}>
          <View style={styles.feedbackModalView}>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setFeedbackModalVisible(false)}
            >
              <View style={styles.closeButtonCircle}>
                <Text style={styles.closeButtonText}>X</Text>
              </View>
            </TouchableOpacity>
            <Text style={{ fontSize: 20, right: 5, bottom: 28 }}>
              Rate and Provide Feedback
            </Text>
            <View style={styles.ratingContainer}>
              {[1, 2, 3, 4, 5].map((star) => (
                <TouchableOpacity
                  key={star}
                  style={styles.star}
                  onPress={() => setRating(star)}
                >
                  <Entypo
                    name={star <= rating ? "star" : "star-outlined"}
                    size={24}
                    color={star <= rating ? "#FFD700" : "#ccc"}
                  />
                </TouchableOpacity>
              ))}
            </View>
            <TextInput
              style={styles.feedbackInput}
              placeholder="Write your feedback here..."
              multiline
              value={feedback}
              onChangeText={setFeedback}
            />
            <TouchableOpacity
              style={styles.submitButton}
              onPress={submitFeedback}
            >
              <Text style={styles.submitButtonText}>Submit</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};

export default CustomerOrdersScreen;

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    paddingVertical: 20,
    paddingHorizontal: 10,
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
    left: 110,
    bottom: 15,
  },
  header1: {
    fontSize: 13,
    fontWeight: "400",
    marginBottom: 20,
    left: 10,
    bottom: 10,
  },
  noOrdersMsg: {
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
  noticeBox: {
    marginBottom: 20,
    padding: 20,
    backgroundColor: "#ffffff",
    borderRadius: 15,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 3,
    shadowRadius: 10,
    elevation: 30,
    shadowColor: "#059fa5",
  },
  line: {
    borderBottomColor: "#D1D1D1",
    borderBottomWidth: 1,
    marginBottom: 10,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    bottom: 10,
  },
  button: {
    padding: 10,
    backgroundColor: "#059FA5",
    borderRadius: 5,
    marginBottom: 15,
    top: 20,
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
    left: 15,
  },
  buttonText1: {
    color: "white",
    fontWeight: "bold",
  },
  additionalDetailsButton: {
    backgroundColor: "#059FA5",
  },
  cancelOrderButton: {
    backgroundColor: "red",
  },
  sendMessageButton: {
    backgroundColor: "#059FA5",
  },
  extraSpace: {
    height: 80,
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  feedbackModalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  closeButton: {
    position: "absolute",
    top: 10,
    right: 5,
    padding: 5,
  },
  closeButtonCircle: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: "#FFF",
    justifyContent: "center",
    alignItems: "center",
  },
  closeButtonText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "black",
  },
  orderStatus: {
    position: "absolute",
    top: 10,
    right: 10,
    padding: 5,
    borderRadius: 5,
    color: "white",
    fontWeight: "600",
    borderWidth: 1,
    borderColor: "grey",
  },
  ratingContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginVertical: 20,
  },
  star: {
    marginHorizontal: 5,
  },
  feedbackInput: {
    width: "100%",
    height: 100,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    marginBottom: 20,
  },
  submitButton: {
    backgroundColor: "#059FA5",
    padding: 10,
    borderRadius: 5,
  },
  submitButtonText: {
    color: "white",
    fontWeight: "bold",
  },
  additionalDetailsModalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 45,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
});
