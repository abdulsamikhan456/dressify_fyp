import * as React from "react";
import {
  Text,
  StyleSheet,
  TextInput,
  View,
  Pressable,
  TouchableOpacity,
  Modal,
  TouchableWithoutFeedback,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { FontFamily, Color, Border, FontSize } from "../GlobalStyles";

import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { getFirestore, collection, query, where, getDocs, getDoc ,doc} from "firebase/firestore";
import { AntDesign } from "@expo/vector-icons";
import LottieView from 'lottie-react-native';

const LoginScreen = () => {
  const navigation = useNavigation();
  const [selectedRole, setSelectedRole] = React.useState(null);
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [showPassword, setShowPassword] = React.useState(false);
  const [isModalVisible, setIsModalVisible] = React.useState(false);
  const [adminEmail, setAdminEmail] = React.useState("");
  const [adminPassword, setAdminPassword] = React.useState("");
  const auth = getAuth();
  const firestore = getFirestore();

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleModal = () => {
    setIsModalVisible(!isModalVisible);
  };

  const handleLogin = async () => {
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      // Retrieve user role from Firestore
      const userDoc = await getDoc(doc(firestore, "users", user.uid)); // Get document

      console.log("User document exists:", userDoc.exists());

      if (userDoc.exists()) {
        const userData = userDoc.data();
        console.log("User data:", userData);

        const userRole = userData?.role; // Check if role exists in userData

        console.log("User role:", userRole);

        // Navigate based on the user's role
        if (userRole === "Tailor") {
          console.log("Navigating to TailorHome");
          navigation.navigate("TailorTab");
        } else if ( userRole === "Customer") {
          console.log("Navigating to CustomerHome");
          navigation.navigate("Tab");
        } else {
          console.log("User role and selected role mismatch.");
          // Handle cases where the selected role doesn't match the user's role
        }
      } else {
        console.log("User document does not exist.");
        // Handle cases where the user document doesn't exist
      }
    } catch (error) {
      console.error("Error logging in:", error.message);
      // Handle error scenarios
    }
  };

  

  const handleAdminLogin = async () => {
    try {
      const adminDocs = await getDocs(query(collection(firestore, "admin"), where("email", "==", adminEmail), where("password", "==", adminPassword)));

      if (adminDocs.size > 0) {
        console.log("Navigating to AdminDashboard");
        navigation.navigate("AdminDashboard");
      } else {
        console.log("Invalid admin credentials.");
      }
    } catch (error) {
      console.error("Error logging in as admin:", error.message);
    }
  };


  return (
    <View style={styles.loginscreen}>
      {/* Three curved lines */}
      <View style={styles.curveContainer}>
        <View style={[styles.curve, styles.curve1]} />
        <View style={[styles.curve, styles.curve2]} />
        <View style={[styles.curve, styles.curve3]} />
      </View>

      <Text style={[styles.dressify, styles.login1Typo]}>Dressify.</Text>
      
      <Text style={styles.login}>Login</Text>
      <TextInput
        style={[styles.loginscreenChild, styles.loginscreenLayout]}
        keyboardType="email-address"
        placeholder="Enter your Email"
        value={email}
        onChangeText={(text) => setEmail(text)}
      />

      <View style={styles.passwordContainer}>
        <TextInput
          style={[styles.loginscreenItem, styles.loginscreenLayout]}
          secureTextEntry={!showPassword}
          placeholder="Enter your Password"
          value={password}
          onChangeText={(text) => setPassword(text)}
        />
        <TouchableOpacity
          onPress={togglePasswordVisibility}
          style={styles.eyeIcon}
        >
          <AntDesign
            name={showPassword ? "eye" : "eyeo"}
            size={24}
            color="black"
          />
        </TouchableOpacity>
      </View>

      <View style={styles.loginscreenInner} />
      <Pressable onPress={handleLogin}>
        <Text style={[styles.login1, styles.login2Typo]}>Login</Text>
      </Pressable>
      <TouchableOpacity
        style={styles.forgotPassword}
        activeOpacity={0.2}
        onPress={() => navigation.navigate("ForgotPassword")}
      >
        <Text style={styles.forgotPassword1}>Forgot Password?</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.adminloginButton}
        activeOpacity={0.2}
        onPress={toggleModal}
      >
        <Text style={styles.adminlogin}>Admin Login</Text>
      </TouchableOpacity>

      <Text
        style={[styles.dontHaveAn, styles.dontHaveAnTypo]}
      >{`Don’t have an account? `}</Text>
      <TouchableOpacity
        style={[styles.createAccount, styles.dontHaveAnPosition]}
        activeOpacity={0.2}
        onPress={() => navigation.navigate("SignUp")}
      >
        <Text style={[styles.createAccount1, styles.dontHaveAnTypo]}>
          Create Account
        </Text>
      </TouchableOpacity>

      {/* Admin Login Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={isModalVisible}
        onRequestClose={toggleModal}
      >
        <TouchableWithoutFeedback onPress={toggleModal}>
          <View style={styles.modalBackground}>
            <View style={styles.modalContainer}>
              <Text style={styles.modalTitle}>Admin Login</Text>
              <TextInput
                style={styles.modalInput}
                placeholder="Enter your Email"
                value={adminEmail}
                onChangeText={(text) => setAdminEmail(text)}
              />
              <TextInput
                style={styles.modalInput}
                secureTextEntry={!showPassword}
                placeholder="Enter your Password"
                value={adminPassword}
                onChangeText={(text) => setAdminPassword(text)}
              />
              <TouchableOpacity
                style={styles.modalButton}
                onPress={handleAdminLogin}
              >
                <Text style={styles.modalButtonText}>Login as Admin</Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
    position: "absolute",
  },
  eyeIcon: {
    position: "absolute",
    left: 295,
    top: 275,
  },
  login1Typo: {
    left: 120,
    textAlign: "left",
    fontWeight: "700",
    position: "absolute",
  },
  login2Typo: {
    left: 165,
    textAlign: "left",
    fontWeight: "700",
    position: "absolute",
  },
  loginscreenLayout: {
    padding: 10,
    height: 40,
    width: 301,
    borderWidth: 1,
    borderColor: Color.colorGray_200,
    borderStyle: "solid",
    borderRadius: Border.br_mini,
    left: 40,
    position: "absolute",
    backgroundColor: Color.colorWhite,
  },
  dontHaveAnTypo: {
    height: 23,
    fontSize: FontSize.size_smi,
    textAlign: "left",
    fontWeight: "700",
    left: 80,
  },
  dontHaveAnPosition: {
    top: 502,
    position: "absolute",
  },
  dressify: {
    top: 61,
    left: 90,
    fontSize: FontSize.size_21xl,
    width: 180,
    height: 73,
    color: Color.colorDarkcyan,
  },
  login: {
    top: 134,
    fontSize: FontSize.size_sm,
    color: "white",
    width: 92,
    height: 25,
    left: 50,
    textAlign: "left",
    fontWeight: "700",
    position: "absolute",
  },
  loginscreenChild: {
    top: 194,
  },
  loginscreenItem: {
    top: 269,
  },
  loginscreenInner: {
    top: 369,
    left: 40,
    borderRadius: Border.br_3xs,
    backgroundColor: Color.colorDarkcyan,
    width: 307,
    height: 48,
    position: "absolute",
  },
  login1: {
    position: "absolute",
    top: 378,
    left: 161,
    fontSize: FontSize.size_xl,
    color: Color.colorLightgray,
  },
  forgotPassword1: {
    color: Color.colorSilver_200,
    fontSize: FontSize.size_smi,
    textAlign: "left",
    fontWeight: "700",
    right: 165,
  },
  forgotPassword: {
    left: 216,
    top: 436,
    position: "absolute",
  },
  adminlogin: {
    color: 'white',
    fontSize: FontSize.size_smi,
    textAlign: "left",
    fontWeight: "700",
    left: 50,
    bottom: 22
  },
  adminloginButton: {
    left: 216,
    top: 460,
    position: "absolute",
  },
  dontHaveAn: {
    color: Color.colorGray_100,
    width: 190,
    top: 502,
    position: "absolute",
  },
  createAccount1: {
    width: 121,
    color: "white",
  },
  createAccount: {
    left: 140,
  },
  loginscreen: {
    flex: 1,
    width: "100%",
    height: 640,
    overflow: "hidden",
    backgroundColor: "#059FA5",
  },
  curveContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
  },
  curve: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    backgroundColor: "transparent",
    borderTopLeftRadius: 300,
    borderTopRightRadius: 300,
    borderBottomWidth: 2,
  },
  curve3: {
    backgroundColor: "#014c78",
    transform: [{ rotate: '0deg' }],
  },
  modalBackground: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
    width: '80%',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
   
  },
  modalInput: {
    borderWidth: 1,
    borderColor: 'gray',
    padding: 10,
    marginBottom: 10,
    width: '100%',
    borderRadius: 20
  },
  modalButton: {
    backgroundColor: '#059fa5',
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
  },
  modalButtonText: {
    color: 'white',
    fontSize: 16,
  },
});

export default LoginScreen;
