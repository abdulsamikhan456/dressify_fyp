import * as React from "react";
import {
  Text,
  StyleSheet,
  TextInput,
  Pressable,
  TouchableOpacity,
  View,
  Alert,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { FontFamily, FontSize, Color, Border } from "../GlobalStyles";
import { FirebaseRecaptchaVerifierModal } from "expo-firebase-recaptcha";
import { firebaseConfig} from "../firebase";
import { firebase ,auth} from "@react-native-firebase/auth";

const ForgotPassword = () => {
  const navigation = useNavigation();
  const [phoneNumber, setPhoneNumber] = React.useState("");
  const [code, setCode] = React.useState("");
  const [verificationId, setVerificationId] = React.useState(null);
  const recaptaVerifier = React.useRef(null);

  const sendVerification = () => {
    const phoneProvider = new firebase.auth.PhoneAuthProvider();
    phoneProvider
    .verifyPhoneNumber(phoneNumber, recaptaVerifier.current)
    .then(setVerificationId);
    setPhoneNumber('');
  }

  const confirmCode = () => {
     const credentials = firebase.auth.PhoneAuthProvider.credential(
      verificationId,
      code
     );
     firebase.auth().signInWithCredential(credentials)
     .then(() => { 
        setCode('');
     })
     .catch((error) => {
      alert(error);
     })
     Alert.alert(
      'Verified'
      );
  };


  return (
    <View style={styles.forgotpassword}>
      <FirebaseRecaptchaVerifierModal
      ref={recaptaVerifier}
      firebaseConfig={firebaseConfig}
      />
      <Text style={[styles.dressify, styles.submitTypo]}>Dressify</Text>
      <Text
        style={[styles.pleaseEnterThe, styles.submitTypo]}
      >{`Please enter the mobile number associated with 
your account.`}</Text>
      <TextInput
        style={styles.forgotpasswordChild}
        keyboardType="number-pad"
        placeholder="+9234561789642"
        value={phoneNumber}
        onChangeText={(text) => setPhoneNumber(text)}

      />
      <TouchableOpacity
        style={styles.forgotpasswordItem}
        activeOpacity={0.2}
        onPress={sendVerification}
      />
      <Text style={[styles.submit, styles.submitTypo]}>Send</Text>
      <TouchableOpacity
        style={styles.backToLoginContainer}
        activeOpacity={0.2}
        onPress={() => navigation.navigate("LoginScreen")}
      >
        <Text style={[styles.backToLogin, styles.submitTypo]}>
          Back to Login
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  submitTypo: {
    textAlign: "left",
    //fontFamily: FontFamily.interBold,
    fontWeight: "700",
  },
  dressify: {
    top: 61,
    left: 115,
    fontSize: FontSize.size_21xl,
    color: Color.colorDarkcyan,
    width: 180,
    height: 73,
    position: "absolute",
  },
  pleaseEnterThe: {
    top: 147,
    left: 55,
    fontSize: FontSize.size_smi,
    color: Color.colorGray_100,
    position: "absolute",
  },
  forgotpasswordChild: {
    padding: 10,
    top: 226,
    left: 45,
    borderRadius: Border.br_sm,
    borderStyle: "solid",
    borderColor: Color.colorGray_200,
    borderWidth: 1,
    width: 301,
    height: 40,
    position: "absolute",
    backgroundColor: Color.colorWhite,
  },
  forgotpasswordItem: {
    top: 320,
    left: 42,
    borderRadius: Border.br_3xs,
    backgroundColor: Color.colorDarkcyan,
    width: 307,
    height: 48,
    position: "absolute",
  },
  submit: {
    top: 332,
    left: 160,
    fontSize: FontSize.size_xl,
    color: Color.colorLightgray,
    position: "absolute",
  },
  backToLogin: {
    fontSize: FontSize.size_base,
    color: Color.colorSilver_200,
    left: 20,
  },
  backToLoginContainer: {
    left: 131,
    top: 388,
    position: "absolute",
  },
  forgotpassword: {
    flex: 1,
    width: "100%",
    height: 640,
    overflow: "hidden",
    backgroundColor: Color.colorWhite,
  },
});

export default ForgotPassword;
