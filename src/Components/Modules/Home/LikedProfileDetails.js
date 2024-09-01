import {View, Image, Text, TouchableOpacity} from 'react-native';
import React, {useEffect, useState} from 'react';
import {StyleSheet} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Entypo from 'react-native-vector-icons/Entypo';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {commonfonts} from '../../../locales/globalFontFamily';
import {globalColor} from '../../../locales/appColors';
import {ScrollView} from 'react-native-gesture-handler';
import {Modal, Portal, PaperProvider} from 'react-native-paper';
import {GlobalContext} from '../../../context/provider';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LoadingIndicator from '../../../atoms/LoadingIndicator';

const LikedProfileDetails = ({navigation, route}) => {


  
  
  console.log(route?.params?.userid, 'first id ')
  console.log(route?.params?.user_id,'second id')

  const context = React.useContext(GlobalContext);

  const [visible, setVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [likedData, setLikedData] = useState([]);



  const showModalPic = picUrl => {
    setSelectedImage(picUrl);
    setVisible(true);
  };

  const hideModal = () => setVisible(false);

  const likedProfileData = async () => {
    setIsLoading(true);
    const result = await AsyncStorage.getItem('userToken');
    profileInfoFirst = {

      profile_Id: route?.params?.userid ? route?.params?.userid:route?.params?.user_id,
      
    };
    const matchingResponse = await fetch(
      'http://13.48.156.8:4000/User-Apis/Profile-Detailes',
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
      setLikedData(res?.profiledata);
      console.log(res, 'like profile Dtaaaa');

      setIsLoading(false);
    } else {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    likedProfileData();
    console.log(likedData[0]?.name, '===========?');
  }, []);

  return (
    <PaperProvider>
      <View style={{flex: 1, backgroundColor: globalColor.headerColor}}>
        <View style={styles.matchinghead}>
          <Text style={styles.boldname}>
            {likedData[0]?.name},{likedData[0]?.subtext.slice(0, 2)}
          </Text>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Entypo name="circle-with-cross" size={28} color="white" />
          </TouchableOpacity>
        </View>

        <ScrollView>
          <View
            style={{
              width: wp(100),
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: -1,
              marginTop: hp(1),
              overflow: 'hidden',
            }}>
            <Image
              style={{
                height: hp(60),
                width: wp(92),
                resizeMode: 'cover',
                borderRadius: 15,
              }}
              source={{
                uri: likedData[0]?.profilePic[
                  likedData[0]?.profilePic.length - 1
                ],
              }}
            />
          </View>

          <View style={{position: 'relative', top: -hp(10)}}>
            <View
              style={{
                backgroundColor: 'white',
                borderTopLeftRadius: 40,
                borderTopRightRadius: 40,
                zIndex: 1,
                width: wp(92),
                height: 'auto',
                alignSelf: 'center',
                paddingHorizontal: wp(6),
                shadowColor: globalColor.black,
                backgroundColor: globalColor.white,
                shadowOffset: {
                  width: 0,
                  height: 0,
                },
                shadowOpacity: 0.58,
                shadowRadius: 16.0,
                elevation: 25,
                borderRadius: 30,
                paddingBottom: hp(5),
              }}>
              <View style={{marginVertical: hp(2), rowGap: 10}}>
                
                <Text style={styles.header}>Basic Info</Text>
                <View style={{flexDirection: 'row', columnGap: 10}}>
                  <Entypo name="graduation-cap" size={20} color="black" />
                  <Text style={styles.normal}>
                    {likedData[0]?.qulification_name}
                  </Text>
                </View>
                <View style={{flexDirection: 'row', columnGap: 10}}>
                  <Entypo name="suitcase" size={20} color="black" />
                  <Text style={styles.normal}>
                    {likedData[0]?.occupation_name}
                  </Text>
                </View>
                <View style={{flexDirection: 'row', columnGap: 10}}>
                  <Ionicons name="star" size={20} color="black" />
                  <Text style={styles.normal}>
                    Zodicsign : {likedData[0]?.zodicsign}
                  </Text>
                </View>
                <View style={{flexDirection: 'row', columnGap: 10}}>
                  <Entypo name="flag" size={20} color="black" />
                  <Text style={styles.normal}>
                    Religion : {likedData[0]?.religion}
                  </Text>
                </View>

                <Text style={styles.header}>Life Style</Text>
                <View style={{flexDirection: 'row', columnGap: 10}}>
                  <MaterialCommunityIcons
                    name="smoking"
                    size={20}
                    color="black"
                  />
                  <Text style={styles.normal}>
                    Smoke: -{likedData[0]?.smoke}
                  </Text>
                </View>
                <View style={{flexDirection: 'row', columnGap: 10}}>
                  <MaterialCommunityIcons
                    name="glass-wine"
                    size={20}
                    color="black"
                  />
                  <Text style={styles.normal}>
                    Drink: -{likedData[0]?.drink}
                  </Text>
                </View>
                <View style={{flexDirection: 'row', columnGap: 10}}>
                  <View>
                    <MaterialCommunityIcons
                      name="human-male-child"
                      size={20}
                      color="black"
                    />
                  </View>

                  <Text style={styles.normal}>
                    Children: -{likedData[0]?.children}
                  </Text>
                </View>

                <Text style={styles.header}>Interests</Text>

                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'center',
                    flexWrap: 'wrap',
                    alignContent: 'center',
                  }}>
                  <View style={styles.container}>
                    {likedData[0]?.interestsList?.map((interest, index) => (
                      <View key={index} style={styles.itemContainer}>
                        <Text style={styles.interest}>{interest}</Text>
                      </View>
                    ))}
                  </View>
                </View>
                <Text style={styles.header}>Images</Text>

                <View
                  style={{
                    flexDirection: 'row',
                    // width: wp(90),
                    justifyContent: 'space-evenly',
                    flexWrap: 'wrap',
                  }}>
                  {likedData[0]?.profilePic?.map((picUrl, picIndex) => (
                    <TouchableOpacity
                      key={picIndex}
                      onPress={() => showModalPic(picUrl)}>
                      <Image
                        style={{height: 70, width: 70, borderRadius: 35}}
                        source={{uri: picUrl}}
                      />
                    </TouchableOpacity>
                  ))}

                  <Portal>
                    <Modal visible={visible} onDismiss={hideModal}>
                      <View style={styles.matchinghead2}>
                        <Text style={styles.boldname}>
                          {likedData[0]?.name},{' '}
                          {likedData[0]?.subtext.slice(0, 2)}
                        </Text>
                        <TouchableOpacity onPress={hideModal}>
                          <Entypo
                            name="circle-with-cross"
                            size={28}
                            color="white"
                          />
                        </TouchableOpacity>
                      </View>
                      <Image
                        style={{
                          height: hp(95),
                          width: wp(100),
                        }}
                        source={{uri: selectedImage}}
                      />
                    </Modal>
                  </Portal>
                </View>
              </View>
            </View>
          </View>
          {isLoading && <LoadingIndicator />}
        </ScrollView>
      </View>
    </PaperProvider>
  );
};

