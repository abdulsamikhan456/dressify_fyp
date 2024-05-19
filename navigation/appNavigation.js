import React, { useEffect, useState } from 'react'
import { NavigationContainer } from '@react-navigation/native';


import OnboardingScreen from '../screens/OnboardingScreen.js';
import { getItem } from '../utils/asyncStorage.js';


import CustomerHome from '../screens/customerTabScreens/CustomerHome.js';
import LoginScreen from '../screens/LoginScreen.js';

import SignUpScreen from '../screens/SignUpScreen.js';
import ForgotPassword from '../screens/ForgotPassword.js';
import ResetPassword from '../screens/ResetPassword.js';
import SuccessfullyChangedPass from '../screens/SuccessfullyChangedPass.js';
import EnterOtp from '../screens/EnterOtp.js';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import TabScreen from '../screens/TabScreen.js';
import CustomerAccountScreen from '../screens/customerTabScreens/CustomerAccountScreen.js';
import TailorHomeScreen from '../screens/tailorTabScreens/TailorHomeScreen.js';
import TailorTabScreen from '../screens/TailorTabScreen.js';
import WelcomeScreen from '../screens/WelcomeScreen.js';
import TailorSignDetailScreen from '../screens/TailorSignDetailScreen.js';
import TailorTabs from './TailorTabs.js';
import SelectedTailorScreen from '../screens/SelectedTailorScreen.js';
import SelectOppointDate from '../screens/SelectOppointDate.js';
import SelectMeasurementMethod from '../screens/SelectMeasurementMethod.js';
import GiveMeasurement from '../screens/GiveMeasurement.js';
import GiveMeasureHome from '../screens/GiveMeasureHome.js';
import SelectGender from '../screens/SelectGender.js';
import ChooseBillingMethod from '../screens/ChooseBillingMethod.js';
import RequestSend from '../screens/RequestSend.js';
import QMeasurement from '../screens/QMeasurement.js';
import Qchar from '../screens/Qchar.js';
import AdditionalDesign from '../screens/AdditionalDesigns.js';
import Tabs from './Tabs.js';
import NewOrderRequestScreen from '../screens/NewOrderRequestScreen.js';
import PendingOrders from '../screens/PendingOrders.js';
import CompletedOrders from '../screens/CompletedOrders.js';
import MsgsScreen from '../screens/MsgsScreen.js';
import TailorMsgsScreen from '../screens/TailorMsgsScreen.js';
import CustomerSignDetails from '../screens/CustomerSignDetails.js';
import DesignsScreen from '../screens/DesignsScreen.js';
import AddToFav from '../screens/AddToFav.js';
import CustomerPersonalInfo from '../screens/CustomerPersonalInfo.js';
import VirtualWardrobe from '../screens/VirtualWardrobe.js';
import TailorAcccount from '../screens/tailorTabScreens/TailorAcccount.js';
import TailorPersonalInfo from '../screens/TailorPersonalInfo.js';
import AdminDashboard from '../screens/AdminDashboard.js';
import CustomerDetails from '../screens/CustomerDetails.js';
import TailorDetails from '../screens/TailorDetails.js';
import Payment from '../screens/Payment.js';
import TailorDesigns from '../screens/TailorDesigns.js';
import InventoryManagement from '../screens/InventoryManagement.js';






const Stack = createNativeStackNavigator();

