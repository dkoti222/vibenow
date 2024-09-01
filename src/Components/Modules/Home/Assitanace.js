import {
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Image,
  Dimensions,
  Linking,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import Globalhaeder from '../../GlobalComponets/Globalhaeder';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import LoadingIndicator from '../../../atoms/LoadingIndicator';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {commonfonts} from '../../../locales/globalFontFamily';
import {globalColor} from '../../../locales/appColors';
import RazorpayCheckout from 'react-native-razorpay';

const Assitanace = ({navigation}) => {
  const [connectionData, setConnectionData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [payStatus, setPayStatus] = useState(false);

  const connectionList = async () => {
    setIsLoading(true);
    const result = await AsyncStorage.getItem('userToken');
    const connectionResponse = await fetch(
      'http://13.48.156.8:4000/User-Apis/Get-Assistance-Profiles?page=1',
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'x-access-token': JSON.parse(result),
        },
      },
    );
    let res = await connectionResponse.json();
    console.log(res);
    if (res?.success == true) {
      setConnectionData(res?.profilesData);
      setIsLoading(false);
    } else {
      setIsLoading(false);
    }
  };

  const openWhatsApp = phoneNumber => {
    let url = 'whatsapp://send?text=' + '&phone=' + phoneNumber;
    Linking.canOpenURL(url)
      .then(supported => {
        if (supported) {
          return Linking.openURL(url);
        } else {
          console.log('Please install WhatsApp');
        }
      })
      .catch(err => console.error('An error occurred', err));
  };

  // const openDialer = phoneNumber => {
  //   let url = `tel:${phoneNumber}`;
  //   Linking.canOpenURL(url)
  //     .then(supported => {
  //       if (supported) {
  //         return Linking.openURL(url);
  //       } else {
  //         console.log('Unable to open dialer');
  //       }
  //     })
  //     .catch(err => console.error('An error occurred', err));
  // };

  const renderItem = ({item}) => (
    <TouchableOpacity
      onPress={() => navigation.navigate('LikedProfileDetails', item)}
      activeOpacity={1}
      style={styles.itemContainer}>
      <View style={{flexDirection: 'row', alignItems: 'center'}}>
        <Image style={styles.circlename} source={{uri: item?.profilePic}} />
        <View style={{marginLeft: wp(3)}}>
          <View
            style={{flexDirection: 'row', alignItems: 'center', columnGap: 5}}>
            <Text style={{fontSize: hp(2.2), fontWeight: '500'}}>
              {item.name}
            </Text>
            <MaterialIcons name="verified" size={20} color="#1DA1F2" />
          </View>

          <Text style={{fontSize: hp(1.7), width: wp(40)}}>
            {item.occupation_name}
          </Text>
          <Text style={{fontSize: hp(1.7)}}>Experience :{item.experience}</Text>
          <View
            style={{flexDirection: 'row', alignItems: 'center', width: wp(40)}}>
            <Text>Charges: ₹{item.price} </Text>
            <Text style={{marginBottom: hp(0.2)}}>/per day</Text>
          </View>
        </View>
      </View>

      {/* {item.phone.length > 6 ? (
        <View
          style={{flexDirection: 'row', alignItems: 'center', columnGap: 20}}>
          <FontAwesome
            onPress={() => openDialer(item.phone)}
            name="phone-square"
            size={30}
            color={globalColor.firstColor}
          />

          <FontAwesome
            onPress={() => openWhatsApp(item.phone)}
            name="whatsapp"
            size={32}
            color="#075e54"
          />
        </View>
      ) : (
        <View style={{alignItems: 'center'}}>
          <View style={{flexDirection: 'row', columnGap: 5}}>
            <Text
              style={{
                marginVertical: hp(1),
                textDecorationLine: 'line-through',
              }}>
              ₹39
            </Text>
            <Text style={{marginVertical: hp(1), fontWeight: '900'}}>₹0</Text>
          </View>

          <TouchableOpacity
            style={{
              backgroundColor: 'green',
              height: hp(4),
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: 15,

              width: wp(25),
            }}
            onPress={() => assitancePaymet(item)}>
            <Text
              style={{color: 'white', fontSize: hp(1.7), fontWeight: '600'}}>
              Pay & Chat
            </Text>
          </TouchableOpacity>
        </View>
      )} */}
        {/* <View style={{marginRight:wp(5),alignItems:'center',justifyContent:'center'}}>
        <AntDesign
        onPress={ ()=> navigation.navigate('ChatScreen', {uid: item})}
                  name="wechat"
                  size={40}
                  color={globalColor.firstColor}
                />
        </View> */}

           <View style={{marginRight:wp(5),alignItems:'center',justifyContent:'center'}}>
           <FontAwesome
            onPress={() => openWhatsApp(item.phone)}
            name="whatsapp"
            size={32}
            color="#075e54"
          />
        </View>
     
       
    </TouchableOpacity>
  );

  const assitancePaymet = async id => {
    console.log(id?.user_id, 'koti duddu');
    const giftBodyDetails = {
      assitance_id: id?.user_id,
    };
    const result = await AsyncStorage.getItem('userToken');
    setIsLoading(true);
    const paymentResponse = await fetch(
      'http://13.48.156.8:4000/User-Apis/Make-Order',
      {
        method: 'POST',
        body: JSON.stringify(giftBodyDetails),
        headers: {
          'Content-Type': 'application/json',
          'x-access-token': JSON.parse(result),
        },
      },
    );
    let res = await paymentResponse.json();
    console.log(res, 'koti duddu');
    if (res?.success == true) {
      handlePayment(res);
      setIsLoading(false);
    } else {
      setIsLoading(false);
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
      'http://13.48.156.8:4000/User-Apis/Assitance-Verify-Payments',
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
      setPayStatus(true);
      setIsLoading(false);
    } else {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // const unsubscribe = navigation.addListener('focus', () => {
    connectionList();
    // });

    // return unsubscribe;
  }, [payStatus]);

  return (
    <SafeAreaView style={styles.Container}>
      {/* <Globalhaeder
        iconSide={
          <Ionicons
            onPress={() => navigation.goBack()}
            name="arrow-back"
            size={30}
            color="white"
          />
        }
      /> */}

      {}

      {connectionData.length === 0 ? (
        <Text style={styles.nodata}>No data available</Text>
      ) : (
        <FlatList
          data={connectionData}
          keyExtractor={item => item.id}
          renderItem={renderItem}
        />
      )}
      {isLoading && <LoadingIndicator />}
    </SafeAreaView>
  );
};

export default Assitanace;

const styles = StyleSheet.create({
  Container: {
    flex: 1,
  },
  nodata: {
    textAlign: 'center',
    fontSize: hp(3),
    fontFamily: commonfonts.bold,
    marginTop: hp(30),
  },
  itemContainer: {
    marginHorizontal: wp(2),
    marginTop: hp(1),
    paddingVertical: hp(2),
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: wp(4),
    backgroundColor: '#E0E1E6',
    borderRadius: 15,
  },
  circlename: {
    borderRadius:
      Math.round(
        Dimensions.get('window').width + Dimensions.get('window').height,
      ) / 2,
    width: Dimensions.get('window').width * 0.15,
    height: Dimensions.get('window').width * 0.15,
    justifyContent: 'center',
    alignItems: 'center',
    // marginHorizontal: hp(2),
  },
});
