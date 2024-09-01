import {View, Image, Dimensions, FlatList, TouchableOpacity} from 'react-native';
import React, {useState, useEffect} from 'react';
import Globalhaeder from '../../GlobalComponets/Globalhaeder';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {Card, Text} from 'react-native-paper';
import {GlobalContext} from '../../../context/provider';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {StyleSheet} from 'react-native';
import {globalColor} from '../../../locales/appColors';
import {commonfonts} from '../../../locales/globalFontFamily';
import LinearGradient from 'react-native-linear-gradient';
import RazorpayCheckout from 'react-native-razorpay';
import GlobalModal from '../../../atoms/GlobalModal';
import LoadingIndicator from '../../../atoms/LoadingIndicator';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SuperSwipe = ({navigation,route}) => {


  // console.log(route?.params?.count.giftcount,'koriiriii')
  const [isLoading, setIsLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [giftLists, setGiftLists] = useState([]);
  const [transactionIdValue, setTransactionIdValue] = useState('');

  const context = React.useContext(GlobalContext);
  

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
    if (data?.razorpay_order_id) await paymentVerify(data, res.transactionid);
    else setIsLoading(false);
  };

  const paymentVerify = async (data, resof) => {
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
      'http://13.48.156.8:4000/Gifts-Api/Gift-Payment-Verify',
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
    setShowModal(true)
    
    } else {
      setIsLoading(false);
    }
  };

  const getGifts = async () => {
    try {
      setIsLoading(true);
      const result = await AsyncStorage.getItem('userToken');
      const loginResponse = await fetch(
        'http://13.48.156.8:4000/Gifts-Api/Gift-List/Sample',
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'x-access-token': JSON.parse(result),
          },
        },
      );
      let res = await loginResponse.json();
      if (res?.success == true) {
        setGiftLists(res?.giftList);
        setIsLoading(false);
      } else {
        setIsLoading(false);
      }
    } catch (error) {
      console.error('Error fetching qualifications:', error);
      setIsLoading(false);
    }
  };

  const sentGifts = async item => {
    const giftBodyDetails = {
      gift_id: item.gift_id,
      to_user_id: context?.profileMatch[0]?.user_id,
    };
    const result = await AsyncStorage.getItem('userToken');
    setIsLoading(true);
    const modeResponse = await fetch(
      'http://13.48.156.8:4000/Gifts-Api/Send-Gift',
      {
        method: 'POST',
        body: JSON.stringify(giftBodyDetails),
        headers: {
          'Content-Type': 'application/json',
          'x-access-token': JSON.parse(result),
        },
      },
    );
    let res = await modeResponse.json();
    if (res?.success == true) {
      setTransactionIdValue(res?.transactionid);
      handlePayment(res);
      setIsLoading(false);
    } else {
      setIsLoading(false);
    }
  };

  const renderItem = ({item}) => (
    <TouchableOpacity style={styles.itemContainer} onPress={() => sentGifts(item)}>
      <View >
        <View style={styles.itemCircle}>
          <Image source={{uri: item.ImagePathUrl}} style={styles.itemImage} />
        </View>

        <Text style={styles.itemTitle}>{item.gift_name}</Text>
        <Text style={styles.itemPrice}>₹{item.gift_price}</Text>
      </View>
    </TouchableOpacity>
  );

  // useEffect(() => {

  // }, [transactionIdValue]);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      getGifts();
    });
    return unsubscribe;
  }, [transactionIdValue]);

  return (
    <View style={{flex: 1}}>
      <Globalhaeder
        iconSide={
          <Ionicons
            onPress={() => navigation.navigate('DrawerNav')}
            name="arrow-back"
            size={30}
            color="white"
          />
        }
      />
      {/* <LinearGradient colors={globalColor.bgColor} style={styles.container}> */}
        <View style={{alignSelf: 'center'}}>
          <View style={{alignItems: 'center', justifyContent: 'center'}}>
            <Image
              style={styles.swipeImage}
              source={{
                uri: context?.profileMatch[0]?.profilePic[
                  context?.profileMatch[0]?.profilePic.length - 1
                ],
              }}
            />
          </View>
          <View>
            <Text style={styles.boldtext}>
              {context?.profileMatch[0]?.name}
            </Text>
            <Text style={styles.subtext}>
              {context?.profileMatch[0]?.subtext}
            </Text>
            <View style={{flexDirection: 'row', marginVertical: hp(0.4)}}>
              <Text style={styles.giftext}>Gifts Received</Text>
              <Text style={styles.giftext}> :{context.profileMatch[0].giftcount}</Text>
            </View>
          </View>
        </View>

        <View style={{width: wp(100), alignItems: 'center', marginTop: hp(5)}}>
          <FlatList
            data={giftLists}
            renderItem={renderItem}
            keyExtractor={item => item.id}
            horizontal
            scrollEnabled={false}
          />
        </View>
        {isLoading && <LoadingIndicator />}
        {showModal && (
          <GlobalModal
            modalVisible={showModal}
            handleModelPress={() => {
              setShowModal(false);
              navigation.navigate('Home');
            }}
            modalText={{
              buttonText: 'OK',
              headerValue: 'Yeah !',
              inValid: 'payment successful',
            }}
          />
        )}
      {/* </LinearGradient> */}
    </View>
  );
};

export default SuperSwipe;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  swipeImage: {
    borderRadius:
      Math.round(
        Dimensions.get('window').width + Dimensions.get('window').height,
      ) / 2,
    width: Dimensions.get('window').width * 0.25,
    height: Dimensions.get('window').width * 0.25,
    backgroundColor: globalColor.headerColor,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: hp(2),
    resizeMode: 'stretch',
  },
  boldtext: {
    fontSize: hp(3),
    color: globalColor.firstColor,
    fontFamily: commonfonts.bold,
    textAlign: 'center',
  },
  subtext: {
    fontSize: hp(2),
    color: globalColor.black,
    fontFamily: commonfonts.medium,
  },
  giftext: {
    fontSize: hp(2),
    color: globalColor.firstColor,
    fontFamily: commonfonts.medium,
  },

  itemContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: wp(2),
    borderRadius: 15,
    // borderWidth:1

  },
  itemImage: {
    // borderRadius:
    //   Math.round(
    //     Dimensions.get('window').width + Dimensions.get('window').height,
    //   ) / 2,
    // width: Dimensions.get('window').width * 0.25,
    // height: Dimensions.get('window').width * 0.25,
    // backgroundColor: globalColor.headerColor,
    // justifyContent: 'center',
    // alignItems: 'center',
    height:hp(12),
    width:wp(30),
    resizeMode:'cover',
   
  },
  itemCircle: {
    // borderRadius:
    //   Math.round(
    //     Dimensions.get('window').width + Dimensions.get('window').height,
    //   ) / 2,
    // width: Dimensions.get('window').width * 0.3,
    // height: Dimensions.get('window').width * 0.3,
    // backgroundColor: globalColor.headerColor,
    // justifyContent: 'center',
    // alignItems: 'center',
    // resizeMode: 'cover',
    // padding: 20,
    // borderWidth:1

  },
  itemDetails: {
    flex: 1,
  },
  itemTitle: {
    fontSize: hp(2.3),
    fontFamily: commonfonts.bold,
    color: 'black',
    marginVertical: hp(0.5),
    alignSelf: 'center',
  },
  itemPrice: {
    fontSize: hp(2),
    color: globalColor.firstColor,
    alignSelf: 'center',
    fontFamily: commonfonts.bold,
  },
});
