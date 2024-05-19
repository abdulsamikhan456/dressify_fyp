import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, TouchableWithoutFeedback, Keyboard, KeyboardAvoidingView } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import { useNavigation } from "@react-navigation/native";

const Qchart = ({route}) => {
  const {selectedDate,
    selectedTimeSlot,
    selectedTailorShopName,
    selectedTailorShopAddress,
    selectedTailorEmail,
    measurementMethod,
    gender,} = route.params;
  const [heightFeet, setHeightFeet] = useState('');
  const [heightInches, setHeightInches] = useState('');
  const [neckSize, setNeckSize] = useState('');
  const [shoulderWidth, setShoulderWidth] = useState('');
  const [sleeveLength, setSleeveLength] = useState('');
  const [cuffCircumference, setCuffCircumference] = useState('');
  const [chestCircumference, setChestCircumference] = useState('');
  const [waistCircumference, setWaistCircumference] = useState('');
  const [damanCircumference, setDamanCircumference] = useState('');
  const [armholeCircumference, setArmholeCircumference] = useState('');
  const [kameezOnKneesLength, setKameezOnKneesLength] = useState('');
  const [kameezOffKneesLength, setKameezOffKneesLength] = useState('');
  const [shalwarLength, setShalwarLength] = useState('');
  const [paichaCircumference, setPaichaCircumference] = useState('');
  const navigation = useNavigation();

  const calculateMeasurements = () => {
    const totalHeight = parseInt(heightFeet) * 12 + parseInt(heightInches);
    const neckSizeValue = parseInt(neckSize);

    if (isNaN(totalHeight) || isNaN(neckSizeValue)) {
      alert('Please enter valid height and neck size.');
      return;
    }

    setShoulderWidth((totalHeight * 0.24).toFixed(2));
    setSleeveLength((totalHeight * 0.42).toFixed(2));
    setCuffCircumference((neckSizeValue * 2).toFixed(2));
    setChestCircumference((totalHeight * 0.44).toFixed(2));
    setWaistCircumference((totalHeight * 0.38).toFixed(2));
    setDamanCircumference((totalHeight * 0.44).toFixed(2));
    setArmholeCircumference((totalHeight * 0.28).toFixed(2));
    setKameezOnKneesLength((totalHeight * 0.55).toFixed(2));
    setKameezOffKneesLength((totalHeight * 0.65).toFixed(2));
    setShalwarLength((totalHeight * 0.5).toFixed(2));
    setPaichaCircumference((totalHeight * 0.38).toFixed(2));
  };

  const resetFields = () => {
    setHeightFeet('');
    setHeightInches('');
    setNeckSize('');
    setShoulderWidth('');
    setSleeveLength('');
    setCuffCircumference('');
    setChestCircumference('');
    setWaistCircumference('');
    setDamanCircumference('');
    setArmholeCircumference('');
    setKameezOnKneesLength('');
    setKameezOffKneesLength('');
    setShalwarLength('');
    setPaichaCircumference('');
  };

  const handleContinuePress = () => {
    navigation.navigate('MeasurementHome', {
      selectedDate,
    selectedTimeSlot,
    selectedTailorShopName,
    selectedTailorShopAddress,
    selectedTailorEmail,
    measurementMethod,
    gender,
      heightFeet,
      heightInches,
      neckSize,
      shoulderWidth,
      sleeveLength,
      cuffCircumference,
      chestCircumference,
      waistCircumference,
      damanCircumference,
      armholeCircumference,
      kameezOnKneesLength,
      kameezOffKneesLength,
      shalwarLength,
      paichaCircumference,
    });
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        <KeyboardAvoidingView style={styles.inner} behavior="padding">
          <TouchableOpacity style={{top: 25}} onPress={() => navigation.goBack()}>
            <AntDesign name="leftcircleo" size={24} color="black" />
          </TouchableOpacity>
          <Text style={{left: 95, fontSize: 20, fontWeight: 'bold'}}>Q* Measurement</Text>
          <Text></Text>

          <View style={styles.row}>
            <View style={styles.fieldContainer}>
              <Text>Shoulder Width:</Text>
              <TextInput
                style={styles.input}
                value={shoulderWidth}
                onChangeText={setShoulderWidth}
                keyboardType="numeric"
              />
            </View>
            <View style={styles.fieldContainer}>
              <Text>Sleeve Length:</Text>
              <TextInput
                style={styles.input}
                value={sleeveLength}
                onChangeText={setSleeveLength}
                keyboardType="numeric"
              />
            </View>
          </View>

          <View style={styles.row}>
            <View style={styles.fieldContainer}>
              <Text>Cuff Circumference:</Text>
              <TextInput
                style={styles.input}
                value={cuffCircumference}
                onChangeText={setCuffCircumference}
                keyboardType="numeric"
              />
            </View>
            <View style={styles.fieldContainer}>
              <Text>Chest Circumference:</Text>
              <TextInput
                style={styles.input}
                value={chestCircumference}
                onChangeText={setChestCircumference}
                keyboardType="numeric"
              />
            </View>
          </View>

          <View style={styles.row}>
            <View style={styles.fieldContainer}>
              <Text>Waist Circumference:</Text>
              <TextInput
                style={styles.input}
                value={waistCircumference}
                onChangeText={setWaistCircumference}
                keyboardType="numeric"
              />
            </View>
            <View style={styles.fieldContainer}>
              <Text>Daman Circumference:</Text>
              <TextInput
                style={styles.input}
                value={damanCircumference}
                onChangeText={setDamanCircumference}
                keyboardType="numeric"
              />
            </View>
          </View>

          <View style={styles.row}>
            <View style={styles.fieldContainer}>
              <Text>Armhole Circumference:</Text>
              <TextInput
                style={styles.input}
                value={armholeCircumference}
                onChangeText={setArmholeCircumference}
                keyboardType="numeric"
              />
            </View>
            <View style={styles.fieldContainer}>
              <Text>Kameez (On Knees):</Text>
              <TextInput
                style={styles.input}
                value={kameezOnKneesLength}
                onChangeText={setKameezOnKneesLength}
                keyboardType="numeric"
              />
            </View>
          </View>

          <View style={styles.row}>
            <View style={styles.fieldContainer}>
              <Text>Kameez (Off Knees):</Text>
              <TextInput
                style={styles.input}
                value={kameezOffKneesLength}
                onChangeText={setKameezOffKneesLength}
                keyboardType="numeric"
              />
            </View>
            <View style={styles.fieldContainer}>
              <Text>Shalwar Length:</Text>
              <TextInput
                style={styles.input}
                value={shalwarLength}
                onChangeText={setShalwarLength}
                keyboardType="numeric"
              />
            </View>
          </View>

          <View style={styles.horizontalLine} />
          <View style={styles.row}>
            <View style={styles.fieldContainer}>
              <Text style={styles.boldfont}>Height (feet):</Text>
              <TextInput
                style={[styles.input, styles.bigInput,styles.highlightedInput]}
                value={heightFeet}
                onChangeText={setHeightFeet}
                keyboardType="numeric"
              />
            </View>
            <View style={styles.fieldContainer}>
              <Text style={styles.boldfont}>Height (inches):</Text>
              <TextInput
                style={[styles.input, styles.bigInput, styles.highlightedInput]}
                value={heightInches}
                onChangeText={setHeightInches}
                keyboardType="numeric"
              />
            </View>
            <View style={styles.fieldContainer}>
              <Text style={styles.boldfont}>Neck Size (″):</Text>
              <TextInput
                style={[styles.input, styles.bigInput, styles.highlightedInput]}
                value={neckSize}
                onChangeText={setNeckSize}
                keyboardType="numeric"
              />
            </View>
          </View>

          <View style={styles.buttonRow}>
            <TouchableOpacity style={[styles.button, styles.generateButton]} onPress={calculateMeasurements}>
              <Text style={styles.buttonText}>Generate</Text>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.button, styles.resetButton]} onPress={resetFields}>
              <Text style={styles.buttonText}>Reset</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={styles.continueButton} onPress={handleContinuePress}>
            <Text style={styles.buttonText}>Continue</Text>
          </TouchableOpacity>
        </KeyboardAvoidingView>
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 15,
    marginBottom: 15,
    left: 10
  },
  inner: {
    width: '100%',
  },
  horizontalLine: {
    borderBottomColor: 'black',
    borderBottomWidth: 1,
    marginBottom: 20,
  },
  boldfont:{
    fontSizet: 15,
    fontWeight: 'bold'
  },
  highlightedInput: {
    backgroundColor: '#F0F8FF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
    width: '100%',
  },
  fieldContainer: {
    flex: 1,
    marginRight: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: 'black',
    padding: 10,
    borderRadius: 5,
  },
  bigInput: {
    fontSize: 16,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
    width: '100%',
  },
  button: {
    padding: 10,
    borderRadius: 5,
    width: '48%',
    alignItems: 'center',
  },
  generateButton: {
    backgroundColor: '#059FA5',
  },
  resetButton: {
    backgroundColor: '#FF6347',
  },
  continueButton: {
    backgroundColor: '#059FA5',
    right: 5,
    padding: 10,
    paddingLeft: 50,
    paddingRight: 50,
    borderRadius: 5,
    width: '100%',
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
  },
});

export default Qchart;