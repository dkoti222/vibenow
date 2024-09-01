import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Image,
  ImageBackground,
  FlatList,ScrollView
} from 'react-native';
import uuid from 'react-native-uuid';
import React, {useEffect, useState} from 'react';
import Globalhaeder from '../../GlobalComponets/Globalhaeder';
import storage from '@react-native-firebase/storage';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Entypo from 'react-native-vector-icons/Entypo';
import AntDesign from 'react-native-vector-icons/AntDesign';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {commonfonts} from '../../../locales/globalFontFamily';
import Icon from 'react-native-vector-icons/FontAwesome';
import Icon2 from 'react-native-vector-icons/MaterialCommunityIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LoadingIndicator from '../../../atoms/LoadingIndicator';
import GlobalModal from '../../../atoms/GlobalModal';
import {globalColor} from '../../../locales/appColors';
import ImageCropPicker from 'react-native-image-crop-picker';
import {Modal} from 'react-native-paper';
import {Alert} from 'react-native';
import {GlobalContext} from '../../../context/provider';
import Share from 'react-native-share';


const data = [
  {id: '1', text: 'Share', iconName: 'angle-right'},
  {id: '2', text: 'Rating App', iconName: 'angle-right'},
  {id: '3', text: 'About App', iconName: 'angle-right'},
  {id: '4', text: 'Privacy & Policy', iconName: 'angle-right'},
  {id: '5', text: 'Terms & Conditions', iconName: 'angle-right'},
  {id: '6', text: 'Delete My Account', iconName: 'angle-right'},
];

const data2 = [
  {id: '1', text: 'Likes', iconName: 'heart'},
  {id: '2', text: 'Connections', iconName: 'handshake'},
  {id: '3', text: 'Sent', iconName: 'gift'},
  {id: '4', text: 'Received', iconName: 'gift'},
];

