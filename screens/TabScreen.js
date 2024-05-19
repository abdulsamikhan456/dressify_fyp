import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Tabs from '../navigation/Tabs';


const Stack = createNativeStackNavigator();

const TabScreen = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Home"
        component={Tabs} 
        options={{ headerShown: false }} 
      />
      
      
    </Stack.Navigator>
  )
}

export default TabScreen

const styles = StyleSheet.create({})