export default function AppNavigation() {

  const [showOnboarding, setShowOnboarding] = useState(null);
  useEffect(()=>{
    checkIfAlreadyOnboarded();
  },[])

  const checkIfAlreadyOnboarded = async ()=>{
    let onboarded = await getItem('onboarded');
    if(onboarded==1){
      // hide onboarding
      setShowOnboarding(true);
    }else{
      // show onboarding
      setShowOnboarding(false);
    }
  }

  if(showOnboarding==null){
    return null;
  }


  if(showOnboarding){
    return (
      <NavigationContainer>
        <Stack.Navigator initialRouteName='Onboarding'>
          <Stack.Screen name="Onboarding" options={{headerShown: false}} component={OnboardingScreen} />
          <Stack.Screen name="TailorHome" options={{headerShown: false}} component={TailorHomeScreen} />
          <Stack.Screen name="LoginScreen" options={{headerShown: false}} component={LoginScreen} />
          <Stack.Screen name="CustomerHome" options={{headerShown: false}} component={CustomerHome} />
          <Stack.Screen name="SignUp" options={{headerShown: false}} component={SignUpScreen} />
          <Stack.Screen name="ForgotPassword" options={{headerShown: false}} component={ForgotPassword} />
          <Stack.Screen name="ResetPassword" options={{headerShown: false}} component={ResetPassword} />
          <Stack.Screen name="SuccessfullyChangedPass" options={{headerShown: false}} component={SuccessfullyChangedPass} />
          <Stack.Screen name="EnterOtp" options={{headerShown: false}} component={EnterOtp} />
          <Stack.Screen name="Tab" options={{headerShown: false}} component={TabScreen} />
          <Stack.Screen name="Tabs" options={{headerShown: false}} component={Tabs} />
          <Stack.Screen name="TailorTab" options={{headerShown: false}} component={TailorTabScreen} />
          <Stack.Screen name="WelcomeScreen" options={{headerShown: false}} component={WelcomeScreen} />
          <Stack.Screen name= "TailorSignDetails" options={{headerShown: false}} component={TailorSignDetailScreen}/>
          <Stack.Screen name= "TailorTabs" options={{headerShown: false}} component={TailorTabs}/> 
          <Stack.Screen name="SelectedTailor" options={{headerShown: false}} component={SelectedTailorScreen} />
          <Stack.Screen name="SelectOppointDate" options={{headerShown: false}} component={SelectOppointDate} />
          <Stack.Screen name="SelectMeasurementMethod" options={{headerShown: false}} component={SelectMeasurementMethod} />
          <Stack.Screen name="GiveMeasurement" options={{headerShown: false}} component={GiveMeasurement} />
          <Stack.Screen name="MeasurementHome" options={{headerShown: false}} component={GiveMeasureHome} />
          <Stack.Screen name="SelectGender" options={{headerShown: false}} component={SelectGender} />
          <Stack.Screen name="BillingMethod" options={{headerShown: false}} component={ChooseBillingMethod} />
          <Stack.Screen name="ReqSend" options={{headerShown: false}} component={RequestSend} />
          <Stack.Screen name="Qmeasurement" options={{headerShown: false}} component={QMeasurement} />
          <Stack.Screen name="QChart" options={{headerShown: false}} component={Qchar} />
          <Stack.Screen name="AdditionalDesigns" options={{headerShown: false}} component={AdditionalDesign} />
          <Stack.Screen name="NewOrdersRequest" options={{headerShown: false}} component={NewOrderRequestScreen} />
          <Stack.Screen name="PendingOrders" options={{headerShown: false}} component={PendingOrders} />
          <Stack.Screen name="CompletedOrders" options={{headerShown: false}} component={CompletedOrders} />
          <Stack.Screen name="MsgsScreen" options={{headerShown: false}} component={MsgsScreen} />
          <Stack.Screen name="TailorMsgsScreen" options={{headerShown: false}} component={TailorMsgsScreen} />
          <Stack.Screen name="CustomerSignDetails" options={{headerShown: false}} component={CustomerSignDetails} />
          <Stack.Screen name="DesignsScreen" options={{headerShown: false}} component={DesignsScreen} />
          <Stack.Screen name="AddToFav" options={{headerShown: false}} component={AddToFav} />
          <Stack.Screen name="CustomerPersonalInfo" options={{headerShown: false}} component={CustomerPersonalInfo} />
          <Stack.Screen name="VirtualWardrobe" options={{headerShown: false}} component={VirtualWardrobe} />
          <Stack.Screen name="TailorPersonalInfo" options={{headerShown: false}} component={TailorPersonalInfo} />
          <Stack.Screen name="AdminDashboard" options={{headerShown: false}} component={AdminDashboard} />
          <Stack.Screen name="CustomerDetails" options={{headerShown: false}} component={CustomerDetails} />
          <Stack.Screen name="TailorDetails" options={{headerShown: false}} component={TailorDetails} />
          <Stack.Screen name="Payment" options={{headerShown: false}} component={Payment} />
          <Stack.Screen name="TailorDesigns" options={{headerShown: false}} component={TailorDesigns} />
          <Stack.Screen name="InventoryManagement" options={{headerShown: false}} component={InventoryManagement} />
          {/* <Stack.Screen name="AddEditItem" options={{headerShown: false}} component={AddEditItemScreen} /> */}
         




          
          

        </Stack.Navigator>
      </NavigationContainer>
    )
  }else{
    return (
      <NavigationContainer>
        <Stack.Navigator initialRouteName='Home'>
          <Stack.Screen name="Onboarding" options={{headerShown: false}} component={OnboardingScreen} />
          <Stack.Screen name="LoginScreen" options={{headerShown: false}} component={LoginScreen} />
          <Stack.Screen name="TailorHome" options={{headerShown: false}} component={TailorHomeScreen} />
          <Stack.Screen name="CustomerHome" options={{headerShown: false}} component={CustomerHome} />
          <Stack.Screen name="SignUp" options={{headerShown: false}} component={SignUpScreen} />
          <Stack.Screen name="ForgotPassword" options={{headerShown: false}} component={ForgotPassword} />
          <Stack.Screen name="ResetPassword" options={{headerShown: false}} component={ResetPassword} />
          <Stack.Screen name="SuccessfullyChangedPass" options={{headerShown: false}} component={SuccessfullyChangedPass} />
          <Stack.Screen name="EnterOtp" options={{headerShown: false}} component={EnterOtp} />
          <Stack.Screen name="Tab" options={{headerShown: false}} component={TabScreen} />
          <Stack.Screen name="Tabs" options={{headerShown: false}} component={Tabs} />

          <Stack.Screen name="TailorTab" options={{headerShown: false}} component={TailorTabScreen} />
          <Stack.Screen name="WelcomeScreen" options={{headerShown: false}} component={WelcomeScreen} />
          <Stack.Screen name= "TailorSignDetail" options={{headerShown: false}} component={TailorSignDetailScreen}/>
           <Stack.Screen name= "TailorTabs" options={{headerShown: false}} component={TailorTabs}/> 
          <Stack.Screen name="SelectedTailor" options={{headerShown: false}} component={SelectedTailorScreen} />
          <Stack.Screen name="SelectOppointDate" options={{headerShown: false}} component={SelectOppointDate} />
          <Stack.Screen name="SelectMeasurementMethod" options={{headerShown: false}} component={SelectMeasurementMethod} />
          <Stack.Screen name="GiveMeasurement" options={{headerShown: false}} component={GiveMeasurement} />
          <Stack.Screen name="MeasurementHome" options={{headerShown: false}} component={GiveMeasureHome} />
          <Stack.Screen name="SelectGender" options={{headerShown: false}} component={SelectGender} />
          <Stack.Screen name="BillingMethod" options={{headerShown: false}} component={ChooseBillingMethod} />
          <Stack.Screen name="ReqSend" options={{headerShown: false}} component={RequestSend} />
          <Stack.Screen name="Qmeasurement" options={{headerShown: false}} component={QMeasurement} />
          <Stack.Screen name="QChart" options={{headerShown: false}} component={Qchar} />
          <Stack.Screen name="AdditionalDesigns" options={{headerShown: false}} component={AdditionalDesign} />
          <Stack.Screen name="NewOrdersRequest" options={{headerShown: false}} component={NewOrderRequestScreen} />
          <Stack.Screen name="PendingOrders" options={{headerShown: false}} component={PendingOrders} />
          <Stack.Screen name="CompletedOrders" options={{headerShown: false}} component={CompletedOrders} />
          <Stack.Screen name="MsgsScreen" options={{headerShown: false}} component={MsgsScreen} />
          <Stack.Screen name="TailorMsgsScreen" options={{headerShown: false}} component={TailorMsgsScreen} />
          <Stack.Screen name="CustomerSignDetails" options={{headerShown: false}} component={CustomerSignDetails} />
          <Stack.Screen name="DesignsScreen" options={{headerShown: false}} component={DesignsScreen} />
          <Stack.Screen name="AddToFav" options={{headerShown: false}} component={AddToFav} />
          <Stack.Screen name="CustomerPersonalInfo" options={{headerShown: false}} component={CustomerPersonalInfo} />
          <Stack.Screen name="VirtualWardrobe" options={{headerShown: false}} component={VirtualWardrobe} />
          <Stack.Screen name="TailorPersonalInfo" options={{headerShown: false}} component={TailorPersonalInfo} />
          <Stack.Screen name="AdminDashboard" options={{headerShown: false}} component={AdminDashboard} />
          <Stack.Screen name="CustomerDetails" options={{headerShown: false}} component={CustomerDetails} />
          <Stack.Screen name="TailorDetails" options={{headerShown: false}} component={TailorDetails} />
          <Stack.Screen name="Payment" options={{headerShown: false}} component={Payment} />
          <Stack.Screen name="TailorDesigns" options={{headerShown: false}} component={TailorDesigns} />
          <Stack.Screen name="InventoryManagement" options={{headerShown: false}} component={InventoryManagement} />
          {/* <Stack.Screen name="AddEditItem" options={{headerShown: false}} component={AddEditItemScreen} /> */}





          
          
         



        
        </Stack.Navigator>
      </NavigationContainer>
    )
  }

  
}

