import * as React from "react";
import {
  Text,
  StyleSheet,
  TextInput,
  Pressable,
  TouchableOpacity,
  View,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { FontFamily, Color, Border, FontSize } from "../GlobalStyles";

const EnterOtp = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.enterotp}>
      <Text style={[styles.dressify, styles.dressifyTypo]}>Dressify</Text>
      <Text style={[styles.aVerificationCode, styles.dressifyTypo]}>
        A verification code has been send
      </Text>
      <Text
        style={[styles.pleaseCheckYour, styles.dressifyTypo]}
      >{`Please check your  your mobile and put the 
verification code below.`}</Text>
      <TextInput
        style={[styles.enterotpChild, styles.enterotpChildLayout]}
        keyboardType="number-pad"
        placeholder="0"
      />
      <TextInput
        style={[styles.enterotpItem, styles.enterotpChildLayout]}
        keyboardType="number-pad"
        placeholder="0"
      />
      <TextInput
        style={[styles.enterotpInner, styles.enterotpChildLayout]}
        keyboardType="number-pad"
        placeholder="0"
      />
      <TextInput
        style={[styles.rectangleTextinput, styles.enterotpChildLayout]}
        keyboardType="number-pad"
        placeholder="0"
      />
      <TextInput
        style={[styles.enterotpChild1, styles.enterotpChildLayout]}
        keyboardType="number-pad"
        placeholder="0"
      />
      <TextInput
        style={[styles.enterotpChild2, styles.enterotpChildLayout]}
        keyboardType="number-pad"
        placeholder="0"
      />
      <TouchableOpacity
        style={[styles.rectangleTouchableopacity, styles.rectangleLayout]}
        activeOpacity={0.2}
        onPress={() => navigation.navigate("ResetPassword")}
      />
      <View style={[styles.rectangleView, styles.rectangleLayout]} />
      <Text style={[styles.next, styles.nextTypo]}>Next</Text>
      <Text style={[styles.resend, styles.nextTypo]}>Resend</Text>
      <TouchableOpacity
        style={styles.backToLoginContainer}
        activeOpacity={0.2}
        onPress={() => navigation.navigate("LoginScreen")}
      >
        <Text style={[styles.backToLogin, styles.dressifyTypo]}>
          Back to Login
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  dressifyTypo: {
    textAlign: "left",
    //fontFamily: FontFamily.interBold,
    fontWeight: "700",
  },
  enterotpChildLayout: {
    padding: 17,
    height: 50,
    width: 46,
    backgroundColor: Color.colorGainsboro,
    top: 262,
    position: "absolute",
  },
  rectangleLayout: {
    height: 48,
    width: 307,
    backgroundColor: Color.colorDarkcyan,
    borderRadius: Border.br_3xs,
    left: 40,
    position: "absolute",
  },
  nextTypo: {
    color: Color.colorLightgray,
    fontSize: FontSize.size_xl,
    textAlign: "left",
    //fontFamily: FontFamily.interBold,
    fontWeight: "700",
    position: "absolute",
   
  },
  dressify: {
    top: 64,
    left: 115,
    fontSize: FontSize.size_21xl,
    color: Color.colorDarkcyan,
    width: 180,
    height: 73,
    position: "absolute",
  },
  aVerificationCode: {
    top: 137,
    left: 75,
    fontSize: FontSize.size_mini,
    color: Color.colorGray_100,
    position: "absolute",
  },
  pleaseCheckYour: {
    top: 200,
    left: 40,
    fontSize: FontSize.size_smi,
    color: Color.colorSilver_100,
    position: "absolute",
  },
  enterotpChild: {
    left: 30,
    width: 46,
    backgroundColor: Color.colorGainsboro,
    top: 262,
  },
  enterotpItem: {
    left: 85,
    width: 46,
    backgroundColor: Color.colorGainsboro,
    top: 262,
  },
  enterotpInner: {
    left: 140,
    width: 46,
    backgroundColor: Color.colorGainsboro,
    top: 262,
  },
  rectangleTextinput: {
    left: 195,
    width: 46,
    backgroundColor: Color.colorGainsboro,
    top: 262,
  },
  enterotpChild1: {
    left: 250,
    width: 46,
    backgroundColor: Color.colorGainsboro,
    top: 262,
  },
  enterotpChild2: {
    left: 305,
    width: 46,
    backgroundColor: Color.colorGainsboro,
    top: 262,
  },
  rectangleTouchableopacity: {
    top: 353,
  },
  rectangleView: {
    top: 446,
  },
  next: {
    top: 365,
    left: 170,
  },
  resend: {
    top: 458,
    left: 160,
  },
  backToLogin: {
    fontSize: FontSize.size_base,
    color: Color.colorSilver_200,
  },
  backToLoginContainer: {
    left: 230,
    top: 559,
    position: "absolute",
  },
  enterotp: {
    backgroundColor: Color.colorWhite,
    flex: 1,
    width: "100%",
    height: 640,
    overflow: "hidden",
  },
});

export default EnterOtp;
