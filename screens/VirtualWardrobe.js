import React, { useState } from 'react';
import { View, Button, Image, StyleSheet, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import LottieView from 'lottie-react-native';
import * as ImagePicker from 'expo-image-picker';

const VirtualWardrobe = ({ navigation }) => {
  const [imageUri, setImageUri] = useState(null);
  const [buttonStyle, setButtonStyle] = useState(styles.buttonContainer);

  const handleChooseImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.cancelled) {
      setImageUri(result.uri);
    }
  };

  const handleBackPress = () => {
    navigation.goBack();
    // Increase the button size and border radius
    setButtonStyle({
      ...styles.buttonContainer,
      width: 250,
      height: 80,
      borderRadius: 80
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Ionicons name="arrow-back" size={24} color="black" style={{right: 75}} onPress={handleBackPress} />
        <Text style={styles.title}>Virtual Wardrobe</Text>
      </View>
      <Text style={styles.subtitle}>Choose your outfit</Text>
      <LottieView
        source={require('../assets/animations/3d.json')} // Change to the path of your Lottie animation
        autoPlay
        loop
        style={styles.lottieAnimation}
      />
      <View style={styles.buttonContainer}>
        <Button title="Choose Outfit" onPress={handleChooseImage} color="#059fa5" />
      </View>
      {imageUri && (
        <View style={styles.userImageContainer}>
          <Image source={{ uri: imageUri }} style={styles.image} />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    bottom: 95
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginLeft: 10,
    right: 10
  },
  subtitle: {
    fontSize: 18,
    marginBottom: 20,
    bottom: 100
  },
  lottieAnimation: {
    width: 300,
    height: 300,
    marginBottom: 10,
  },
  buttonContainer: {
    marginBottom: 20,
    width: 200,
    height: 60,
    borderRadius: 60,
  },
  userImageContainer: {
    width: 200,
    height: 200,
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
});

export default VirtualWardrobe;
