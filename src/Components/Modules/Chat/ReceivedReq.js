import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Alert,
} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {Dimensions} from 'react-native';
import {commonfonts} from '../../../locales/globalFontFamily';
import LoadingIndicator from '../../../atoms/LoadingIndicator';
import GlobalModal from '../../../atoms/GlobalModal';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {globalColor} from '../../../locales/appColors';
import {Modal} from 'react-native-paper';
import Feather from 'react-native-vector-icons/Feather';
import Entypo from 'react-native-vector-icons/Entypo';
import {RadioButton} from 'react-native-paper';
import GlobalButton from '../../../atoms/GlobalButton';

const ReceivedReq = ({navigation}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [matchingData, setMatchingData] = useState([]);
  const [visible, setVisible] = useState(false);
  const [selectedMode, setSelectedMode] = useState(0);
  const [selectedItems, setSelectedItems] = useState();
  const [statusValue, setStatusValue] = useState('');
  const [selectedPayId, setSelectedPayId] = useState('');
  const [timeList, setTimeList] = useState([]);
  const [showModalPayent, setShowModalPayent] = useState(false);

  const containerStyle = {
    height: hp(60),
    marginTop: hp(40),
    paddingHorizontal: wp(3),
    borderRadius: 20,
    backgroundColor: '#FFBFA9',
  };

  const handleSelectMode = data => {
    console.log(data, 'kkk');
    setSelectedMode(data.offer_id);
    setSelectedPayId(data);
  };

  const handleAccept = async (item, status) => {
    console.log(item, 'kkkk');
    console.log(item, status, 'new Response');
    profileInfoFirst = {
      interest_sent_id: item.id,
      status: status,
      match_user_id: item.user_id,
    };

    console.log(profileInfoFirst, 'koti dududududduduuu');
    setIsLoading(true);
    const result = await AsyncStorage.getItem('userToken');
    console.log(result, 'Home pageToken');
    const matchingResponse = await fetch(
      'http://13.48.156.8:4000/User-Apis/Change-Interest-Request',
      {
        method: 'POST',
        body: JSON.stringify(profileInfoFirst),
        headers: {
          'Content-Type': 'application/json',
          'x-access-token': JSON.parse(result),
        },
      },
    );
    let res = await matchingResponse.json();
    if (res?.success == true) {
      profileMatching();
      setVisible(false);
      setIsLoading(false);
    } else {
      setIsLoading(false);
    }
  };

  const handleAcceptOne = (item, status) => {
    console.log('Koti Duddu', status);
    setSelectedItems(item);
    setStatusValue(status);
    if (item.offeredPriceList.length == 0 && status == 'accept') {
      getTime();
      setShowModalPayent(true);
    } else {
      setVisible(true);
    }
  };

  const reqSentMethod = async () => {
    const isAllInputsFilled = timeList.every(each => each.value.length !== 0);
    profileInfoFirst = {
      interest_sent_id: selectedItems?.id,
      status: statusValue,
      match_user_id: selectedItems?.user_id,
    };

    console.log('---?> value cheking', isAllInputsFilled);
    if (isAllInputsFilled) {
      setIsLoading(true);
      const result = await AsyncStorage.getItem('userToken');
      console.log(result, 'Home pageToken');
      const matchingResponse = await fetch(
        'http://13.48.156.8:4000/User-Apis/Change-Interest-Request',
        {
          method: 'POST',
          body: JSON.stringify(profileInfoFirst),
          headers: {
            'Content-Type': 'application/json',
            'x-access-token': JSON.parse(result),
          },
        },
      );
      let res = await matchingResponse.json();
      if (res?.success == true) {
        setIsLoading(false);
        sentRequestwithPayement(selectedItems?.user_id);
      } else {
        setIsLoading(false);
      }
    } else {
      Alert.alert('Please fill all the fields');
    }
  };

  const sentRequestwithPayement = async matchId => {
    console.log(matchId, 'crsssssssssss');
    const result = await AsyncStorage.getItem('userToken');
    setIsLoading(true);
    let priceListBody = {
      match_user_id: matchId,
      priceList: [
        {
          time: timeList[0].id,
          amount: timeList[0].value,
        },
      ],
    };
    const sentResponse = await fetch(
      'http://13.48.156.8:4000/User-Apis/Send-Interest',
      {
        method: 'POST',
        body: JSON.stringify(priceListBody),
        headers: {
          'Content-Type': 'application/json',
          'x-access-token': JSON.parse(result),
        },
      },
    );
    let res = await sentResponse.json();
    if (res?.success == true) {
      setIsLoading(false);
      setShowModalPayent(false);
      profileMatching();
    } else {
      setIsLoading(false);
    }
  };

  const handleAmountChange = (text, id) => {
    let changeList = timeList.map(each => {
      if (each.id === id) {
        each.value = text;
        return each;
      } else {
        return each;
      }
    });
    setTimeList(changeList);
    console.log(changeList, 'changedddd List');
  };

  const getTime = async () => {
    try {
      setIsLoading(true);
      const result = await AsyncStorage.getItem('userToken');
      const loginResponse = await fetch(
        'http://13.48.156.8:4000/User-Apis/Get-Time-List',
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
        const addValueList = res?.timeList?.map(each => {
          return {
            ...each,
            value: '',
          };
        });
        setTimeList(addValueList);
        console.log(res, 'Get Timessssss');
        setIsLoading(false);
      } else {
        setIsLoading(false);
      }
    } catch (error) {
      console.error('Error fetching qualifications:', error);
      setIsLoading(false);
    }
  };

  const statusFun = item => {
    console.log('itttttttt', item);
    let arr = [];
    if (item.status_text === 'Active') {
      arr.push(

          <View style={{flexDirection:'row'}}>
               <TouchableOpacity
          onPress={() => navigation.navigate('ChatScreen', {uid: item})}

          // onPress={() => Alert.alert('navigateee to chat screen')}
          // style={styles.active}
        >
          <AntDesign
            style={{marginLeft: wp(10)}}
            name="wechat"
            size={35}
            color={globalColor.firstColor}
          />
        </TouchableOpacity>

        {/* <TouchableOpacity
          // onPress={() => navigation.navigate('ChatScreen', {uid: item})}
          // onPress={() => Alert.alert('navigateee to chat screen')}
          // style={styles.active}
        >
          <AntDesign
            style={{marginLeft: wp(10)}}
            name="infocirlceo"
            size={30}
            color={globalColor.firstColor}
          />
        </TouchableOpacity> */}

          </View>
     
        
      );
    } else if (item.status_text === 'Pending') {
      arr.push(
        <View style={{flexDirection: 'row', marginLeft: wp(2), columnGap: 20}}>
          <TouchableOpacity onPress={() => handleAcceptOne(item, 'accept')}>
            <AntDesign name="checkcircle" size={40} color="green" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => handleAccept(item, 'decline')}>
            <AntDesign name="closecircle" size={40} color="#F70000" />
          </TouchableOpacity>
        </View>,
      );
    }
    return arr;
  };

  const ListItem = ({item}) => {
    if (item.status_text != 'Decline')
      return (
        <TouchableOpacity
        disabled={item.status_text == null}
          // disabled={item.status_text == 'Active' ? false : true}
          activeOpacity={1}
          // onPress={() => Alert.alert('navigateee')}
          // onPress={() => navigation.navigate('ChatScreen', {uid: item})}
          onPress={()=>navigation.navigate('LikedProfileDetails', item)}
          
          >
          <View style={styles.listItem}>
            <Image
              source={{
                uri: item.profilePic
                  ? item.profilePic
                  : 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRwubkKsF_lBiBVy3bWVkVN5Ema3oUrG08vTQ&usqp=CAU',
              }}
              style={styles.empolyeimage}
            />
            <View style={{marginLeft: wp(4), width: wp(40)}}>
              <Text style={styles.name}>{item.name}</Text>
              <Text style={styles.subtext}>{`Age: ${item.subtext}`}</Text>
            </View>
            {item && item?.status_text && statusFun(item)}
          </View>
        </TouchableOpacity>
      );
  };

  const profileMatching = async () => {
    setIsLoading(true);
    const result = await AsyncStorage.getItem('userToken');
    //  console.log(result,'Home pageToken')
    const matchingResponse = await fetch(
      'http://13.48.156.8:4000/User-Apis/Get-Interest-List',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-access-token': JSON.parse(result),
        },
      },
    );
    let res = await matchingResponse.json();
    const filteredData = res.received_interest.filter(item => item.status_text !== null);
      setMatchingData(filteredData);
    // setMatchingData(res.received_interest);
    // console.log(res.received_interest, 'koti duddu');
    if (res?.success == true) {
      setIsLoading(false);
    } else {
      // setShowModal(true);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      profileMatching();
    });
    // Return the function to unsubscribe from the event so it gets removed on unmount
    return unsubscribe;
  }, []);

  return (
    <View style={{flex: 1}}>
      {matchingData && matchingData.length > 0 ? (
        <FlatList
          data={matchingData}
          keyExtractor={item => item.id}
          renderItem={({item}) => <ListItem item={item} />}
        />
      ) : (
        <Text style={styles.nodata}>No data found</Text>
      )}

      <Modal visible={visible} contentContainerStyle={containerStyle}>
        <View
          style={{
            alignSelf: 'center',
            flexDirection: 'row',
            flexWrap: 'wrap',
            justifyContent: 'space-evenly',
            paddingVertical: hp(2),
            rowGap: 10,
          }}>
          {selectedItems?.offeredPriceList &&
            selectedItems?.offeredPriceList?.map(mode => (
              <View>
                <Text style={styles.timeBold}>{mode.time}hours</Text>
                <TouchableOpacity
                  onPress={() => handleSelectMode(mode)}
                  key={mode.offer_id}
                  style={styles.option}>
                  <RadioButton.Android
                    style={styles.radioCircle}
                    value={mode.name}
                    status={
                      selectedMode === mode.offer_id ? 'checked' : 'unchecked'
                    }
                    onPress={() => handleSelectMode(mode)}
                  />
                  <View style={styles.textContainer}>
                    <Text style={styles.title}>{mode.amount}</Text>
                  </View>
                </TouchableOpacity>
              </View>
            ))}
        </View>

        <View
          style={{
            flexDirection: 'row',
            alignSelf: 'center',
            columnGap: 30,
            // margin: 40,
          }}>
          <Feather
            onPress={() => handleAccept(selectedItems, 'accept')}
            name="check-circle"
            size={55}
            color="green"
          />
          <Feather
            onPress={() => setVisible(false)}
            name="x-circle"
            size={55}
            color="red"
          />
        </View>
      </Modal>

      {isLoading && <LoadingIndicator />}
      {showModal && (
        <GlobalModal
          modalVisible={showModal}
          handleModelPress={() => setShowModal(false)}
          modalText={{
            buttonText: 'OK',
            headerValue: 'Request sent successfully',
            inValid: '-------',
          }}
        />
      )}

      {showModalPayent && (
        <Modal visible={showModalPayent} contentContainerStyle={containerStyle}>
          <View
            style={{
              alignSelf: 'flex-end',
              marginBottom: hp(3),
              marginRight: wp(2),
            }}>
            <Entypo
              onPress={() => setShowModalPayent(false)}
              name="circle-with-cross"
              size={25}
              color="red"
            />
          </View>

          <View style={{marginBottom: hp(10)}}>
            <Text style={styles.title2}>Make Offers</Text>
            <View
              style={{
                flexDirection: 'row',
                flexWrap: 'wrap',
                justifyContent: 'space-evenly',
                paddingVertical: hp(3),
                rowGap: 10,
              }}>
              {timeList?.map((item, index) => (
                <View style={{marginRight: wp(3)}} key={item.id}>
                  <Text style={styles.timeBold}>{item.value_in_txt}</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="Amount"
                    keyboardType="numeric"
                    value={item.value}
                    onChangeText={text => handleAmountChange(text, item.id)}
                  />
                </View>
              ))}
            </View>

            <Text style={styles.plat}>Platform Charge 10%</Text>

            <GlobalButton
              title="Send"
              style={styles.button}
              onPress={() => reqSentMethod(selectedItems)}
            />
          </View>
        </Modal>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: hp(0.5),
    paddingHorizontal: wp(1),
    paddingVertical: hp(1.5),
    borderWidth: 1,
    borderRadius: 5,
    borderColor: '#ccc',
    marginHorizontal: wp(2),
  },
  disabledItem: {
    ...this.listItem,
    backgroundColor: '#ccc',
    opacity: 0.5,
    pointerEvents: 'none', // Disable user interaction
  },

  name: {
    fontSize: hp(2.2),
    fontFamily: commonfonts.bold,
  },
  subtext: {
    fontSize: hp(1.7),
    fontFamily: commonfonts.medium,
  },
  empolyeimage: {
    borderRadius:
      Math.round(
        Dimensions.get('window').width + Dimensions.get('window').height,
      ) / 2,
    width: Dimensions.get('window').width * 0.18,
    height: Dimensions.get('window').width * 0.18,
  },
  active: {
    // borderWidth: 1,
    height: hp(4),
    width: wp(25),
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    // backgroundColor: 'green',
  },
  nameActive: {
    fontSize: hp(2.2),
    fontFamily: commonfonts.medium,
    color: 'white',
  },
  nodata: {
    textAlign: 'center',
    fontSize: hp(3),
    fontFamily: commonfonts.bold,
    marginTop: hp(30),
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: globalColor.appSecondary,
    width: wp(30),
    height: hp(5),
    paddingVertical: hp(1),
    paddingHorizontal: wp(3),
    borderBottomWidth: 1,
    borderColor: '#ccc',
    borderRadius: 15,
    marginVertical: hp(1),
    marginHorizontal: wp(0.3),
  },
  radioCircle: {
    height: 30,
    width: 30,
    borderRadius: 15,
    borderWidth: 2,
    borderColor: globalColor.firstColor,
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectedRb: {
    width: 15,
    height: 15,
    borderRadius: 7.5,
    backgroundColor: globalColor.appPrimary,
  },
  textContainer: {
    marginLeft: wp(2),
  },
  title: {
    fontSize: hp(2),
    fontFamily: commonfonts.bold,
    color: globalColor.firstColor,
    width: wp(70),
  },
  description: {
    fontSize: hp(1.5),
    fontFamily: commonfonts.heading,
    color: globalColor.secondary,
    width: wp(70),
  },
  modebutton: {
    marginVertical: hp(5),
  },
  timeBold: {
    textAlign: 'center',
    fontFamily: commonfonts.bold,
    fontSize: hp(2),
  },
  button: {
    backgroundColor: globalColor.firstColor,
    width: wp(60),
    alignSelf: 'center',
    marginVertical: hp(2),
  },
  input: {
    borderWidth: 1,
    borderColor: globalColor.firstColor,
    width: wp(25),
    height: hp(5),
    borderRadius: 5,
    fontSize: hp(2.2),
  },
  plat: {
    fontSize: hp(2),
    color: globalColor.firstColor,
    fontFamily: commonfonts.medium,
    marginVertical: hp(1),
    textAlign: 'center',
  },
  timeBold: {
    textAlign: 'center',
    fontSize: hp(2),
    color: globalColor.firstColor,
    marginVertical: hp(1),
  },
  title2: {
    fontSize: hp(2.5),
    color: globalColor.firstColor,
    fontFamily: commonfonts.bold,
    textAlign: 'center',
  },
  active2: {
    paddingVertical: hp(1),
    paddingHorizontal: wp(1.5),
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    backgroundColor: 'orange',
    marginRight: wp(2),
  },
});

export default ReceivedReq;
