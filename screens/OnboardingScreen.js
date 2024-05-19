import { View, Text, StyleSheet, Dimensions, TouchableOpacity } from 'react-native'
import React from 'react'
import Onboarding from 'react-native-onboarding-swiper';
import Lottie from 'lottie-react-native';
import { useNavigation } from '@react-navigation/native';
import { setItem } from '../utils/asyncStorage';

const {width, height} = Dimensions.get('window');

export default function OnboardingScreen() {
    const navigation = useNavigation();

    const handleDone = ()=>{
        navigation.navigate('SignUp');
        setItem('onboarded', '1');
    }

    const doneButton = ({...props})=>{
        return (
            <TouchableOpacity style={styles.doneButton} {...props}>
                <Text>Done</Text>
            </TouchableOpacity>
        )
        
    }
  return (
    <View style={styles.container}>
      <Onboarding
            onDone={handleDone}
            onSkip={handleDone}
            // bottomBarHighlight={false}
            DoneButtonComponent={doneButton}
            containerStyles={{paddingHorizontal: 15}}
            pages={[
                {
                    backgroundColor: '#ffffff',
                    image: (
                        <View style={styles.lottie}>
                            <Lottie source={require('../assets/animations/tailor.json')} autoPlay loop />
                        </View>
                    ),
                    title: 'Dressify',
                    titleStyles: {
                        color: '#059FA5',
                    },
                    subtitle: 'The new era of Tailoring Industry',
                    subTitleStyles: {
                        color: '#2f343a',
                        fontSize: 15,
                        fontWeight: '500'                    }
                },
                {
                    backgroundColor: '#ffffff',
                    image: (
                        <View style={styles.lottie}>
                            <Lottie source={require('../assets/animations/maps.json')} autoPlay loop />
                        </View>
                    ),
                    title: 'Work Seamlessly',
                    titleStyles: {
                        color: '#059FA5',
                    },
                    subtitle: 'Tailoring Services at your door step',
                    subTitleStyles: {
                        color: '#2f343a',
                        fontSize: 15,
                        fontWeight: '500'                    }
                },
                {
                    backgroundColor: '#ffffff',
                    image: (
                        <View style={styles.lottie}>
                            <Lottie source={require('../assets/animations/3d.json')} autoPlay loop />
                        </View>
                    ),
                    title: 'Virtual Wordrobe ',
                    titleStyles: {
                        color: '#059FA5',
                    },

                    subtitle: 'A virtual wordrobe for your dressing collections',
                    subTitleStyles: {
                        color: '#2f343a',
                        fontSize: 15,
                        fontWeight: '500'                    }
                },
            ]}
        />
    </View>
  )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white'
    },
    lottie:{
        width: width*0.9,
        height: width
    },
    doneButton: {
        padding: 20,
        // backgroundColor: 'white',
        // borderTopLeftRadius: '100%',
        // borderBottomLeftRadius: '100%'
    }
})