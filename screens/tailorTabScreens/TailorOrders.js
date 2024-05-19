import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { useNavigation } from "@react-navigation/native"; // Import navigation hook
import { auth } from "../../firebase";
import { db } from "../../firebase";
import { collection, getDocs } from "firebase/firestore";

const TailorOrders = () => {
  const [searchInput, setSearchInput] = useState("");
  const [orders, setOrders] = useState([]);
  const [tailorEmail, setTailorEmail] = useState(""); // State variable to store tailorEmail
  const [loading, setLoading] = useState(true); // State variable to track loading state
  const navigation = useNavigation(); // Initialize navigation hook

  const getCurrentUserEmail = async () => {
    try {
      if (auth.currentUser) {
        const email = auth.currentUser.email;
        console.log("Tailor email:", email);
        setTailorEmail(email); // Set the tailorEmail in state

        const userRef = collection(db, "users");
        const querySnapshot = await getDocs(userRef);

        let foundTailor = false;

        for (const doc of querySnapshot.docs) {
          if (doc.data().email === email && doc.data().role === "Tailor") {
            foundTailor = true;
            console.log("User found as Tailor.");
            const customerRequestsRef = collection(doc.ref, "customerRequests");
            const customerRequestsSnapshot = await getDocs(customerRequestsRef);
            
            if (!customerRequestsSnapshot.empty) {
              console.log("Orders found in customerRequests collection.");
              const ordersData = customerRequestsSnapshot.docs.map((doc) => {
                const orderData = doc.data();
                // Set status to Pending if empty
                if (!orderData.status) {
                  orderData.status = "Under Review";
                }
                return orderData;
              });
              setOrders(ordersData);
            } else {
              console.log("No orders found in customerRequests collection.");
            }
            break;
          }
        }

        if (!foundTailor) {
          console.log("User not found as Tailor or no user signed in.");
        }
      } else {
        console.log("No user signed in.");
      }
    } catch (error) {
      console.error("Error fetching tailor email:", error);
    } finally {
      setLoading(false); // Set loading to false after fetching orders
    }
  };

  // Function to handle the back button press
  const handleBackPress = () => {
    navigation.goBack();
  };

  // Function to handle search input change
  const handleSearchInputChange = (text) => {
    setSearchInput(text);
    // Additional logic for search if needed
  };

  // Function to navigate based on order status
  const navigateToScreen = (status) => {
    if (status ===  "Under Review") {
      navigation.navigate("NewOrdersRequest", { tailorEmail });
    } else if (status === "Pending") {
      navigation.navigate("PendingOrders", { tailorEmail });
    } else if (status === "Completed") {
      navigation.navigate("CompletedOrders", { tailorEmail });
    }
  };

  useEffect(() => {
    getCurrentUserEmail();
  }, []);

  // Filter orders based on search input
  const filteredOrders = orders.filter((order) =>
    order.orderNumber.toString().includes(searchInput)
  );

  // Separate the highlighted order from the rest
  const highlightedOrder = filteredOrders.find(
    (order) => order.orderNumber.toString() === searchInput
  );
  const restOfOrders = filteredOrders.filter(
    (order) => order.orderNumber.toString() !== searchInput
  );

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <TouchableOpacity
          style={styles.leftArrowContainer}
          onPress={handleBackPress}
        ></TouchableOpacity>
        <Text style={styles.headerText}>Your Orders</Text>
        <Text style={styles.header}>All your Orders.</Text>
        <Text style={styles.header1}>
          All your Orders will be shown here.
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

      {/* Display orders in notice boxes */}
      {loading ? (
        <ActivityIndicator size="large" color="#059fa5" />
      ) : (
        <ScrollView>
          {highlightedOrder && (
            <TouchableOpacity
              style={[styles.noticeBox, styles.highlightedNoticeBox]}
              onPress={() => navigateToScreen(highlightedOrder.status)}
            >
              <Text style={styles.noticeText}>
                Order Number: {highlightedOrder.orderNumber}
              </Text>
              <Text style={styles.noticeText}>
                Status: {highlightedOrder.status}
              </Text>
            </TouchableOpacity>
          )}
          {restOfOrders.map((order, index) => (
            <TouchableOpacity
              key={index} // Use index as key since we don't have unique IDs for orders
              style={styles.noticeBox}
              onPress={() => navigateToScreen(order.status)} // Navigate based on order status
            >
              <Text style={styles.noticeText}>
                Order Number: {order.orderNumber}
              </Text>
              <View style={styles.horizontalLine} />
              <Text style={styles.noticeText}>Status: {order.status}</Text>
            </TouchableOpacity>
          ))}
          {/* Render message if no orders are found */}
          {orders.length === 0 && (
            <Text style={styles.noOrdersText}>You have still No Orders</Text>
          )}
        </ScrollView>
      )}
    </View>
  );
};

export default TailorOrders;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: "black",
    paddingHorizontal: 10,
    paddingTop: 20,
  },
  headerContainer: {
    marginBottom: 20,
  },
  headerText: {
    fontSize: 18,
    fontWeight: "bold",
    alignSelf: "center",
    bottom: 10,
  },
  header: {
    fontSize: 15,
    fontWeight: "bold",
    marginBottom: 10,
    alignSelf: "center",
    right: 123,
  },
  header1: {
    fontSize: 13,
    fontWeight: "400",
    marginBottom: 20,
    alignSelf: "center",
    right: 75,
  },
  leftArrowContainer: {
    position: "absolute",
    left: 10,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    borderRadius: 10,
    borderWidth: 0.5,
  },
  searchInput: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 10,
  },
  noticeContainer: {
    flex: 1,
  },
  noticeBox: {
    backgroundColor: "#059fa5",
    borderRadius: 10,
    padding: 20,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  highlightedNoticeBox: {
    backgroundColor: "#ADD8E6", // Light blue color for highlighting
  },
  noticeText: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 10,
    color: 'white'
  },
  horizontalLine: {
    borderBottomColor: "#D1D1D1",
    borderBottomWidth: 1,
    marginBottom: 10,
  },
  noOrdersText: {
    alignSelf: "center",
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 20,
  },
});