const MyProfile = ({navigation}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [profileDetails, setProfileDetails] = useState(null);
  const [textmsg, setTextMsg] = useState('');
  const [editImage, setEditImage] = useState(false);
  const [visible, setVisible] = useState(false);
  const [logout, setLogOut] = useState(false);

  const showModalPic = () => setVisible(true);
  const hideModalPic = () => setVisible(false);

  const context = React.useContext(GlobalContext);

  const containerStyle = {
    backgroundColor: 'white',
    paddingHorizontal: wp(4),
    paddingTop: hp(1),
    paddingBottom: hp(4),
    width: wp(80),
    alignSelf: 'center',
    rowGap: 10,
    borderRadius: 10,
  };

  const handleLogout = async () => {
    await AsyncStorage.clear();
    setShowModal(false);
    context.otpDispatch({type: 'UPDATE_OTP', payload: ''});
    navigation.replace('SplashScreen');
  };

  const getProfileDetails = async () => {
    try {
      setIsLoading(true);
      const result = await AsyncStorage.getItem('userToken');
      console.log(result);
      const matchingResponse = await fetch(
        'http://13.48.156.8:4000/User-Apis/Get-User-Deatails',
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'x-access-token': JSON.parse(result),
          },
        },
      );
      let res = await matchingResponse.json();
      setProfileDetails(res.userdetails);
      console.log(res.userdetails?.profilePic[2]?.pic_location, 'testing');
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching qualifications:', error);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      getProfileDetails();
    });
    return unsubscribe;
  }, []);

 

  

  const renderItem = ({item}) => (
    <TouchableOpacity
      style={styles.itemContainer}
      onPress={() => handleItemPress(item)}>
      <Text style={styles.text2}>{item.text}</Text>
      <Icon name={item.iconName} size={30} color="#272727" />
    </TouchableOpacity>
  );

  const renderItem2 = ({item}) => {
    let textColor = '#e67e22';
    let textPrefix = '';
    if (item.id === '1') {
      textColor = 'red';
      textPrefix = profileDetails?.likecount;
    } else if (item.id === '2') {
      textColor = '#d35400';
      textPrefix = profileDetails?.connectcount;
    } else if (item.id === '3') {
      textColor = '#d35400';
      textPrefix = profileDetails?.send_giftcount;
    } else if (item.id === '4') {
      textColor = '#d35400';
      textPrefix = profileDetails?.received_giftcount;
    }
    return (
      <TouchableOpacity
        style={styles.itemContainer2}
        onPress={() => handleItemPress2(item)}>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <Icon2 name={item.iconName} size={25} color={textColor} />
          <Text style={styles.textbox}> {textPrefix}</Text>
        </View>
        <Text style={[styles.textbox, {width: wp(27)}]}>{item.text}</Text>
      </TouchableOpacity>
    );
  };


     
 

  const shareApp = () => {
    const applicationId = 'com.vibenoww';
    const options = {
      title: 'Share Via',
      message: 'Check out this cool app on Google Play!',
      url: 'https://play.google.com/store/apps/details?id=' + applicationId,
      social: Share.Social.WHATSAPP,
    };
    Share.open(options)
      .then((res) => {
        console.log('Response after share', res);
      })
      .catch((err) => {
        console.error('Error occurred while sharing', err);
      });
  };
  
  

  


  const handleItemPress = item => {
    if (item.id === '1') {
      shareApp()
    } else if (item.id === '2') {
      shareApp()
    } else if (item.id === '3') {
      navigation.navigate('About');
    } else if (item.id === '4') {
      navigation.navigate('Privacy');
    } else if (item.id === '5') {
      navigation.navigate('TermsAndCondition');
    } else if (item.id === '6') {
      setShowModal(true);
      setTextMsg('Are you sure you want to Delete Your Account?');
    }
  };

  const handleItemPress2 = item => {
    if (item.id === '1') {
      navigation.navigate('Liked');
    } else if (item.id === '2') {
      navigation.navigate('Connection');
    } else if (item.id === '3') {
      navigation.navigate('GiftSent');
    } else if (item.id === '4') {
      navigation.navigate('GiftReceived');
    }
  };

  const updateImage = async val => {
    console.log(val);
    setVisible(false);
    try {
      let image;
      if (val === 'camera') {
        image = await ImageCropPicker.openCamera({
          width: 300,
          height: 400,
          cropping: true,
        });
      } else if (val === 'gallery') {
        image = await ImageCropPicker.openPicker({
          width: 300,
          height: 400,
          cropping: true,
        });
      }
      const imageUri = image.path;
      console.log('first step');
      setIsLoading(true);
      console.log('second step');
      const reference = storage().ref(`userImages/${uuid.v4()}`);
      await reference.putFile(imageUri);
      const downloadURL = await reference.getDownloadURL();
      console.log(downloadURL, 'koti duddu');

      const result = await AsyncStorage.getItem('userToken');
      let profileInfoFirst = {
        imageslink: downloadURL,
      };
      console.log(result, 'Home pageToken');
      const matchingResponse = await fetch(
        'http://13.48.156.8:4000/User-Apis/Update-User-image',
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
      console.log(res, 'jjjjjjjjj');
      if (!res?.success) {
        setEditImage(imageUri);
        setIsLoading(false);
      } else {
        setIsLoading(false);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const deleteMyAccount = async () => {
    console.log('kkkkk');
    const result = await AsyncStorage.getItem('userToken');
    setIsLoading(true);
    deletedBody = {
      reason: 'The item is no longer needed',
    };
    const deleteResponse = await fetch(
      'http://13.48.156.8:4000/User-Apis/Delete-User',
      {
        method: 'POST',
        body: JSON.stringify(deletedBody),
        headers: {
          'Content-Type': 'application/json',
          'x-access-token': JSON.parse(result),
        },
      },
    );

    let res = await deleteResponse.json();
    console.log('response', res);
    if (res?.success == true) {
      // setTextMsg('Your Profile Deleted')
      setShowModal(false);
      setIsLoading(false);
      navigation.navigate('LoginScreen');
    } else {
      setIsLoading(false);
    }
  };

  return (
    <View style={{flex: 1}}>
      <ImageBackground
        style={{flex: 1}}
        source={require('../../../assets/frame.png')}>
        <Globalhaeder
          notify={
            <FontAwesome5
              onPress={() => {
                setShowModal(true);
                setTextMsg('Are you sure you want to logout ?');
                setLogOut(true);
              }}
              name="sign-out-alt"
              size={30}
              color='white'
            />
          }
        />

        <ScrollView>
          <View
            style={{
              height: hp(20),
              width: wp(90),
              backgroundColor: '#E0E1E6',
              flexDirection: 'row',
              alignItems: 'center',
              alignSelf: 'center',
              borderRadius: 5,
              marginTop: hp(1),
            }}>
            <View style={styles.circlename}>
              {profileDetails &&
              profileDetails.profilePic &&
              profileDetails?.profilePic[0]?.pic_location ? (
                <Image
                  style={styles.empolyeimage}
                  source={{
                    uri: editImage
                      ? editImage
                      : profileDetails?.profilePic[0]?.pic_location,
                  }}
                />
              ) : (
                <Image
                  style={styles.empolyeimage}
                  source={{
                    uri: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRwubkKsF_lBiBVy3bWVkVN5Ema3oUrG08vTQ&usqp=CAU',
                  }}
                />
              )}

              <View style={styles.circle}>
                <MaterialCommunityIcons
                  onPress={showModalPic}
                  name="camera-plus"
                  size={25}
                  color="white"
                />
              </View>
            </View>

            <View style={{marginHorizontal: wp(2)}}>
              <View style={{flexDirection: 'row', width: wp(48)}}>
                <Text style={styles.name}>{profileDetails?.name}</Text>
                <MaterialCommunityIcons
                  name="check-decagram"
                  size={25}
                  color="green"
                />
              </View>

              <Text style={styles.text}>
                {profileDetails?.occupation_name} - {profileDetails?.agetext}{' '}
              </Text>
              <TouchableOpacity
                onPress={() => navigation.navigate('EditProfile')}
                style={styles.edit}>
                <Text style={styles.editText}>Edit Profile</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View
            style={{
              marginTop: hp(2),
              marginBottom: hp(1),
              marginHorizontal: wp(5),
            }}>
            <FlatList
              data={data2}
              keyExtractor={item => item.id}
              numColumns={2}
              renderItem={renderItem2}
            />
          </View>

          <View style={{marginTop: hp(2), marginBottom: hp(1)}}>
            <FlatList
              data={data}
              keyExtractor={item => item.id}
              renderItem={renderItem}
            />
          </View>
        </ScrollView>
      </ImageBackground>

      {isLoading && <LoadingIndicator />}
      {showModal && (
        <GlobalModal
          modalVisible={showModal}
          handleModelPress={
            logout ? () => handleLogout() : () => deleteMyAccount()
          }
          modalText={{
            buttonText: 'Yes',
            headerValue: textmsg,
            // inValid:
          }}
          headerText={styles.headerText}
          closeModal={() => setShowModal(false)}
          buttonWidth={wp(30)}
        />
      )}
      <Modal
        visible={visible}
        onDismiss={hideModalPic}
        contentContainerStyle={containerStyle}>
        <View style={{alignSelf: 'flex-end', marginBottom: hp(1)}}>
          <Entypo
            onPress={() => setVisible(false)}
            name="circle-with-cross"
            size={25}
            color="red"
          />
        </View>

        <TouchableOpacity
          onPress={() => {
            updateImage('camera');
          }}
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            borderWidth: 1,
            padding: 10,
            borderRadius: 5,
          }}>
          <Text style={styles.cameraName}> Take a photo </Text>
          <MaterialCommunityIcons name="camera-plus" size={25} color="grey" />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            updateImage('gallery');
          }}
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            borderWidth: 1,
            padding: 10,
            borderRadius: 5,
          }}>
          <Text style={styles.cameraName}>Photo from Gallery</Text>
          <AntDesign name="picture" size={25} color="grey" />
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

