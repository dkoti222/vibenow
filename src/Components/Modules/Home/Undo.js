import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  Dimensions,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import RazorpayCheckout from 'react-native-razorpay';
import {commonfonts} from '../../../locales/globalFontFamily';
import {globalColor} from '../../../locales/appColors';
import GlobalButton from '../../../atoms/GlobalButton';
import Entypo from 'react-native-vector-icons/Entypo';
import Globalhaeder from '../../GlobalComponets/Globalhaeder';
import Ionicons from 'react-native-vector-icons/Ionicons';
import LinearGradient from 'react-native-linear-gradient';
import LoadingIndicator from '../../../atoms/LoadingIndicator';
import AsyncStorage from '@react-native-async-storage/async-storage';
import GlobalModal from '../../../atoms/GlobalModal';

const Undo = ({navigation, route}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [rejectData, setRejectedData] = useState({});
  const [showModal, setShowModal] = useState(false);

  const rejectProfile = async () => {
    console.log('entry of undo profile API');
    const result = await AsyncStorage.getItem('userToken');
    const rejectID = await AsyncStorage.getItem('reject');
    console.log('rejectid--------0-', rejectID);
    setIsLoading(true);
    rejectedIdBody = {
      profile_user_id: rejectID,
    };
    const rejectedResponse = await fetch(
      'http://13.48.156.8:4000/Gifts-Api/Undo-Match',
      {
        method: 'POST',
        body: JSON.stringify(rejectedIdBody),
        headers: {
          'Content-Type': 'application/json',
          'x-access-token': JSON.parse(result),
        },
      },
    );
    let res = await rejectedResponse.json();
    console.log(res, 'nooooooooooo');
    if (res.success) {
      console.log(res, 'intailllllllll output');
      setRejectedData(res.data);
      setIsLoading(false);
    } else {
      setIsLoading(false);
    }
  };

  const handleLogin = async () => {
    const result = await AsyncStorage.getItem('userToken');
    const rejectID = await AsyncStorage.getItem('reject');
    setIsLoading(true);
    rejectedIdBody = {
      profile_user_id: rejectID,
    };
    const rejectedResponse = await fetch(
      'http://13.48.156.8:4000/Gifts-Api/Undo-Match-Payment',
      {
        method: 'POST',
        body: JSON.stringify(rejectedIdBody),
        headers: {
          'Content-Type': 'application/json',
          'x-access-token': JSON.parse(result),
        },
      },
    );
    let res = await rejectedResponse.json();
    if (res.success) {
      handlePayment(res);
      setIsLoading(false);
    } else {
      setIsLoading(false);
      setIsLoading(true);
    }
  };

  const handlePayment = async res => {
    var options = {
      description: 'Credits towards consultation',
      image: 'https://i.imgur.com/3g7nmJC.png',
      currency: 'INR',
      key: 'rzp_test_8iVrHyxMbkmpFH',
      amount: '100',
      name: 'VibeNow',
      order_id: res?.orderdata?.id,
      prefill: {
        email: 'void@razorpay.com',
        contact: '9191919191',
        name: 'Razorpay Software',
      },
      theme: {color: '#F37254'},
    };
    let data = await RazorpayCheckout.open(options);
    // console.log(data,'secondddddddddd')
    if (data?.razorpay_order_id) await paymentVerify(data, res.transactionid);
    else setIsLoading(false);
  };

  const paymentVerify = async (data, resof) => {
    console.log(data, 'aaaaaaaaaaaaaaaaaaaa');

    let order_id = data?.razorpay_order_id;
    let paymentid = data?.razorpay_payment_id;
    let payment_signature = data?.razorpay_signature;
    let transactionId = resof;
    let paymentDetails = {
      order_id: order_id,
      payment_id: paymentid,
      payment_signature: payment_signature,
      transactionId: transactionId,
    };
    console.log('paymentDetails', paymentDetails);
    setIsLoading(true);
    const result = await AsyncStorage.getItem('userToken');
    const loginResponse = await fetch(
      'http://13.48.156.8:4000/Gifts-Api/Undo-Payment-Verify',
      {
        method: 'POST',
        body: JSON.stringify(paymentDetails),
        headers: {
          'Content-Type': 'application/json',
          'x-access-token': JSON.parse(result),
        },
      },
    );
    let res = await loginResponse.json();
    console.log(res, 'final Out Put');
    if (res?.success == true) {
      setIsLoading(false);
      setShowModal(true);
    } else {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    rejectProfile();
  }, []);

  return (
    <View style={{flex: 1}}>
      <Globalhaeder
        iconSide={
          <Ionicons
            // onPress={() => navigation.navigate('Home')}
            onPress={async () => {
              await AsyncStorage.removeItem('reject');
              navigation.navigate('Home');
            }}
            
            name="arrow-back"
            size={30}
            color="white"
          />
        }
      />
      <LinearGradient colors={globalColor.bgColor} style={{flex: 1}}>
        <Text style={styles.name}>Get Boost</Text>

        <View style={styles.circlename}>
          {rejectData && rejectData?.profilePic && (
            <Image
              style={styles.empolyeimage}
              source={{uri: rejectData?.profilePic}}
            />
          )}
        </View>

        <View>
          <Text style={styles.name2}>
            {rejectData.name},{rejectData.subtext}
          </Text>
        </View>

        <Text style={styles.back}>Back Track</Text>
        <Text style={styles.normalText}>
          Correct the mistake if you swiped left by accident
        </Text>
        <Text style={styles.money}>₹10</Text>
        <GlobalButton
          title="Pay Now"
          style={styles.button}
          onPress={handleLogin}
        />

        {isLoading && <LoadingIndicator />}
        {showModal && (
          <GlobalModal
            modalVisible={showModal}
            handleModelPress={() => {
              setShowModal(false);
              navigation.navigate('DrawerNav');
            }}
            modalText={{
              buttonText: 'OK',
              headerValue: 'Yeah !',
              inValid: 'payment successful',
            }}
          />
        )}
      </LinearGradient>
    </View>
  );
};

export default Undo;

const styles = StyleSheet.create({
  name: {
    fontSize: hp(3),
    fontFamily: commonfonts.bold,
    color: globalColor.firstColor,
    alignSelf: 'center',
    marginVertical: hp(3),
  },
  name2: {
    fontSize: hp(3),
    fontFamily: commonfonts.medium,
    color: globalColor.firstColor,
    alignSelf: 'center',
    marginVertical: hp(3),
  },
  back: {
    fontSize: hp(3),
    alignSelf: 'center',
    color: 'black',
    // marginVertical:hp(1)
  },
  normalText: {
    fontSize: hp(2),
    textAlign: 'center',
    color: 'grey',
    marginVertical: hp(1),
  },
  empolyeimage: {
    borderRadius:
      Math.round(
        Dimensions.get('window').width + Dimensions.get('window').height,
      ) / 2,
    width: Dimensions.get('window').width * 0.3,
    height: Dimensions.get('window').width * 0.3,
    borderWidth: 2,
  },
  circlename: {
    borderRadius:
      Math.round(
        Dimensions.get('window').width + Dimensions.get('window').height,
      ) / 2,
    width: Dimensions.get('window').width * 0.3,
    height: Dimensions.get('window').width * 0.3,
    backgroundColor: '#E0E1E6',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: hp(2),
    alignSelf: 'center',
  },
  button: {
    width: wp(60),
    marginBottom: hp(5),
    alignSelf: 'center',
  },
  money: {
    fontSize: hp(5),
    fontFamily: commonfonts.bold,
    textAlign: 'center',
    marginVertical: hp(3),
  },
});
