import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { StyleSheet, Text, View } from "react-native";
import { AntDesign } from "@expo/vector-icons";
import { MaterialIcons } from "@expo/vector-icons";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import TailorHomeScreen from "../screens/tailorTabScreens/TailorHomeScreen";
import TailorOrders from "../screens/tailorTabScreens/TailorOrders";
import AddDesigns from "../screens/tailorTabScreens/AddDesigns";
import TailorAcccount from "../screens/tailorTabScreens/TailorAcccount";
import { useUser } from "../UserContext"; // Update the path

const Tab = createBottomTabNavigator();

const TailorTabs = () => {
  const { uid } = useUser();

  return (
    <Tab.Navigator
      screenOptions={{
        tabBarShowLabel: false,
        tabBarStyle: {
          position: "absolute",
          bottom: 25,
          left: 20,
          right: 20,
          elevation: 0,
          backgroundColor: "#ffffff",
          borderRadius: 15,
          height: 90,
          ...styles.shadow,
        },
      }}
    >
      <Tab.Screen
        name="TailorHome"
        options={{
          tabBarIcon: ({ focused }) => (
            <View>
              <AntDesign
                name="home"
                size={24}
                color={focused ? "#e32f45" : "#748c94"}
                style={{ width: 25, height: 25, left: 3 }}
              />
              <Text
                style={{
                  color: focused ? "#e32f45" : "#748c94",
                  fontSize: 12,
                  fontWeight: "bold",
                }}
              >
                Home
              </Text>
            </View>
          ),
        }}
      >
        {() => <TailorHomeScreen uid={uid} />}
        {/* Pass uid to TailorHomeScreen */}
      </Tab.Screen>
      <Tab.Screen
        name="TailorOrders"
        component={TailorOrders}
        options={{
          tabBarIcon: ({ focused }) => (
            <View>
              <MaterialIcons
                name="history-edu"
                size={24}
                color={focused ? "#e32f45" : "#748c94"}
                style={{ width: 25, height: 25, left: 15 }}
              />
              <Text
                style={{
                  color: focused ? "e32f45" : "#748c94",
                  fontSize: 12,
                  fontWeight: "bold",
                }}
              >
                Your Orders
              </Text>
            </View>
          ),
        }}
      />
      <Tab.Screen
        name="TailorProfile"
        component={TailorAcccount}
        options={{
          tabBarIcon: ({ focused }) => (
            <View>
              <MaterialCommunityIcons
                name="account"
                size={24}
                color={focused ? "#e32f45" : "#748c94"}
                style={{ width: 25, height: 25, left: 5 }}
              />
              <Text
                style={{
                  color: focused ? "e32f45" : "#748c94",
                  fontSize: 12,
                  fontWeight: "bold",
                }}
              >
                Profile
              </Text>
            </View>
          ),
        }}
      />
      <Tab.Screen
        name="AddDesigns"
        component={AddDesigns}
        options={{
          tabBarIcon: ({ focused }) => (
            <View>
              <AntDesign
                name="pluscircleo"
                size={24}
                color={focused ? "#e32f45" : "#748c94"}
                style={{ width: 25, height: 25, left: 19 }}
              />
              <Text
                style={{
                  color: focused ? "e32f45" : "#748c94",
                  fontSize: 12,
                  fontWeight: "bold",
                }}
              >
                Add Designs
              </Text>
            </View>
          ),
        }}
      />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  shadow: {
    shadowColor: "#059fa5",
    shadowOffset: {
      width: 0,
      height: 7,
    },
    shadowOpacity: 0.35,
    shadowRadius: 3.7,
    elevation: 5,
  },
});

export default TailorTabs;
