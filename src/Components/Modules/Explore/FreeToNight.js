import {
  View,
  Text,
  StyleSheet,
  Image,
  ImageBackground,
  TouchableOpacity,
  Dimensions,Alert
} from 'react-native';
import React, {useEffect, useState} from 'react';
import Globalhaeder from '../../GlobalComponets/Globalhaeder';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Feather from 'react-native-vector-icons/Feather';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {commonfonts} from '../../../locales/globalFontFamily';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LoadingIndicator from '../../../atoms/LoadingIndicator';
import GlobalModal from '../../../atoms/GlobalModal';
import {globalColor} from '../../../locales/appColors';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {GlobalContext} from '../../../context/provider';
import LinearGradient from 'react-native-linear-gradient';
import {useFocusEffect} from '@react-navigation/native';
import {Modal} from 'react-native-paper';
import {TextInput} from 'react-native-gesture-handler';
import GlobalButton from '../../../atoms/GlobalButton';
import Entypo from 'react-native-vector-icons/Entypo';

const FreeToNight = ({navigation,route}) => {

  console.log(route?.params?.exploreId,'checkeeeedddddd')
  
  const context = React.useContext(GlobalContext);

  
  const [isLoading, setIsLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showModalPayent, setShowModalPayent] = useState(false);
  const [textmsg, setTextMsg] = useState(false);
  const [matchingUserId, setMatchingUserId] = useState(1);
  const [initiakLike, setInitialLike] = useState();
  const [rejectId, setRejectId] = useState(null);
  const [timeList, setTimeList] = useState([]);

  const containerStyle = {
    backgroundColor: 'white',
    padding: 20,
    width: wp(90),
    alignSelf: 'center',
    borderRadius: 10,
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


  const profileMatching = async () => {
    console.log('actionnnnnn');
    setIsLoading(true);
    const result = await AsyncStorage.getItem('userToken');
    profileInfoFirst = {
      // nextpr: 1,
      // modeid: context.modeId ? context.modeId : null,
      "explore_id" : route.params.exploreId
    };
    const matchingResponse = await fetch(
      'http://13.48.156.8:4000/User-Apis/Get-Matches',
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

    if (res?.success) {
      await context.profileMatchDispatch({
        type: 'ProfileMatch',
        payload: res.profileList,
      });

      if (res.profileList[0]) {
        setInitialLike(res.profileList[0].isLiked);
        setMatchingUserId(res.profileList[0]?.user_id);
      }

      setIsLoading(false);
    } else {
      setIsLoading(false);
    }
  };

  const rejectProfile = async () => {
    console.log('entry of undo profile API');
    const result = await AsyncStorage.getItem('userToken');
    const rejectID = await AsyncStorage.getItem('reject');
    setIsLoading(true);
    rejectedIdBody = {
      profile_Id: rejectID,
    };
    const rejectedResponse = await fetch(
      'http://13.48.156.8:4000/User-Apis/Profile-Detailes',
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
    console.log(res, 'in home page rejected API');
    if (res.success) {
      await context.profileMatchDispatch({
        type: 'ProfileMatch',
        payload: res.profiledata,
      });

      if (res?.profiledata[0]) {
        setInitialLike(res?.profiledata[0]?.isLiked);
        setMatchingUserId(res?.profiledata[0]?.user_id);
      }
      setRejectId(null);
      console.log(res, 'rjection profile dataaaaa=???????');
      // setRejectedData(res.data);
      setIsLoading(false);
    } else {
      setIsLoading(false);
    }
  };

  const handleHeartClick = async userId => {
    console.log(userId);
    const result = await AsyncStorage.getItem('userToken');
    setIsLoading(true);
    profileInfoFirst = {
      match_user: userId,
    };
    const likeResponse = await fetch(
      'http://13.48.156.8:4000/User-Apis/Likes',
      {
        method: 'POST',
        body: JSON.stringify(profileInfoFirst),
        headers: {
          'Content-Type': 'application/json',
          'x-access-token': JSON.parse(result),
        },
      },
    );
    let res = await likeResponse.json();
    if (res.success) {
      setIsLoading(false);
      setInitialLike(!initiakLike);
    } else {
      setIsLoading(false);
    }
  }
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
        const addValueList=res?.timeList?.map((each)=>{
          return{
            ...each,
            value:''
          }
        })
        setTimeList(addValueList);
        setIsLoading(false);
      } else {
        setIsLoading(false);
      }
    } catch (error) {
      console.error('Error fetching qualifications:', error);
      setIsLoading(false);
    }
  };

   
  // const handleSendClick = async userId => {
  //   console.log(userId);
  //   const result = await AsyncStorage.getItem('userToken');
  //   console.log(result,'tokennnnnnn')

  //   setIsLoading(true);
  //   let profileInfoFirst = {
  //     match_user_id: userId,
  //   };
  //   const likeResponse = await fetch(
  //     'http://13.48.156.8:4000/User-Apis/Send-Interest',
  //     {
  //       method: 'POST',
  //       body: JSON.stringify(profileInfoFirst),
  //       headers: {
  //         'Content-Type': 'application/json',
  //         'x-access-token': JSON.parse(result),
  //       },
  //     },
  //   );
  //   let res = await likeResponse.json();

  //   console.log(res,'koti duddu....')


  //   if (res?.success == true) {
  //     setTextMsg('Request sent successfully');
  //     setShowModal(true);
  //   } else {
  //     setIsLoading(false);
  //   }
  // };


  const handleSendClick = async () => {
    const offerStatus = await AsyncStorage.getItem('makeOffer');
    const parsedOfferStatus = JSON.parse(offerStatus);
    console.log(parsedOfferStatus,'0000000000')
    if (parsedOfferStatus) {
      console.log(parsedOfferStatus,'lllll')
      setShowModalPayent(true);
      await getTime();
    } else {
      console.log(parsedOfferStatus, '-----------------Second Check');
      sendRequest(matchingUserId);
    }
  };


  const backToMatching = async () => {
    setShowModalPayent(false);
    setTextMsg('Request sent successfully');
    setShowModal(true);
  }

  const sentRequestwithPayement = async matchId => {

    const isAllInputsFilled=timeList.every((each)=>each.value.length!==0)
 
     if (isAllInputsFilled) {

      const result = await AsyncStorage.getItem('userToken');
      setIsLoading(true);
  
      let priceListBody = {
        match_user_id: matchId,
        priceList: [
          {
            time: timeList[0].id,
            amount: timeList[0].value,
          }
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
        await backToMatching();
      } else {
        setIsLoading(false);
      }
      
     } else {
      Alert.alert("Please fill all the fields")
     }
    
   
  };

  const sendRequest = async userId => {
    console.log(userId, 'lllllll');
    const result = await AsyncStorage.getItem('userToken');
    setIsLoading(true);
    let profileInfoFirst = {
      match_user_id: userId,
    };
    const likeResponse = await fetch(
      'http://13.48.156.8:4000/User-Apis/Send-Interest',
      {
        method: 'POST',
        body: JSON.stringify(profileInfoFirst),
        headers: {
          'Content-Type': 'application/json',
          'x-access-token': JSON.parse(result),
        },
      },
    );
    let res = await likeResponse.json();
    console.log(res, '-------');

    if (res?.success == true) {
      setTextMsg('Request sent successfully');
      setShowModal(true);
    } else {
      setIsLoading(false);
    }
  };



  const handleCircleWithCrossClick = async userId => {
    console.log(userId);
    const result = await AsyncStorage.getItem('userToken');
    setIsLoading(true);
    profileInfoFirst = {
      match_user_id: userId,
    };
    const likeResponse = await fetch(
      'http://13.48.156.8:4000/User-Apis/Reject-Profile',
      {
        method: 'POST',
        body: JSON.stringify(profileInfoFirst),
        headers: {
          'Content-Type': 'application/json',
          'x-access-token': JSON.parse(result),
        },
      },
    );
    let res = await likeResponse.json();
    if (res?.success == true) {
      setRejectId(userId);
      setTextMsg('You have declined!');
      setShowModal(true);
    } else {
      setIsLoading(false);
    }
  };

  const getProfile = async () => {
    let rejectID = await AsyncStorage.getItem('reject');

    console.log(rejectID, 'llleflkn');
    if (rejectID == null) {
      console.log('profile matching');
      profileMatching();
    } else {
      rejectProfile();
      console.log('Reject profile Match');
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      console.log('kkkkk')
      const fetchData = async () => {
        await getProfile();
      };
      fetchData();
    }, [navigation, context.modeId]),
  );

 

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
        notify={
          <Ionicons
            onPress={() => navigation.navigate('Notifications')}
            name="notifications"
            size={30}
            color="white"
          />
        }
      />

      {rejectId && (
        <View
          style={{position: 'absolute', zIndex: 1, right: wp(7), top: hp(12)}}>
          <TouchableOpacity
            onPress={async () => {
              await AsyncStorage.setItem('reject', JSON.stringify(rejectId));
              // setRejectId(null);
              await navigation.navigate('Undo');
            }}>
            <Ionicons
              name="arrow-undo-circle-sharp"
              size={40}
              color={globalColor.headerColor}
            />
          </TouchableOpacity>
        </View>
      )}

      {context?.profileMatch && context?.profileMatch?.length > 0 ? (
        context?.profileMatch?.map((item, index) => (
          <View key={index} style={styles.container}>
            {item?.profilePic && item?.profilePic.length > 0 && (
              <ImageBackground
                style={{height: hp(100)}}
                source={{uri: item?.profilePic[item?.profilePic?.length - 1]}} >
                <LinearGradient
                  colors={['transparent', 'black', '#2E2E2E']}
                  style={styles.linearGradient}>
                  <View style={{position: 'absolute', bottom: hp(20)}}>
                    <View style={{flexDirection: 'row', alignSelf: 'center'}}>
                      <View>
                        <Text style={styles.title}>{item.name}</Text>
                        <Text style={styles.subtitle}>{item.subtext}</Text>
                      </View>
                      <TouchableOpacity
                        onPress={() =>
                          navigation.navigate('ProfileMatchingDetails')
                        }
                        style={styles.circle}>
                        <Feather name="chevrons-up" size={25} color="white" />
                      </TouchableOpacity>
                    </View>
                    {context?.profileMatch?.length > 0 && (
                      <View style={styles.itemsview}>
                        <TouchableOpacity
                          style={styles.circles}
                          onPress={() => handleHeartClick(matchingUserId)}>
                          <MaterialCommunityIcons
                            name={initiakLike ? 'heart' : 'heart-outline'}
                            size={40}
                            color="#F70000"
                          />
                        </TouchableOpacity>
                        <TouchableOpacity
                          style={styles.circles}
                          onPress={async () => {
                            await AsyncStorage.removeItem('reject');
                            setRejectId(null);
                            handleSendClick(matchingUserId);
                           
                          }}>
                          <MaterialCommunityIcons
                            name="check-circle"
                            size={40}
                            color="#007B02"
                          />
                        </TouchableOpacity>
                        <TouchableOpacity
                          style={styles.circles}
                          onPress={async () => {
                            await AsyncStorage.removeItem('reject');
                            setRejectId(null);
                            handleCircleWithCrossClick(matchingUserId);
                          }}>
                          <MaterialCommunityIcons
                            name="close-circle"
                            size={40}
                            color="#BF141B"
                          />
                        </TouchableOpacity>
                        <View>
                          <TouchableOpacity
                            style={styles.circles}
                            onPress={() => navigation.navigate('SuperSwipe')}>
                            <MaterialCommunityIcons
                              name="star-shooting"
                              size={40}
                              color="#182178"
                            />
                          </TouchableOpacity>
                        </View>
                      </View>
                    )}
                  </View>
                </LinearGradient>
              </ImageBackground>
            )}

            {isLoading && <LoadingIndicator />}
            {showModal && (
              <GlobalModal
                modalVisible={showModal}
                handleModelPress={async () => {
                  await profileMatching();
                  setShowModal(false);
                }}
                modalText={{
                  buttonText: 'OK',
                  headerValue: textmsg,
                  inValid: 'Done',
                }}
                headerText={styles.headerText}
                closeModal={()=>setShowModal(false)}
              />
            )}

{showModalPayent && (
              <Modal
                visible={showModalPayent}
                contentContainerStyle={containerStyle}>

<View style={{alignSelf: 'flex-end', marginBottom: hp(1)}}>
          <Entypo
            onPress={() =>  setShowModalPayent(false)}
            name="circle-with-cross"
            size={25}
            color="red"
          />
        </View>
                <Text style={styles.title2}>Make Offers</Text>
                <View
                  style={{
                    flexDirection: 'row',
                    flexWrap: 'wrap',
                    justifyContent: 'space-evenly',
                    paddingVertical: hp(3),
                    rowGap: 10,
                  }}>
                  {timeList.map((item, index) => (
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
                  onPress={() => sentRequestwithPayement(matchingUserId)}
                />
              </Modal>
            )}

          </View>
        ))
      ) : (
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
          <Text style={styles.nomatch}> No Matching Profiles </Text>
        </View>
      )}
    </View>
  );
};

export default FreeToNight;

const styles = StyleSheet.create({
  linearGradient: {
    position: 'absolute',
    height: '55%',
    bottom: 0,
    width: '100%',
    opacity: 6,
  },
  circles: {
    borderRadius:
      Math.round(
        Dimensions.get('window').width + Dimensions.get('window').height,
      ) / 2,
    width: Dimensions.get('window').width * 0.15,
    height: Dimensions.get('window').width * 0.15,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
  },
  circle: {
    borderRadius:
      Math.round(
        Dimensions.get('window').width + Dimensions.get('window').height,
      ) / 2,
    width: Dimensions.get('window').width * 0.11,
    height: Dimensions.get('window').width * 0.11,
    backgroundColor: globalColor.headerColor,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: wp(14),
  },
  title: {
    fontSize: hp(3),
    color: 'white',
    width: wp(60),
    fontFamily: commonfonts.bold,
  },
  title2: {
    fontSize: hp(2.5),
    color: globalColor.firstColor,
    // width: wp(60),
    fontFamily: commonfonts.bold,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: hp(2.5),
    color: 'white',
    width: wp(60),
    fontFamily: commonfonts.medium,
  },
  nomatch: {
    fontSize: hp(3),
    color: globalColor.firstColor,
    fontFamily: commonfonts.bold,
  },
  itemsview: {
    flexDirection: 'row',
    width: wp(100),
    justifyContent: 'space-evenly',
    marginTop: hp(8),
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
    width:wp(25),
    height:hp(5),
    borderRadius:5,
    fontSize:hp(2.2)
  },
  plat: {
    fontSize: hp(2),
    color: globalColor.firstColor,
    fontFamily: commonfonts.medium,
    marginVertical: hp(1),
    textAlign:'center'
  },
  timeBold: {
    textAlign: 'center',
    // fontFamily: commonfonts.bold,
    fontSize: hp(2),
    color: globalColor.firstColor,
  marginVertical:hp(1),
  
  },
});
