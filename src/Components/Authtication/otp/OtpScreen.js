import {
  View,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Keyboard,
  Alert,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import {styles} from '../otp/Styles';
import GlobalButton from '../../../atoms/GlobalButton';
import {text} from '../otp/OtpText';
import {globalColor} from '../../../locales/appColors';
import {GlobalContext} from '../../../context/provider';
import LinearGradient from 'react-native-linear-gradient';
import GlobalModal from '../../../atoms/GlobalModal';
import LoadingIndicator from '../../../atoms/LoadingIndicator';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import AntDesign from 'react-native-vector-icons/AntDesign';
import LoginScreen from '../login/LoginScreen';
import AsyncStorage from '@react-native-async-storage/async-storage';

const OtpScreen = ({navigation}) => {
  const context = React.useContext(GlobalContext);

  console.log('otpageeeeeee', context.otpState);
  console.log('new valuesssssssssss ', context);

  const [count, setCount] = useState(10);
  const [pin, setPin] = useState(new Array(4).fill(''));
  const [showModal, setShowModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (text, index) => {
    const newPin = [...pin];
    newPin[index] = text;

    setPin(newPin);
    if (text.length === 1 && index < 3) {
      this[`input${index + 1}`].focus();
    }
    if (text.length === 0 && index > 0) {
      this[`input${index - 1}`].focus();
    }
  };

  const handleVerify = async () => {
    const pinCode = pin.join('');
    const otpUrlVerify = await AsyncStorage.getItem('otpRecover');
    console.log(otpUrlVerify, 'new cheikingggggg');

    validUrl = otpUrlVerify
      ? 'http://13.48.156.8:4000/User-Apis/Recovery-Verify-OTP'
      : 'http://13.48.156.8:4000/User-Apis/Verify-OTP';

    console.log(pinCode.length, 'otp');
    if (pinCode.length === 4) {
      const otpScreenValues = {
        otp: pinCode,
        mobileNumber: context.otpState,
      };
      setIsLoading(true);
      const otpResponse = await fetch(validUrl, {
        method: 'POST',
        body: JSON.stringify(otpScreenValues),
        headers: {'Content-Type': 'application/json'},
      });
      let res = await otpResponse.json();
      console.log(res, 'kkkkkkkkkkk');
      if (res?.success == true) {
        setIsLoading(false);
        navigation.replace('Mode');
      } else {
        setShowModal(true);
        setIsLoading(false);
        setPin(new Array(4).fill(''));
      }
    } else {
      setShowModal(true);
    }
    setCount(10);
  };

  useEffect(() => {
    let interval = setInterval(() => {
      if (count > 0) {
        setCount(prev => prev - 1);
      }
    }, 1000);
    return () => {
      clearInterval(interval);
    };
  }, [count]);

  const resendOtp = async () => {
    console.log('Valid Phone Number APII CALLLALLALAAL', context.otpState);
    setIsLoading(true);
    const loginResponse = await fetch(
      'http://13.48.156.8:4000/User-Apis/User-Send-Otp',
      {
        method: 'POST',
        body: JSON.stringify({mobileNumber: context.otpState}),
        headers: {'Content-Type': 'application/json'},
      },
    );
    let res = await loginResponse.json();
    console.log('resssssss', res);
    if (res?.success == true) {
      setIsLoading(false);
    } else {
      setIsLoading(false);
    }
    setCount(10);
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.container} >

       
      {/* <LinearGradient colors={globalColor.bgColor} style={styles.container}> */}
        <Image
          style={styles.splashimagesmall}
          source={require('../../../assets/appLogo.png')}
        />
        <Text style={styles.boldText}>{text.verify}</Text>

        <Text style={styles.smalltext}>{text.phNumber}</Text>
        <View style={{flexDirection: 'row', columnGap: 10}}>
          <Text style={styles.smalltext}>{context.otpState}</Text>

          <AntDesign
            onPress={() => navigation.navigate('LoginScreen')}
            name="edit"
            size={25}
            color={globalColor.appPrimary}
          />
        </View>

        <View style={styles.inputContainer}>
          {pin.map((item, index) => (
            <TextInput
              key={index}
              placeholderTextColor="red"
              style={styles.pinInput}
              keyboardType="number-pad"
              maxLength={1}
              onChangeText={text => handleChange(text, index)}
              value={pin[index]}
              ref={ref => {
                this[`input${index}`] = ref;
              }}
              onKeyPress={({nativeEvent}) => {
                if (nativeEvent.key === 'Backspace' && index >= 0) {
                  this[`input${index - 1}`].focus();
                }
              }}
            />
          ))}
        </View>
        <View style={styles.btview}>
          <GlobalButton
            title="Verify"
            style={[
              styles.buttonStyle,
              {backgroundColor: globalColor.firstColor},
            ]}
            textStyle={styles.buttonText}
            onPress={handleVerify}
            // disable={pin.join('').length !== 4}
          />
          <View style={styles.resend}>
            <TouchableOpacity onPress={resendOtp} disabled={count !== 0}>
              <Text style={[styles.smalltext, {color: globalColor.firstColor}]}>
                Resend{' '}
              </Text>
            </TouchableOpacity>
            <Text style={styles.smalltext}> {count} sec</Text>
          </View>
        </View>
        {showModal && (
          <GlobalModal
            modalVisible={showModal}
            handleModelPress={() => setShowModal(false)}
            modalText={{
              buttonText: 'OK',
              headerValue: 'Ooops....!',
              inValid: 'Invalid OTP Number',
            }}
          />
        )}
        {isLoading && <LoadingIndicator />}
        </View>
      {/* </LinearGradient> */}
    </TouchableWithoutFeedback>
  );
};

export default OtpScreen;
