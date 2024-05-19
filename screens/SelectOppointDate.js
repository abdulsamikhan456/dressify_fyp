import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal, Pressable } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import { RadioButton } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';



const CustomCalendar = ({ route }) => {
  const navigation = useNavigation();
  const { selectedTailorShopName, selectedTailorShopAddress, selectedTailorEmail } = route.params;

  const [selectedDate, setSelectedDate] = useState(null);
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [isCalendarVisible, setCalendarVisible] = useState(false);
  const [isTimeSlotVisible, setTimeSlotVisible] = useState(false);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState(null);

  const handleBackPress = () => {
    navigation.goBack();
  };

  const daysInMonth = (month, year) => new Date(year, month + 1, 0).getDate();

  const getDaysArray = (month, year) => {
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const daysArray = [];
    for (let i = 1; i <= daysInMonth; i++) {
      daysArray.push(i);
    }
    return daysArray;
  };

  const renderCalendar = () => {
    const daysArray = getDaysArray(currentMonth, currentYear);
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    

    return (
      <View style={styles.calendarContainer}>
        <View style={styles.calendarHeaderContainer}>
          <TouchableOpacity onPress={() => changeMonth(-1)}>
            <AntDesign name="leftcircleo" size={24} color="black" />
          </TouchableOpacity>
          <Text style={styles.calendarHeaderText}>
            {new Date(currentYear, currentMonth).toLocaleString('default', { month: 'long', year: 'numeric' })}
          </Text>
          <TouchableOpacity onPress={() => changeMonth(1)}>
            <AntDesign name="rightcircleo" size={24} color="black" />
          </TouchableOpacity>
        </View>
        <View style={styles.dayNamesContainer}>
          {dayNames.map((dayName) => (
            <Text key={dayName} style={styles.dayName}>
              {dayName}
            </Text>
          ))}
        </View>
        <View style={styles.calendarDaysContainer}>
          {daysArray.map((day) => (
            <TouchableOpacity
              key={day}
              style={[styles.calendarDay, selectedDate === day && styles.selectedDay]}
              onPress={() => handleDayPress(day)}
            >
              <Text>{day}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    );
  };

  const changeMonth = (increment) => {
    const newMonth = currentMonth + increment;
    if (newMonth >= 0 && newMonth < 12) {
      setCurrentMonth(newMonth);
    } else {
      const newYear = currentYear + (increment > 0 ? 1 : -1);
      setCurrentYear(newYear);
      setCurrentMonth(increment > 0 ? 0 : 11);
    }
  };

  const handleDayPress = (day) => {
    const selectedDay = new Date(currentYear, currentMonth, day);
    setSelectedDate(selectedDay.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }));
    setCalendarVisible(false);
    // Show the time slot selection here
    setTimeSlotVisible(true);
  };

  const handleFindSlotPress = () => {
    setCalendarVisible(true);
  };

  const handleTimeSlotSelection = (timeSlot) => {
    setSelectedTimeSlot(timeSlot);
  };

  const handleProceedPress = () => {
    // Proceed to the next screen and pass necessary data
    navigation.navigate('SelectMeasurementMethod', {
      selectedDate,
      selectedTimeSlot,
      selectedTailorShopName,
      selectedTailorShopAddress,
      selectedTailorEmail,
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <TouchableOpacity style={styles.leftArrowContainer} onPress={handleBackPress}>
          <AntDesign name="leftcircleo" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.headerText}>Select Appointment Date</Text>
      </View>

      <TouchableOpacity onPress={() => setCalendarVisible(true)}>
        <Text style={styles.label}>Select Date</Text>
        <Text style={styles.selectedDate}>{selectedDate || 'Choose Date and Time slot'}</Text>
      </TouchableOpacity>

      <Modal
        animationType="slide"
        transparent={true}
        visible={isCalendarVisible}
        onRequestClose={() => setCalendarVisible(false)}
      >
        {renderCalendar()}
      </Modal>

      <TouchableOpacity style={styles.findSlotButton} onPress={handleFindSlotPress}>
        <Text style={styles.findSlotButtonText}>Find Slot</Text>
      </TouchableOpacity>

      <Modal
        animationType="slide"
        transparent={true}
        visible={isTimeSlotVisible}
        onRequestClose={() => setTimeSlotVisible(false)}
      >
        <View style={styles.timeSlotContainer}>
          <Text style={styles.timeSlotLabel}>Select Time Slot</Text>
          <View style={styles.radioButtonContainer}>
            <RadioButton
              value="9-12"
              status={selectedTimeSlot === '9-12' ? 'checked' : 'unchecked'}
              onPress={() => handleTimeSlotSelection('9-12')}
            />
            <Text style={styles.radioButtonLabel}>9:00 AM - 12:00 PM</Text>
          </View>
          <View style={styles.radioButtonContainer}>
            <RadioButton
              value="2-5"
              status={selectedTimeSlot === '2-5' ? 'checked' : 'unchecked'}
              onPress={() => handleTimeSlotSelection('2-5')}
            />
            <Text style={styles.radioButtonLabel}>2:00 PM - 5:00 PM</Text>
          </View>
          <Pressable style={styles.proceedButton} onPress={handleProceedPress}>
            <Text style={styles.proceedButtonText}>Proceed</Text>
          </Pressable>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    bottom: 245
  },
  leftArrowContainer: {
    marginRight: 10,
  },
  headerText: {
    fontSize: 18,
    fontWeight: 'bold',
    left: 55
  },
  label: {
    fontSize: 16,
    marginBottom: 10,
    fontWeight: 'bold',
    fontSize: 15,
    bottom: 190
  },
  selectedDate: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 20,
    padding: 10,
    fontSize: 16,
    bottom: 180
  },
  calendarContainer: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'white',
    marginTop: 100,
  },
  calendarHeaderContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  calendarHeaderText: {
    textAlign: 'center',
    fontSize: 20,
    fontWeight: 'bold',
  },
  dayNamesContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 10,
  },
  dayName: {
    width: 40,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  calendarDaysContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
  },
  calendarDay: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
  },
  selectedDay: {
    backgroundColor: '#3498db',
    borderColor: '#3498db',
    color: 'white',
  },
  findSlotButton: {
    backgroundColor: '#059FA5',
    paddingVertical: 15,
    alignItems: 'center',
    borderRadius: 5,
    marginTop: 20,
    bottom: 160
  },
  findSlotButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  timeSlotContainer: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'white',
    marginTop: 100,
    padding: 20,
  },
  timeSlotLabel: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  radioButtonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  radioButtonLabel: {
    marginLeft: 10,
    fontSize: 16,
  },
  proceedButton: {
    backgroundColor: '#059FA5',
    paddingVertical: 15,
    alignItems: 'center',
    borderRadius: 5,
    marginTop: 20,
  },
  proceedButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default CustomCalendar;
