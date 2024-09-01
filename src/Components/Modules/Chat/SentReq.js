import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  StyleSheet,
  TouchableOpacity,
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
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {globalColor} from '../../../locales/appColors';
import AntDesign from 'react-native-vector-icons/AntDesign';

const SentReq = ({navigation}) => {
  
  const [isLoading, setIsLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [matchingData, setMatchingData] = useState([]);

  const profileMatching = async () => {
    setIsLoading(true);
    const result = await AsyncStorage.getItem('userToken');
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
    console.log(res, 'Home pageToken');
    
    //  console.log(res.sent_interest,'11')
    if (res?.success == true) {
      const filteredData = res.sent_interest.filter(item => item.status_text !== null);
      setMatchingData(filteredData);
      setIsLoading(false);
    } else {
      setIsLoading(false);
    }
  };

  const handleOnpress = item => {
    console.log(item, 'koit');
    navigation.navigate('ChatScreen', {uid: item});
  };

  const pendingData = item => {
    console.log(item, 'koti ');
    navigation.navigate('LikedProfileDetails', item);
  };
  const ListItem = ({item}) => {
    console.log('ststtsst', item.status_text);
    return (
      <TouchableOpacity
      disabled={item.status_text  == null}
        activeOpacity={1}
        onPress={() => {
          if (item.status_text === 'Active') {
            navigation.navigate('ChatScreen', {uid: item});
          } else {
            navigation.navigate('LikedProfileDetails', item);
          }
        }}>
        <View style={styles.listItem}>
          <Image
            source={{
              uri: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRwubkKsF_lBiBVy3bWVkVN5Ema3oUrG08vTQ&usqp=CAU',
            }}
            style={styles.empolyeimage}
          />

          <View style={{marginLeft: wp(4), width: wp(33)}}>
            <Text style={styles.name}>{item.name}</Text>
            <Text style={styles.subtext}>{`Age: ${item.subtext}`}</Text>
          </View>

          <TouchableOpacity
            style={{width: wp(40)}}
            onPress={
              item.status_text == 'Active'
                ? () => handleOnpress(item)
                : () => pendingData(item)
            }>
            {item.status_text == 'Active'? (
              <View style={{marginLeft: wp(20)}}>
                <AntDesign
                  name="wechat"
                  size={40}
                  color={globalColor.firstColor}
                />
              </View>
            ) : (
              <View style={{width: wp(40), flexDirection: 'row'}}>
                <View style={styles.active}>
                  <Text style={{color: 'white'}}>{item.status_text}</Text>
                </View>
                <TouchableOpacity   style={{alignItems:'center',justifyContent:'center'}} onPress={() => removeConnection(item)}>
                  <MaterialCommunityIcons name="delete" size={27} color={globalColor.firstColor} />
                </TouchableOpacity>
              </View>
            )}
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    );
  };

  const removeConnection = async itemList => {
    console.log(itemList, 'intiallll check');
    console.log(itemList.id, 'first check');
    console.log(itemList.user_id, 'second  check');
    // setIsLoading(true);
    const result = await AsyncStorage.getItem('userToken');
    const profileInfoFirst = {
      connet_id: itemList.id,
      to_user_id: itemList.user_id,
    };
    console.log(profileInfoFirst, '11111');
    console.log(result, '222222222');

    const matchingResponse = await fetch(
      'http://13.48.156.8:4000/User-Apis/Remove-Connect',
      {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'x-access-token': JSON.parse(result),
        },
        body: JSON.stringify(profileInfoFirst),
      },
    );
    let res = await matchingResponse.json();
    console.log(res, 'checkkkkkkkkkkkkk');
    if (res?.success == true) {
      setIsLoading(false);
      profileMatching();
    } else {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      profileMatching();
    });
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

  name: {
    fontSize: hp(2.2),
    fontFamily: commonfonts.medium,
  },
  subtext: {
    fontSize: hp(1.5),
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
    height: hp(4),
    width: wp(25),
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    backgroundColor: 'orange',
    marginRight: wp(2),
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
});

export default SentReq;
