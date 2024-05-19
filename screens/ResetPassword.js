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

const ResetPassword = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.resetpassword}>
      <Text style={[styles.dressify, styles.resetTypo]}>Dressify</Text>
      <TextInput
        style={[styles.resetpasswordChild, styles.resetpasswordLayout]}
        secureTextEntry={true}
        placeholder="enter new password"
      />
      <TextInput
        style={[styles.resetpasswordItem, styles.resetpasswordLayout]}
        secureTextEntry={true}
        placeholder="re-type password"
      />
      <Text style={[styles.resetPassword, styles.resetPasswordPosition]}>
        Reset Password
      </Text>
      <Text
        style={[styles.yourNewPassword, styles.passwordTypo]}
      >{`Your new password must be different from 
previous one.`}</Text>
      <TouchableOpacity
        style={[styles.resetpasswordInner, styles.resetPasswordPosition]}
        activeOpacity={0.2}
        onPress={() => navigation.navigate("SuccessfullyChangedPass")}
      />
      <Text style={[styles.reset, styles.resetTypo]}>Reset</Text>
      <Text style={[styles.bothPasswordMust, styles.passwordTypo]}>
        Both password must be same
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  resetTypo: {
    textAlign: "left",
    //fontFamily: FontFamily.interBold,
    fontWeight: "700",
  },
  resetpasswordLayout: {
    padding: 10,
    height: 40,
    width: 301,
    borderWidth: 1,
    borderColor: Color.colorGray_200,
    borderStyle: "solid",
    borderRadius: Border.br_sm,
    left: 29,
    position: "absolute",
    backgroundColor: Color.colorWhite,
  },
  resetPasswordPosition: {
    left: 35,
    position: "absolute",
  },
  passwordTypo: {
    color: Color.colorSilver_100,
    left: 35,
    textAlign: "left",
    //fontFamily: FontFamily.interBold,
    fontWeight: "700",
    position: "absolute",
  },
  dressify: {
    top: 52,
    justifyContent: "center",
    alignItems: "center",
    left: 120,
    fontSize: FontSize.size_21xl,
    color: Color.colorDarkcyan,
    width: 180,
    height: 73,
    position: "absolute",
    //fontFamily: FontFamily.interBold,
    fontWeight: "700",
  },
  resetpasswordChild: {
    top: 243,
  },
  resetpasswordItem: {
    top: 327,
  },
  resetPassword: {
    top: 139,
    color: Color.colorBlack,
    fontSize: FontSize.size_mini,
    textAlign: "left",
    //fontFamily: FontFamily.interBold,
    fontWeight: "700",
  },
  yourNewPassword: {
    top: 169,
    fontSize: FontSize.size_smi,
  },
  resetpasswordInner: {
    top: 482,
    borderRadius: Border.br_3xs,
    backgroundColor: Color.colorDarkcyan,
    width: 307,
    height: 48,
  },
  reset: {
    top: 494,
    left: 160,
    fontSize: FontSize.size_xl,
    color: Color.colorLightgray,
    position: "absolute",
    //fontFamily: FontFamily.interBold,
    fontWeight: "700",
  },
  bothPasswordMust: {
    left: 35,
    top: 401,
    fontSize: FontSize.size_mini,
  },
  resetpassword: {
    margin: 5,
    flex: 1,
    width: "100%",
    height: 640,
    overflow: "hidden",
    backgroundColor: Color.colorWhite,
  },
});

export default ResetPassword;
