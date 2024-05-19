import * as React from "react";
import {
  Text,
  StyleSheet,
  View,
  Pressable,
  TouchableOpacity,
} from "react-native";
// import { Image } from "expo-image";
import { useNavigation } from "@react-navigation/native";
import { FontFamily, FontSize, Color, Border } from "../GlobalStyles";

const SuccessfullyChangedPass = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.successfullychangedpass}>
      <Text
        style={[styles.youHaveSuccessfully, styles.goBackToLoginTypo]}
      >{`You have successfully changed
                your password.`}</Text>
      <View style={styles.successfullychangedpassChild} />
      <TouchableOpacity
        style={styles.goBackToContainer}
        activeOpacity={0.2}
        onPress={() => navigation.navigate("LoginScreen")}
      >
        <Text style={[styles.goBackToLogin, styles.goBackToLoginTypo]}>
          Go back to Login
        </Text>
      </TouchableOpacity>
      <Image
        style={styles.checkCircle1Icon}
        contentFit="cover"
        source={require("../assets/check-circle-1.png")}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  goBackToLoginTypo: {
    
    textAlign: "left",
    //fontFamily: FontFamily.interBold,
    fontWeight: "700",
    fontSize: FontSize.size_xl,
  },
  youHaveSuccessfully: {
    top: 351,
    left: 50,
    color: Color.colorBlack,
    position: "absolute",
  },
  successfullychangedpassChild: {
    top: 449,
    left: 40,
    borderRadius: Border.br_3xs,
    backgroundColor: Color.colorDarkcyan,
    width: 307,
    height: 48,
    position: "absolute",
  },
  goBackToLogin: {
    alignItems:"center",
    left: 20,
    color: Color.colorLightgray,
  },
  goBackToContainer: {
    left: 106,
    top: 461,
    position: "absolute",
  },
  checkCircle1Icon: {
    top: 140,
    left: 115,
    width: 158,
    height: 161,
    position: "absolute",
    overflow: "hidden",
  },
  successfullychangedpass: {
    backgroundColor: Color.colorWhite,
    flex: 1,
    width: "100%",
    height: 640,
    overflow: "hidden",
    
  },
});

export default SuccessfullyChangedPass;