export default LikedProfileDetails;

const styles = StyleSheet.create({
  header: {
    fontSize: hp(3),
    fontFamily: commonfonts.bold,
    color: globalColor.firstColor,
  },
  normal: {
    fontSize: hp(2),
    fontFamily: commonfonts.medium,
    color: 'black',
    width: wp(60),
  },
  boldname: {
    fontSize: hp(3),
    fontWeight: '800',
    color: 'white',
    marginLeft: wp(5),
    marginVertical: hp(1),
  },
  interesttext: {
    fontSize: hp(2),
    fontFamily: commonfonts.medium,
    color: 'black',
    marginVertical: hp(0.3),
  },
  matchinghead: {
    backgroundColor: globalColor.headerColor,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: wp(5),
    paddingVertical: hp(1),
    justifyContent: 'space-between',
  },
  matchinghead2: {
    backgroundColor: globalColor.headerColor,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: wp(5),
    paddingVertical: hp(2.5),
    justifyContent: 'space-between',
  },
  container: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: hp(1),
  },
  itemContainer: {
    borderWidth: 0.5,
    borderRadius: 10,
    paddingVertical: wp(1.5),
    paddingHorizontal: wp(2),
    marginLeft: wp(2.5),
    marginTop: hp(1),
    backgroundColor: globalColor.firstColor,
  },
  interest: {
    fontSize: hp(1.8),
    color: 'white',
  },
});