export default MyProfile;

const styles = StyleSheet.create({
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: hp(1.3),
    justifyContent: 'space-between',
    paddingHorizontal: wp(3),
    backgroundColor: '#E0E1E6',
    marginTop: hp(1),
    marginHorizontal: wp(5),
    borderRadius: 5,
  },
  itemContainer2: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: wp(3),
    width: wp(40),
    marginTop: hp(1),
    borderRadius: 10,
    paddingVertical: hp(1),
    paddingLeft: wp(1),
    backgroundColor: '#E0E1E6',
  },
  textbox: {
    fontSize: hp(2),
    color: 'balck',
    // marginHorizontal:wp(.3)
  },
  text2: {
    fontSize: hp(2),
    color: '#272727',
    fontWeight: '500',
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
    borderWidth: 1,
    borderColor: 'red',
  },
  edit: {
    height: hp(3.2),
    width: wp(25),
    backgroundColor: '#182178',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
    marginVertical: hp(1),
  },
  editText: {
    fontSize: hp(1.6),
    fontFamily: commonfonts.heading,
    color: 'white',
  },
  text: {
    fontSize: hp(1.5),
    fontFamily: commonfonts.medium,
    color: 'black',
    width: wp(40),
  },
  text1: {
    fontSize: hp(2),
    color: 'black',
    width: wp(25),
  },

  circle: {
    borderRadius:
      Math.round(
        Dimensions.get('window').width + Dimensions.get('window').height,
      ) / 2,
    width: Dimensions.get('window').width * 0.09,
    height: Dimensions.get('window').width * 0.09,
    backgroundColor: globalColor.headerColor,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    top: hp(-1.5),
    left: wp(19),
    zIndex: 1,
  },
  name: {
    fontSize: hp(2),
    fontFamily: commonfonts.bold,
    color: 'black',
    width: wp(38),
    // borderWidth:1
  },

  empolyeimage: {
    borderRadius:
      Math.round(
        Dimensions.get('window').width + Dimensions.get('window').height,
      ) / 2,
    width: Dimensions.get('window').width * 0.3,
    height: Dimensions.get('window').width * 0.3,
    zIndex: 1,
  },
  cameraName: {
    fontSize: hp(2),
    fontFamily: commonfonts.medium,
  },
  headerText: {
    fontSize: hp(2.5),
    color: globalColor.firstColor,
    fontFamily: commonfonts.bold,
    textAlign: 'center',
  },
  boxView: {
    flexDirection: 'row',
    width: wp(90),
    alignSelf: 'center',
    justifyContent: 'space-around',
    marginTop: hp(1),

    // borderWidth: 1,
  },
});
