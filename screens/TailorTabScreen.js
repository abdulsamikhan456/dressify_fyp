import React, { useEffect, useContext } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import TailorTabs from '../navigation/TailorTabs';
import TailorHomeScreen from '../screens/tailorTabScreens/TailorHomeScreen'; // Import TailorHomeScreen
import { useUser } from "../UserContext"; 
import { useRoute } from '@react-navigation/native';

const Stack = createNativeStackNavigator();

const TailorTabScreen = ({ route }) => {
  const { uid=null } = route.params || {};

  useEffect(() => {
    console.log('UID changed:', uid);
  }, [uid]);
  
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Home1"
        component={TailorTabs} 
        options={{ headerShown: false }}
        initialParams={{ uid }}  // Pass the uid to TailorTabs
      />
      <Stack.Screen
        name="TailorHomeScreen"
        component={TailorHomeScreen}
        initialParams={{ uid }}  // Pass the uid to TailorHomeScreen
      />
    </Stack.Navigator>
  );
};

export default TailorTabScreen;
