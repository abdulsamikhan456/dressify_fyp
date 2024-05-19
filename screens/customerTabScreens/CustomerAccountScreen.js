import { StyleSheet, Text, View, TouchableOpacity, Image } from 'react-native';
import React, { useState } from 'react';
import { signOut } from 'firebase/auth';
import { useNavigation, useRoute } from '@react-navigation/native';
import { auth } from '../../firebase';
import { AntDesign } from '@expo/vector-icons';
import { MaterialIcons } from '@expo/vector-icons';


const CustomerAccountScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { userEmail, userProfilePicture } = route.params || {} ;

  const user = auth.currentUser;
  
  const signOutUser = () => {
    signOut(auth).then(() => {
      navigation.replace("LoginScreen");
    }).catch(err => {
      console.log(err);
    });
  };

  

  const [noticeText, setNoticeText] = useState("");
  const [noticeIcon, setNoticeIcon] = useState("");

  const showNotice = (text, icon) => {
    setNoticeText(text);
    setNoticeIcon(icon);
  };

  const navigateToTailorsWishList = () => {
    navigation.navigate('AddToFav', { userEmail }); // Navigate to the TailorsWishList screen
  };

  const navigateToPersonalInfo = () => {
    navigation.navigate('CustomerPersonalInfo', { userEmail }); // Navigate to the TailorsWishList screen
  };

  const navigateToVirtualWardrobe = () => {
    navigation.navigate('VirtualWardrobe', { userEmail }); // Navigate to the TailorsWishList screen
  };

  return (
    <View style={styles.container}>
      {/* Profile Picture and Email */}
      <View style={styles.profileContainer}>
        <Image source={{ uri: userProfilePicture }} style={styles.profilePicture} />
        <Text style={styles.emailText}>{userEmail}</Text>
      </View>

      {/* Logout Button */}
      <TouchableOpacity style={styles.logoutButton} onPress={signOutUser}>
        <AntDesign name="logout" size={24} color="white" style={styles.logoutIcon} />
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>

      {/* Floating Notice Boxes */}
      <View style={styles.noticeContainer}>
        <TouchableOpacity style={styles.noticeBox} onPress={navigateToPersonalInfo}>
          <AntDesign name="infocirlceo" size={24} color="#059FA5" />
          <Text style={styles.noticeText}>Personal Information</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.noticeBox} onPress={navigateToVirtualWardrobe}>
          <AntDesign name="link" size={24} color="#059FA5" />
          <Text style={styles.noticeText}>Virtual Wardrobe</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.noticeBox} onPress={navigateToTailorsWishList}>
          <AntDesign name="hearto" size={24} color="#059FA5" />
          <Text style={styles.noticeText}>Tailors Wish List</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.noticeBox} onPress={() => showNotice("Wish List", "hearto")}>
        <MaterialIcons name="history-toggle-off" size={24} color="#059FA5" />
          <Text style={styles.noticeText}>Orders History</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default CustomerAccountScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    bottom: 235,
    right: 25
  },
  profilePicture: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 10,
  },
  emailText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  logoutButton: {
    backgroundColor: '#059FA5', // Example button color
    padding: 15,
    borderRadius: 8,
    marginTop: 30,
    flexDirection: 'row', // Add flexDirection to align icon and text horizontally
    alignItems: 'center',
    top: 50 // Center align items horizontally
  },
  logoutIcon: {
    marginRight: 5, // Add some spacing between icon and text
  },
  logoutText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
    textAlign: 'center',
  },
  noticeContainer: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    position: 'absolute',
    bottom: 330,
    paddingHorizontal: 20,
    
    width: '100%' // Set a fixed width for the container
  },
  noticeBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 20,
    marginBottom: 10,
    width: '100%' ,
    borderWidth: 0.5,
    borderColor: 'grey'
  },
  noticeText: {
    color: 'black',
    fontSize: 14,
    marginLeft: 10,
  },
});
