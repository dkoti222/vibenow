import React, {useState, useEffect, useRef} from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  SafeAreaView,
  FlatList,
  Keyboard,
  TouchableWithoutFeedback,
  Modal,
  Alert,
} from 'react-native';

import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import GlobalTextInput from '../../../atoms/GlobalTextInput';
import GlobalButton from '../../../atoms/GlobalButton';
import {styles} from '../login/Styles';
import {globalColor} from '../../../locales/appColors';
import {ActivityIndicator} from 'react-native-paper';
import {GlobalContext} from '../../../context/provider';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {commonfonts} from '../../../locales/globalFontFamily';
// import View from 'react-native-linear-gradient';
import GlobalModal from '../../../atoms/GlobalModal';
import LoadingIndicator from '../../../atoms/LoadingIndicator';
import AsyncStorage from '@react-native-async-storage/async-storage';
import OtpScreen from '../otp/OtpScreen';
import {BackHandler} from 'react-native';

const LoginScreen = ({navigation}) => {

  const context = React.useContext(GlobalContext);

  // console.log(context)
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef();
  const [showModal, setShowModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [myMsg, setMyMsg] = useState('');
  const [modalVisible, setModalVisible] = useState(false);

  const slides = [
    {
      id: 1,
      image: require('../../../assets/date.jpeg'),
      text: 'Romance ',
      subText: 'It is a long-established fact that a reader will be distracted',
    },
    {
      id: 2,
      image: require('../../../assets/bff.jpeg'),
      text: 'Friendship',
      subText: 'It is a long-established fact that a reader will be distracted',
    },
    {
      id: 3,
      image: require('../../../assets/bizz.jpeg'),
      text: 'Assistance',
      subText: 'It is a long-established fact that a reader will be distracted',
    },
  ];

  const changeSlider = () => {
    if (currentIndex >= 0 && currentIndex < slides.length - 1) {
      flatListRef.current.scrollToIndex({
        animated: true,
        index: currentIndex + 1,
      });
    } else {
      flatListRef.current.scrollToIndex({animated: true, index: 0});
    }
  };

  const DotIndicator = ({length, currentIndex}) => {
    return (
      <View style={styles.dotContainer}>
        {Array.from({length: length}).map((_, index) => (
          <View
            key={index}
            style={[
              styles.dot,
              currentIndex === index ? styles.activeDot : styles.inactiveDot,
            ]}
          />
        ))}
      </View>
    );
  };

  const isPhoneNumberValid = mobileNumber => {
    const phoneRegex = /^(\+\d{1,3})?\d{10}$/;
    return phoneRegex.test(mobileNumber);
  };

  const handleLogin = async () => {
    console.log('koti duddu');

    if (!isPhoneNumberValid(context.otpState)) {
      setShowModal(true);
    } else {
      await AsyncStorage.setItem(
        'PhNumberValue',
        JSON.stringify(context.otpState),
      );
      console.log('Valid Phone Number API CALL', context.otpState);
      setIsLoading(true);

      context.otpDispatch({type: 'Loader', payload: true});
      const loginResponse = await fetch(
        'http://13.48.156.8:4000/User-Apis/User-Send-Otp',
        {
          method: 'POST',
          body: JSON.stringify({mobileNumber: context.otpState}),
          headers: {'Content-Type': 'application/json'},
        },
      );
      let res = await loginResponse.json();
      OtpScreen;
      console.log(res, 'kkkkkk');
      if (res?.success == true) {
        context.otpDispatch({type: 'Loader', payload: false});
        setIsLoading(false);
        await navigation.replace('OtpScreen');
      } else {
        if (res?.is_deleted == true) {
          await AsyncStorage.setItem(
            'otpRecover',
            JSON.stringify(res?.is_deleted),
          );
          setModalVisible(true);
          console.log(res?.message, 'koti duddu');
          setMyMsg(res?.message);
          setIsLoading(false);
        }
        setIsLoading(false);
      }
    }
  };

  useEffect(() => {
    const backAction = () => {
      BackHandler.exitApp();
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );

    const timer = setInterval(() => {
      changeSlider();
    }, 4000);

    return () => {
      backHandler.remove();
      clearInterval(timer);
    };
  }, [currentIndex]);



  

  const reStoreAccount = async () => {
    const result = await AsyncStorage.getItem('userToken');
    setIsLoading(true);
    context.otpDispatch({type: 'Loader', payload: true});
    const loginResponse = await fetch(
      'http://13.48.156.8:4000/User-Apis//Recovery-Send-Otp',
      {
        method: 'POST',
        body: JSON.stringify({mobileNumber: context.otpState}),
        headers: {
          'Content-Type': 'application/json',
          'x-access-token': JSON.parse(result),
        },
      },
    );
    let res = await loginResponse.json();
    if (res?.success == true) {
      context.otpDispatch({type: 'Loader', payload: false});
      setIsLoading(false);
      
      await navigation.replace('OtpScreen');
    } else {
      setIsLoading(false);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
       
      <View  style={styles.Container}>
        <Image
          style={styles.splashimage}
          source={require('../../../assets/appLogo.png')}
        />

        <FlatList
          ref={flatListRef}
          data={slides}
          keyExtractor={item => item.id}
          horizontal
          pagingEnabled
          scrollEnabled={true}
          showsHorizontalScrollIndicator={false}
          renderItem={({item}) => (
            <View
              style={{
                borderRadius: 30,
                height: hp(30),
                width: wp(100),
                // borderWidth:1,
              }}>
              <Image source={item.image} style={styles.circleImage} />
              <Text
                style={{
                  alignSelf: 'center',
                  fontSize: hp(3.5),
                  marginVertical: hp(1),
                  fontFamily: 'MontserratAlternates-SemiBold',
                  color: globalColor.appPrimary,
                }}>
                {item.text}
              </Text>
            </View>
          )}
          onScroll={({nativeEvent}) => {
            const slide = Math.round(
              nativeEvent.contentOffset.x / nativeEvent.layoutMeasurement.width,
            );
            if (slide !== currentIndex) {
              setCurrentIndex(slide);
            }
          }}
        />
        <DotIndicator length={slides.length} currentIndex={currentIndex} />

        <GlobalTextInput
          placeholder="Enter Phone Number"
          keyboardType="numeric"
          iconName="phone"
          iconSize={25}
          iconColor={globalColor.appPrimary}
          value={context.otpState.toString()}
          maxLength={10}
          onChangeText={e => {
            context.otpDispatch({type: 'UPDATE_OTP', payload: e});
          }}
        />

        <View
          style={{
            width: wp(85),
            flexDirection: 'row',
            justifyContent: 'center',
            marginTop: hp(2),
            marginBottom: hp(5),
          }}>
          <Text style={{fontSize: hp(1.8), color: 'black'}}>
            By clicking Log in, you agree with our Terms and Conditions,
            <Text
              style={{
                color: globalColor.firstColor,
                fontSize: hp(1.8),
              }}
              onPress={() => navigation.navigate('Privacy')}>
              Privacy Policy & 
            </Text>
            <Text
              style={{
                color: globalColor.firstColor,
                fontSize: hp(1.8),
              }}
              onPress={() => navigation.navigate('TermsAndCondition')}>
              Terms & Conditions 
            </Text>
          </Text>
        </View>
        <View style={{marginBottom: hp(20)}}>
          <GlobalButton
            title="Get OTP"
            style={styles.button}
            onPress={handleLogin}
          />
        </View>
        {isLoading && <LoadingIndicator />}

        <GlobalModal
          modalVisible={showModal}
          handleModelPress={() => setShowModal(false)}
          modalText={{
            buttonText: 'OK',
            headerValue: 'Ooops....!',
            inValid: 'Invalid Phone Number',
          }}
        />

        <Modal animationType="slide" transparent={true} visible={modalVisible}>
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <Text style={styles.head}>{myMsg}</Text>

              <View
                style={{
                  flexDirection: 'row',
                  columnGap: 30,
                  marginVertical: hp(4),
                }}>
                <TouchableOpacity
                  style={styles.btModal}
                  onPress={() => setModalVisible(!modalVisible)}>
                  <Text style={styles.bttext}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.btModal}
                  onPress={() => reStoreAccount()}>
                  <Text style={styles.bttext}>ReStore</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </View>
    </TouchableWithoutFeedback>
  );
};

export default LoginScreen;
