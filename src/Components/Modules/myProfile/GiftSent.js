import {View, Text, SafeAreaView, StyleSheet,TouchableOpacity,FlatList,Image, Dimensions} from 'react-native';
import React, {useEffect, useState} from 'react';
import Globalhaeder from '../../GlobalComponets/Globalhaeder';
import Ionicons from 'react-native-vector-icons/Ionicons';
import LoadingIndicator from '../../../atoms/LoadingIndicator';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
  } from 'react-native-responsive-screen';
import { commonfonts } from '../../../locales/globalFontFamily'


const GiftSent = ({navigation}) => {
  const [connectionData, setConnectionData] = useState([])
  const [isLoading, setIsLoading] = useState(false);
  
  const connectionList = async () => {
    setIsLoading(true);
    const result = await AsyncStorage.getItem('userToken');
    const connectionResponse = await fetch(
      'http://13.48.156.8:4000/Gifts-Api/Gift-Send-List/Send',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-access-token': JSON.parse(result),
        },
      },
    );
    let res = await connectionResponse.json();
    console.log(res);
    if (res?.success == true) {
        setConnectionData(res?.profileData);
      setIsLoading(false);
    } else {
      setIsLoading(false);
    }
  };


  const renderItem = ({ item }) => (

    <TouchableOpacity>

      <View style={styles.itemContainer}>
          <View style={{flexDirection:'row',alignItems:'center'}}>
          <Image style={styles.circlename} source={{ uri: item.profilePic }} />
          <View style={{}}>
            <Text  style={{fontSize:hp(1.8),color:'black',fontWeight:'500',marginVertical:hp(.5)}}>{item.name}</Text>
          <Text >{item.subtext}</Text>
          
            </View>
          </View>
  
          
           <View>
           <Image style={styles.circlename2} source={{ uri: item.gift_img_url }} />
          <Text >{item.giftname}</Text>
           </View>
        
  
      </View>
    </TouchableOpacity>
  );

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      connectionList();
    });

    return unsubscribe;
  }, []);

  return (
    <SafeAreaView style={styles.Container}>
      <Globalhaeder
        iconSide={
          <Ionicons
            onPress={() => navigation.goBack()}
            name="arrow-back"
            size={30}
            color="white"
          />
        }
      />

      {connectionData.length === 0 ? (
        <Text style={styles.nodata}>No data available</Text>
      ) : (
        <FlatList
          data={connectionData
        }
          keyExtractor={item => item.id}
          renderItem={renderItem}
        />
      )}
      {isLoading && <LoadingIndicator />}
    </SafeAreaView>
  );
};

export default GiftSent;

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
    flexDirection: 'row',
    alignItems:'center',
    justifyContent:'space-between',
    marginHorizontal:wp(2),
    marginTop:hp(1),
    backgroundColor: '#E0E1E6',
    borderRadius:15,
    paddingVertical: hp(1.5),
    paddingHorizontal: wp(2.5),
   paddingRight:wp(6)
  },
  circlename: {
    borderRadius:
      Math.round(
        Dimensions.get('window').width + Dimensions.get('window').height,
      ) / 2,
    width: Dimensions.get('window').width * 0.15,
    height: Dimensions.get('window').width * 0.15,
    backgroundColor: 'red',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: hp(2),
  },
  circlename2:{
    borderRadius:
    Math.round(
      Dimensions.get('window').width + Dimensions.get('window').height,
    ) / 2,
  width: Dimensions.get('window').width * 0.07,
  height: Dimensions.get('window').width * 0.07,
  justifyContent: 'center',
  alignItems: 'center',
  }
});
