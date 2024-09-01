import React, { useEffect,useState } from'react';
import { View, Text, FlatList, Image, StyleSheet, Dimensions } from 'react-native';
import LoadingIndicator from '../../atoms/LoadingIndicator';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Globalhead from '../../atoms/Globalhead';
import Globalhaeder from '../GlobalComponets/Globalhaeder';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
  } from 'react-native-responsive-screen';
import { commonfonts } from '../../locales/globalFontFamily';


const Notifications = ({navigation}) => {

    const [notificationData,setNotificationData]=useState([])
    const [isLoading, setIsLoading] = useState(false);
  
    const getNotify = async () => {
        setIsLoading(true);
        const result = await AsyncStorage.getItem('userToken');
    
        console.log(result, 'Home pageToken');
        const matchingResponse = await fetch(
          'http://13.48.156.8:4000/User-Apis/Get-Notifications-List',
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'x-access-token': JSON.parse(result),
            },
          },
        );
        let res = await matchingResponse.json();
        setNotificationData(res.notifications_list);
        console.log(res.notifications_list, 'koti');
        if (res?.success == true) {
          setIsLoading(false);
        } else {
          setIsLoading(false);
        }
      };
  
  
        useEffect(()=>{
            getNotify()
        },[])

  const renderItem = ({ item }) => (
    <View style={styles.itemContainer}>
        <View>
        <Text style={styles.text}>{item.timeAgo}</Text>
        <Text style={styles.textname}>{item.nofifytext}</Text>
        </View>
        

      <Image style={styles.circlename} source={{ uri: item.profilepic }} />
    </View>
  );

  return (
    <View style={{flex:1}}>
       <Globalhaeder 
       
       iconSide={
        <Ionicons
          onPress={() => navigation.navigate("DrawerNav")}
          name="arrow-back"
          size={30}
          color="white"
        /> }
       
       />
     <FlatList
      data={notificationData}
      keyExtractor={(item) => item.id}
      renderItem={renderItem}
    />
     {isLoading && <LoadingIndicator />}
    </View>

   
  );
};

const styles = StyleSheet.create({
  itemContainer: {
     flexDirection:'row',
     justifyContent:'space-between',
     marginHorizontal:wp(2),
     marginTop:hp(1),
     borderRadius:15,
     paddingVertical:hp(1.5),
     paddingHorizontal:wp(2.5),
     backgroundColor: '#E0E1E6',
     alignItems:'center'
  },
  text: {
    fontSize:hp(1.8)
  
  },
  textname:{
 fontSize:hp(2),
 color:'black',
 fontFamily:commonfonts.regular,
 width:wp(67),
  },
 
  circlename: {
    borderRadius:
      Math.round(
        Dimensions.get('window').width + Dimensions.get('window').height,
      ) / 2,
    width: Dimensions.get('window').width * 0.2,
    height: Dimensions.get('window').width * 0.2,
    backgroundColor: '#E0E1E6',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: hp(2),

  },
  circle: {
    borderRadius:
      Math.round(
        Dimensions.get('window').width + Dimensions.get('window').height,
      ) / 2,
    width: Dimensions.get('window').width * 0.09,
    height: Dimensions.get('window').width * 0.09,

    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    top: hp(-1.5),
    left: wp(19),
   
  },
});

export default Notifications;
