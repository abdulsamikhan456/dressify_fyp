import React, { useState } from "react";
import {
  Text,
  StyleSheet,
  TextInput,
  Pressable,
  TouchableOpacity,
  View,
  Alert,
  Dimensions,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { FontFamily, Color, Border, FontSize } from "../GlobalStyles";
import { auth, db } from "../firebase";
import { setDoc, doc } from "firebase/firestore";
import { createUserWithEmailAndPassword, getAuth } from "firebase/auth";
import { AntDesign } from "@expo/vector-icons";
import firebaseAuth from "firebase-auth";
import { firebase } from "@react-native-firebase/auth";
import { Welcome } from '../screens/WelcomeScreen';


const SignUpScreen = () => {
  const navigation = useNavigation();
  const [selectedRole, setSelectedRole] = React.useState(null);
  const [username, setUsername] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");
  const [phoneNumber, setPhoneNumber] = React.useState("");
  const [phoneNumberError, setPhoneNumberError] = React.useState("");
  const [showPassword, setShowPassword] = React.useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);

  const validatePhoneNumber = (number) => {
    const phoneNumberRegex = /^\+92\d{10}$/; // Regex pattern for +92 followed by 10 digits
    if (!phoneNumberRegex.test(number)) {
      setPhoneNumberError(" * Phone number must start with +92 and have 12 digits");
    } else {
      setPhoneNumberError("");
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const togglePasswordVisibility1 = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const auth = getAuth();

  const handleSignUp = async () => {
    // Password validation
    const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (
      username === "" ||
      email === "" ||
      password === "" ||
      confirmPassword === "" ||
      phoneNumber === ""
    ) {
      Alert.alert("Invalid Details", "Please enter all the details");
      return;
    } else if (password !== confirmPassword) {
      Alert.alert("Password Mismatch", "Passwords do not match");
      return;
    } else if (!passwordRegex.test(password)) {
      Alert.alert(
        "Invalid Password",
        "Password must contain at least one capital letter, one digit, and one special character, and be at least 8 characters long"
      );
      return;
    }

    try {
      const userCredentials = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredentials.user;

      const uid = user.uid; // Get the UID of the newly created user

      // Storing user data in Firestore
      await setDoc(doc(db, "users", uid), {
        email: user.email,
        username: username,
        phoneNumber: phoneNumber,
        role: selectedRole,
      });

      // Navigate to the respective home page based on the role
      if (selectedRole === "Tailor") {
        navigation.navigate("TailorSignDetails", { uid: uid, userRole: selectedRole });
      } else {
        navigation.navigate("CustomerSignDetails", { uid: uid, userRole: selectedRole });
      }
    } catch (error) {
      console.error('Error signing up:', error.message);
      // Handle error scenarios
      // Show an alert, log the error, or perform appropriate actions
    }
  };

  // Handle error scenarios (display error message, etc.)

  return (
    <View style={styles.signupscreen}>
      <View style={styles.curvesContainer}>
        <View style={[styles.curve1, { backgroundColor: "#ffffff" }]} />
        <View style={[styles.curve, { backgroundColor: "#014c78" }]} />
      </View>
      <Text style={[styles.dressify, styles.signTypo]}>Dressify</Text>
      <Text style={[styles.signUp, styles.signupscreenPosition]}>Create an Account</Text>
      <TextInput
        style={[styles.signupscreenChild, styles.signupscreenLayout]}
        placeholder="Username"
        value={username}
        onChangeText={(text) => setUsername(text)}
      />
      <TextInput
        style={[styles.signupscreenItem, styles.signupscreenItemPosition]}
        placeholder="Email"
        value={email}
        onChangeText={(text) => setEmail(text)}
      />
      <TextInput
        style={[styles.signupscreenInner, styles.signupscreenLayout]}
        secureTextEntry={!showPassword}
        placeholder="Password"
        value={password}
        onChangeText={(text) => setPassword(text)}
      />
     <TextInput
  style={{
    top: 380,
    left: 38,
    position: "absolute",
    padding: 10,
    width: 301,
    height: 40,
    borderWidth: 1,
    borderColor: Color.colorGray_200,
    borderStyle: "solid",
    borderRadius: Border.br_mini,
    backgroundColor: Color.colorWhite,
  }}
  secureTextEntry={!showConfirmPassword}
  placeholder="Confirm Password"
  value={confirmPassword}
  onChangeText={(text) => setConfirmPassword(text)}
/>
      <TouchableOpacity
        onPress={togglePasswordVisibility}
        style={{ marginVertical: 315, left: 295, position: "absolute" }}
      >
        <AntDesign
          name={showPassword ? "eye" : "eyeo"}
          size={24}
          color="black"
        />
      </TouchableOpacity>

      <TouchableOpacity
        onPress={togglePasswordVisibility1}
        style={{ marginVertical: 385, left: 295, position: "absolute" }}
      >
        <AntDesign
          name={showConfirmPassword ? "eye" : "eyeo"}
          size={24}
          color="black"
        />
      </TouchableOpacity>

      <TextInput
  style={[styles.rectangleTextinput, styles.signupscreenLayout]}
  keyboardType="numeric"
  placeholder="+923124567891"
  value={phoneNumber}
  onChangeText={(text) => {
    setPhoneNumber(text);
    validatePhoneNumber(text);
  }}
/>
{phoneNumberError ? (
  <Text style={styles.errorText}>{phoneNumberError}</Text>
) : null}
      {/* ... (previous code remains the same) */}

      <View style={styles.roleSelectionContainer}>
        <Text style={styles.roleSelectionText}>Select Preference:</Text>
        <View style={styles.roleButtonsContainer}>
          <TouchableOpacity
            style={[
              styles.radioButton,
              selectedRole === "Customer" ? styles.selectedRadioButton : null,
            ]}
            onPress={() => setSelectedRole("Customer")}
          >
            <Text style={styles.radioButtonText}>Customer</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.radioButton,
              selectedRole === "Tailor" ? styles.selectedRadioButton : null,
            ]}
            onPress={() => setSelectedRole("Tailor")}
          >
            <Text style={styles.radioButtonText}>Tailor</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* ... (rest of your JSX remains the same) */}

      <Pressable
        onPress={handleSignUp}
        style={[styles.rectanglePressable, styles.signupscreenItemPosition]}
      />
      <Text style={[styles.signUp1, styles.signTypo]}>Sign Up</Text>
      <Text
        style={[styles.alreadyHaveAn, styles.login1Typo]}
      >{`Already have an account? `}</Text>
      <TouchableOpacity
        style={[styles.login, styles.loginPosition]}
        activeOpacity={0.2}
        onPress={() => navigation.navigate("LoginScreen")}
      >
        <Text style={[styles.login1, styles.login1Typo]}>Login</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  signTypo: {
    textAlign: "center",
    //fontFamily: FontFamily.interBold,
    fontWeight: "700",
    
  },
  signupscreenPosition: {
    left: 43,
    position: "absolute",
    color: "white",
    
  },
  signupscreenLayout: {
    alignContent: "center",
    alignItems: "center",
    left: 40,
    height: 40,
    width: 301,
    borderWidth: 1,
    borderColor: Color.colorGray_200,
    borderStyle: "solid",
    borderRadius: Border.br_mini,
    backgroundColor: Color.colorWhite,
  },
  signupscreenItemPosition: {
    alignContent: "center",
    alignItems: "center",
    left: 40,
    position: "absolute",
  },
  login1Typo: {
    height: 30,
    fontSize: FontSize.size_mini,
    textAlign: "left",
    //fontFamily: FontFamily.interBold,
    fontWeight: "700",
  },
  loginPosition: {
    top: 610,
    position: "absolute",
  },
  dressify: {
    top: 53,
    left: 105,
    fontSize: FontSize.size_21xl,
    width: 180,
    height: 73,
    color: Color.colorDarkcyan,
    position: "absolute",
  },
  signUp: {
    top: 125,
    fontSize: FontSize.size_sm,
    color: Color.colorBlack,
    height: 35,
    textAlign: "left",
    // fontFamily: FontFamily.interBold,
    fontWeight: "700",
    
  },
  signupscreenChild: {
    top: 176,
    left: 40,
    position: "absolute",
    padding: 10,
  },
  signupscreenItem: {
    top: 242,
    height: 40,
    width: 301,
    borderWidth: 1,
    borderColor: Color.colorGray_200,
    borderStyle: "solid",
    borderRadius: Border.br_mini,
    backgroundColor: Color.colorWhite,
    left: 40,
    padding: 10,
  },
  signupscreenInner: {
    top: 308,
    left: 20,
    position: "absolute",
    padding: 10,
  },
  rectangleTextinput: {
    top: 450,
    left: 26,
    position: "absolute",
    padding: 10,
  },
  rectanglePressable: {
    alignContent: "center",
    alignItems: "center",
    top: 590,
    borderRadius: Border.br_3xs,
    backgroundColor: Color.colorDarkcyan,
    width: 307,
    height: 48,
  },
  signUp1: {
    top: 597,
    left: 155,
    fontSize: FontSize.size_xl,
    color: Color.colorLightgray,
    position: "absolute",
  },
  alreadyHaveAn: {
    left: 80,
    color: Color.colorGray_100,
    width: 190,
    top: 660,
    position: "absolute",
  },
  login1: {
    width: 41,
    color: "white",
    top: 50
  },
  login: {
    left: 265,
    
  },
  signupscreen: {
    flex: 1,
    width: "100%",
    height: 600,
    overflow: "hidden",
    backgroundColor: '#059FA5',
  
  },
  curvesContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
  },
  curve: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    width: Dimensions.get("window").width / 1,
    backgroundColor: "transparent",
    borderTopRightRadius: Dimensions.get("window").height,
  },
  curve1: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    width: Dimensions.get("window").width / 0.7,
    backgroundColor: "transparent",
    borderTopRightRadius: Dimensions.get("window").height,
  },
  
  roleSelectionContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 30,
    marginVertical: 513,
    left: 37,
    position: 'absolute'
  },
  roleSelectionText: {
    color: "white",
    marginRight: 5,
    fontWeight: 'bold'
  },
  roleButtonsContainer: {
    flexDirection: "row",
  },
  radioButton: {
    borderWidth: 1,
    borderColor: Color.colorGray_200,
    borderRadius: Border.br_mini,
    backgroundColor: Color.colorWhite,
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginRight: 10,
  },
  selectedRadioButton: {
    backgroundColor: Color.colorDarkcyan,
  },
  radioButtonText: {
    fontSize: FontSize.size_smi,
    color: Color.colorBlack,
  },
  confirmPasswordInput: {
    top: 380,
    left: 38,
    position: "absolute",
    padding: 10,
    width: 301,
    height: 40,
    borderWidth: 1,
    borderColor: Color.colorGray_200,
    borderStyle: "solid",
    borderRadius: Border.br_mini,
    backgroundColor: Color.colorWhite,
  },
  errorText: {
    color: "red",
    marginLeft: 30, // Adjust the positioning as needed
    top: 20,
    fontWeight: 'bold'
  }
});

export default SignUpScreen;
