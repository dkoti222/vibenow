import {View, Text, StyleSheet, Image, TouchableOpacity, Alert, BackHandler} from 'react-native';
import React, {useEffect, useState} from 'react';
import GlobalDropDown from '../../atoms/GlobalDropDown';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {globalColor} from '../../locales/appColors';
import GlobalTextInput from '../../atoms/GlobalTextInput';
import LinearGradient from 'react-native-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LoadingIndicator from '../../atoms/LoadingIndicator';
import GlobalModal from '../../atoms/GlobalModal';

const Profile2 = ({navigation}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  

  const [selectedValues, setSelectedValues] = useState({
    zodiac: null,
    drink: null,
    smoke: null,
    children: null,
    religion: null,
    height: null,
  });
  const zodiacSigns = [
    'Aries',
    'Taurus',
    'Gemini',
    'Cancer',
    'Leo',
    'Virgo',
    'Libra',
    'Scorpio',
    'Sagittarius',
    'Capricorn',
    'Aquarius',
    'Pisces',
  ];

  const drink = ['Frequnetly', 'Socially', 'rarely', 'Never', 'Sober'];
  const smoke = ['Socially', 'Never', 'Regularly'];
  const childerns = [
    'Want SomeDay',
    'Have and want more',
    'Not sure yet',
    'Have Kids',
  ];
  const religion = ['Hindu', 'Christian',' Sikhism', 'Buddhist', 'Atheist', 'Catholic'];

  const handleInputChange = (field, value) => {
    setSelectedValues(prevState => ({...prevState, [field]: value}));
  };

  const form2Validation = async () => {

    if (
      selectedValues.height &&
      selectedValues.zodiac &&
      selectedValues.drink &&
      selectedValues.smoke &&
      selectedValues.children &&
      selectedValues.religion
    ) {
      const profileInfoSecond = {
        "height" : selectedValues.height,
        "zodicsign" :selectedValues.zodiac,
        "drink" : selectedValues.drink,
        "smoke" :selectedValues.smoke,
        "children" :selectedValues.children,
        "religion" :selectedValues.religion
    }
      console.log(profileInfoSecond)


      const result = await AsyncStorage.getItem('userToken');
      console.log(result,'token second')

      setIsLoading(true);
      const profiesecondResponse = await fetch(
        'http://13.48.156.8:4000/User-Apis/Add-Profile-info',
        {
          method: 'POST',
          body: JSON.stringify(profileInfoSecond),
           headers :{
            'Content-Type': 'application/json',
            'x-access-token':JSON.parse(result)
          },
        },
      );
      
      let res = await profiesecondResponse.json();
      // console.log(res,'addtionalllllll')
      
      if (res?.success == true) {
        // await AsyncStorage.setItem("userTokenProfileSecond",JSON.stringify(res.token))
        setIsLoading(false);
       await navigation.navigate('Interst');
      } else {
        setIsLoading(false);
        setShowModal(true)
      }

    } else{
      setShowModal(true);
    }
         
      
    
  };
  

  const heightRange = { start: 3, end: 7, step: 1 };

  const customButtonContainerStyle = {
    width: wp(85),
  };

  const customRowStyle = {
    width: wp(85),
    alignSelf: 'center',
  };

  useEffect(() => {
    const backAction = () => {
      Alert.alert(
        'Exit App',
        'Do you really want to exit?',
        [
          {
            text: 'Cancel',
            onPress: () => null,
            style: 'cancel',
          },
          { text: 'YES', onPress: () => BackHandler.exitApp() },
        ],
        { cancelable: false },
      );
      return true;
    };

    const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);

    return () => backHandler.remove();
  }, []);
  
  return (
    // <LinearGradient  colors={globalColor.bgColor} style={styles.Container}>
        <View style={styles.container}>

      
      <Image
        style={styles.splashimage}
        source={require('../../assets/appLogo.png')}
      />
      <Text
        style={{
          fontSize: hp(3),
          marginVertical: hp(4),
          color: globalColor.firstColor,
          fontWeight: '600',
        }}>
        {' '}
        Profile Creation
      </Text>
      <View style={styles.inputview}>
        <GlobalDropDown
          range={heightRange}
          placeholder="Select your Height"
          buttonContainerStyle={customButtonContainerStyle}
          rowStyle={customRowStyle}
          dropdownIcon="human-male-height"
          onValueChange={height => handleInputChange('height', height)}
        />
      </View>
      <View style={styles.inputview}>
        <GlobalDropDown
          data={zodiacSigns}
          placeholder="Select your ZodicSign"
          dropdownIcon="zodiac-gemini"
          onValueChange={zodiac => handleInputChange('zodiac', zodiac)}
        />
      </View>
      <View style={styles.inputview}>
        <GlobalDropDown
          data={drink}
          placeholder="Do You Drink"
          dropdownIcon="glass-wine"
          onValueChange={drink => handleInputChange('drink', drink)}
        />
      </View>
      <View style={styles.inputview}>
        <GlobalDropDown
          data={smoke}
          placeholder="Do You Smoke"
          dropdownIcon="cigar"
          onValueChange={smoke => handleInputChange('smoke', smoke)}
        />
      </View>
      <View style={styles.inputview}>
        <GlobalDropDown
          data={childerns}
          placeholder="would you like to have  children"
          dropdownIcon="human-male-female-child"
          onValueChange={children => handleInputChange('children', children)}
        />
      </View>
      <View style={styles.inputview}>
        <GlobalDropDown
          data={religion}
          placeholder="Identify Religion"
          dropdownIcon="rhombus-split"
          onValueChange={religion => handleInputChange('religion', religion)}
        />
      </View>
      <View style={{marginTop: hp(5)}}></View>
      <TouchableOpacity
        onPressIn={form2Validation}
        style={{position: 'absolute', bottom: 100, right: 50}}>
        <AntDesign
          name="rightcircle"
          size={55}
          color={globalColor.firstColor}
        />
      </TouchableOpacity>
      {isLoading && (
          <LoadingIndicator />
        )}
         {showModal && (
        <GlobalModal
      
          modalVisible={showModal}
          handleModelPress={() => setShowModal(false)}
          modalText={{
            buttonText: 'OK',
            headerValue: 'Ooops....!',
            inValid:  selectedValues ? 'Please Filled all Data' :'Invalid Response',
          }}
        />
      )}
    {/* </LinearGradient> */}
    </View>
  );
};

export default Profile2;

const styles = StyleSheet.create({
  container: {
    height: hp(100),
    width: wp(100),
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  inputview: {
    height: hp(6),
    marginVertical: hp(1),
  },
  splashimage: {
    height: hp(15),
    width: wp(50),
    resizeMode: 'contain',
    position: 'absolute',
    top: hp(5),
  },
});
