import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import CustomerAccountScreen from "../screens/customerTabScreens/CustomerAccountScreen.js";
import CustomerOrdersScreen from "../screens/customerTabScreens/CustomerOrdersScreen.js";
import TailorsScreen from "../screens/customerTabScreens/TailorsScreen.js";
import CustomerHome from "../screens/customerTabScreens/CustomerHome.js";
import { StyleSheet, Text, View, Image, TouchableOpacity } from "react-native";
import { AntDesign } from "@expo/vector-icons";
import { MaterialIcons } from "@expo/vector-icons";
import { MaterialCommunityIcons } from "@expo/vector-icons";
const Tab = createBottomTabNavigator();

const Tabs = () => {
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
        name="CustomerHome"
        component={CustomerHome}
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
                style={{ color: focused ? "e32f45" : "#748c94", fontSize: 12,fontWeight: 'bold' }}
              >
                Home
              </Text>
            </View>
          ),
        }}
      />
      <Tab.Screen
        name="Orders"
        component={CustomerOrdersScreen}
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
                style={{ color: focused ? "e32f45" : "#748c94", fontSize: 12,fontWeight: 'bold' }}
              >
                Your Orders
              </Text>
            </View>
          ),
        }}
      />
      <Tab.Screen
        name="Tailors"
        component={TailorsScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <View>
              <MaterialIcons
                name="emoji-people"
                size={24}
                color={focused ? "#e32f45" : "#748c94"}
                style={{ width: 25, height: 25, left: 5 }}
              />

              <Text
                style={{ color: focused ? "e32f45" : "#748c94", fontSize: 12,fontWeight: 'bold' }}
              >
                Tailors
              </Text>
            </View>
          ),
        }}
      />
      <Tab.Screen
        name="Account"
        component={CustomerAccountScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <View>
              <MaterialCommunityIcons
                name="account"
                size={24}
                color={focused ? "#e32f45" : "#748c94"}
                style={{ width: 25, height: 25, left: 8 }}
              />
              <Text
                style={{ color: focused ? "e32f45" : "#748c94", fontSize: 12 ,fontWeight: 'bold' }}
              >
                Account
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

export default Tabs;
