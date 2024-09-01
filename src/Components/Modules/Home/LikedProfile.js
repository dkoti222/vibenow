import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { commonfonts } from '../../../locales/globalFontFamily';
import LoadingIndicator from '../../../atoms/LoadingIndicator';
import Globalhaeder from '../../GlobalComponets/Globalhaeder';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import { globalColor } from '../../../locales/appColors';


const LikedProfile = ({ navigation }) => {
  const [notificationData, setNotificationData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const getNotify = async () => {
    setIsLoading(true);
    const result = await AsyncStorage.getItem('userToken');

    const matchingResponse = await fetch(
      'http://13.48.156.8:4000/User-Apis/Get-List-Likes',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-access-token': JSON.parse(result),
        },
      },
    );
    let res = await matchingResponse.json();
    if (res?.success == true) {
      setNotificationData(res.likedProfilesList);
      setIsLoading(false);
    } else {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      getNotify();
    });
    return unsubscribe;
  }, []);

  const reMoveLikedProfile = async userId => {
    console.log(userId.userid, 'first one  checkingggg');
    const result = await AsyncStorage.getItem('userToken');
    setIsLoading(true);
    profileInfoFirst = {
      match_user: userId.userid,
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
      navigation.goBack()
    } else {
      setIsLoading(false);
    }
  };


  const renderItem = ({ item }) => (
    <TouchableOpacity onPress={() => handleItemPress(item)}>
      <View style={styles.itemContainer}>

          <View style={{flexDirection:'row',alignItems:'center'}}>
          <Image style={styles.circlename} source={{ uri: item.profilepic }} />
        <View>
          <Text style={styles.textname}>{item.name}</Text>
          <Text style={styles.text}>{item.agee}</Text>
        </View>
          </View>
      
        
          <MaterialCommunityIcons   
          onPress={()=>reMoveLikedProfile(item)}
          name="delete" size={25} color={globalColor.firstColor} />
      </View>
    </TouchableOpacity>
  );

  const handleItemPress = (item) => {
    console.log(item,'kkkkkkcheckkkkkk')
    navigation.navigate('LikedProfileDetails', item);
  };

  return (
    <View style={{ flex: 1 }}>
      <Globalhaeder  
      />
      {notificationData.length === 0 ? (
        <Text style={styles.nodata}>No data available</Text>
      ) : (
        <FlatList
          data={notificationData}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
        />
      )}
      {isLoading && <LoadingIndicator />}
    </View>
  );
};

const styles = StyleSheet.create({
  itemContainer: {
    flexDirection: 'row',
    justifyContent:'space-between',
    marginHorizontal: wp(2),
    marginTop: hp(1),
    borderRadius: 15,
    paddingVertical: hp(1.5),
    paddingHorizontal: wp(3.5),
    paddingRight:wp(15),
    backgroundColor: '#E0E1E6',
    alignItems: 'center',
  },
  text: {
    fontSize: hp(1.8),
  },
  textname: {
    fontSize: hp(2),
    color: 'black',
    fontFamily: commonfonts.regular,
    width: wp(40),

  },
  circlename: {
    borderRadius:
      Math.round(
        Dimensions.get('window').width + Dimensions.get('window').height,
      ) / 2,
    width: Dimensions.get('window').width * 0.15,
    height: Dimensions.get('window').width * 0.15,
    backgroundColor: '#E0E1E6',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: hp(2),
  },
  nodata: {
    textAlign: 'center',
    fontSize: hp(3),
    fontFamily: commonfonts.bold,
    marginTop: hp(30),
  },
});

export default LikedProfile;
