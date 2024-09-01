 import React, {useEffect, useState} from 'react';
import {
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
  Keyboard,
  TouchableWithoutFeedback,
  Text,
  Alert,
  BackHandler,
  KeyboardAvoidingView,
} from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import GlobalTextInput from '../../atoms/GlobalTextInput';
import GlobalDropDown from '../../atoms/GlobalDropDown';
import {commonfonts} from '../../locales/globalFontFamily';
import {globalColor} from '../../locales/appColors';
import DatePicker from 'react-native-date-picker';
import LinearGradient from 'react-native-linear-gradient';
import LoadingIndicator from '../../atoms/LoadingIndicator';
import GlobalModal from '../../atoms/GlobalModal';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { ScrollView } from 'react-native-gesture-handler';

const Profile = ({navigation}) => {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    gender: '',
    selectedOffer: '',
    selectedInterest: '',
    date: null,
    about:''
  });

  const handleInputChange = (field, value) => {
    setFormData({...formData, [field]: value});
  };
  const handleOfferSelect = offer => {
    setFormData({...formData, selectedOffer: offer});
  };
  const handleSelectedInterest = item => {
    setFormData({...formData, selectedInterest: item});
  };
  const showErrorModal = message => {
    setShowModal(true);
  };

  const validateInputs = () => {
    const {name, email, gender,about} = formData;
  
    if (!name.trim()) {
      showErrorModal('Please enter your full name');
      return false;
    }
    if (!about.trim()) {
      showErrorModal('Please enter your full name');
      return false;
    }
  
  
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      showErrorModal('Please enter a valid email address');
      return false;
    }
  
    if (!gender) {
      showErrorModal('Please select your gender');
      return false;
    }
    if (!formData.selectedOffer) {
      showErrorModal('Please select an offer');
      return false;
    }
    if (!formData.selectedInterest) {
      showErrorModal('Please select interest to meet');
      return false;
    }
    return true;
  };

 

  const handleSubmit = async () => {
    if (validateInputs()){
      const profileInfoFirst = {
        fullname: formData.name,
        email: formData.email,
        gender: formData.gender,
        i_want_be: formData.selectedOffer,
        im_interest_in: formData.selectedInterest,
        dob: JSON.stringify(formData.date).slice(1, -1).substring(0, 10),
        about_yourself:formData.about
      };

      const result = await AsyncStorage.getItem('userToken');
      console.log(result,'Profile Token')
      setIsLoading(true);
      const profileOneResponse = await fetch(
        'http://13.48.156.8:4000/User-Apis/Profile',
        {
          method: 'POST',
          body: JSON.stringify(profileInfoFirst),
           headers :{
            'Content-Type': 'application/json',
            'x-access-token':JSON.parse(result)
          },
        },
      );
      let res = await profileOneResponse.json();
      console.log(res,'Profie responseeeeeeeeee')
      
      if (res?.success == true) {
        // await AsyncStorage.setItem("userTokenProfile",JSON.stringify(res.token))
        setIsLoading(false);
       await navigation.navigate('Profile2');
      } else {
        setIsLoading(false);
        setShowModal(true)
      }

    }
    
    
  }
  const genderOptions = ['Male', 'Female'];
  
  useEffect(async() => {
    const backAction = () => {
      Alert.alert(
        'Exit App',
        'Do you really want to exit?',
        [
          {
            text: 'Cancel',
            onPress: () => null,
            style: 'cancel',
          },
          { text: 'YES', onPress: () => BackHandler.exitApp() },
        ],
        { cancelable: false },
      );
      return true;
    };

    const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);
    return () => backHandler.remove();
  }, []);
    
  return (
<ScrollView>
    <KeyboardAvoidingView>

   
    <TouchableWithoutFeedback  onPress={Keyboard.dismiss} accessible={false}>
       <View style={styles.container}>

      
      {/* <LinearGradient colors={globalColor.bgColor} style={styles.container}> */}
        <DatePicker
          modal
          mode="date"
          open={open}
          date={formData.date || new Date()}
          onConfirm={date => {
            setFormData({...formData, date});
            setOpen(false);
          }}
          onCancel={() => {
            setOpen(false);
          }}
        />
        <Image
          style={styles.logo}
          source={require('../../assets/appLogo.png')}
        />

        <Text
          style={{
            fontSize: hp(3),
            // marginVertical: hp(2),
            color: globalColor.firstColor,
            fontWeight: '600',
          }}>
          {' '}
          Profile Creation
        </Text>
        <View style={styles.inputView}>
          <GlobalTextInput
            placeholder="Enter Full Name"
            onChangeText={text => handleInputChange('name', text)}
            value={formData.name}
            iconName="account"
            iconSize={25}
            iconColor={globalColor.firstColor}
          />
        </View>

        <View style={styles.inputView}>
          <GlobalTextInput
            placeholder="Enter Email Address"
            onChangeText={text => handleInputChange('email', text)}
            value={formData.email}
            iconName="gmail"
            iconSize={30}
            iconColor={globalColor.firstColor}
          />
        </View>
      <View style={styles.inputView}>
          <TouchableOpacity onPress={() => setOpen(true)}>
            <View style={styles.cal}>
            <MaterialCommunityIcons name='calendar-month' size={30} color={ globalColor.appPrimary} />
              <Text style={{marginLeft:wp(2), fontSize:hp(2),}}>{formData.date
                  ? formData.date.toLocaleDateString()
                  : 'YYYY/MM/DD'}</Text>
            </View>
          </TouchableOpacity>
        </View>
        <View style={styles.inputView}>
          <GlobalDropDown
            data={genderOptions}
            placeholder="I am a....."
            dropdownIcon="gender-male-female"
            onValueChange={gender => handleInputChange('gender', gender)}
          />
        </View> 
        <View style={styles.inputView1}>
          <GlobalTextInput
            placeholder="About yourself...."
            iconName="information"
            iconSize={27}
            onChangeText={text => handleInputChange('about', text)}
            value={formData.about}
            iconColor={globalColor.firstColor}
            isMultiLine={true}
          />
        </View>
        <View>
          <Text style={styles.optionTexthead}>I want to...</Text>
          <View style={{flexDirection: 'row', width: wp(80)}}>
            <TouchableOpacity
              onPress={() => handleOfferSelect('Make Offers')}
              style={[
                styles.optionButton,
                formData.selectedOffer === 'Make Offers' && {
                  backgroundColor: globalColor.firstColor,
                },
              ]}>
              <Text
                style={[
                  styles.optionText,
                  {
                    color:
                      formData.selectedOffer === 'Make Offers'
                        ? 'white'
                        : globalColor.firstColor,
                  },
                ]}>
                Make Offers
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => handleOfferSelect('Receive Offers')}
              style={[
                styles.optionButton,
                formData.selectedOffer === 'Receive Offers' && {
                  backgroundColor: globalColor.firstColor,
                },
              ]}>
              <Text
                style={[
                  styles.optionText,
                  {
                    color:
                      formData.selectedOffer === 'Receive Offers'
                        ? 'white'
                        : globalColor.firstColor,
                  },
                ]}>
                Receive Offers
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <View>
          <Text style={styles.optionTexthead}>
            I am Interested in meeting...
          </Text>
          <View style={{flexDirection: 'row', width: wp(80)}}>
            <TouchableOpacity
              onPress={() => handleSelectedInterest('Men')}
              style={[
                styles.optionButton,
                formData.selectedInterest === 'Men' && {
                  backgroundColor: globalColor.firstColor,
                },
              ]}>
              <Text
                style={[
                  styles.optionText,
                  {
                    color:
                      formData.selectedInterest === 'Men'
                        ? 'white'
                        : globalColor.firstColor,
                  },
                ]}>
                Men
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => handleSelectedInterest('Women')}
              style={[
                styles.optionButton,
                formData.selectedInterest === 'Women' && {
                  backgroundColor: globalColor.firstColor,
                },
              ]}>
              <Text
                style={[
                  styles.optionText,
                  {
                    color:
                      formData.selectedInterest === 'Women'
                        ? 'white'
                        : globalColor.firstColor,
                  },
                ]}>
                Women
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => handleSelectedInterest('Both')}
              style={[
                styles.optionButton,
                formData.selectedInterest === 'Both' && {
                  backgroundColor: globalColor.firstColor,
                },
              ]}>
              <Text
                style={[
                  styles.optionText,
                  {
                    color:
                      formData.selectedInterest === 'Both'
                        ? 'white'
                        : globalColor.firstColor,
                  },
                ]}>
                Both
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <TouchableOpacity onPress={handleSubmit} style={styles.submitButton}>
          <AntDesign
            name="rightcircle"
            size={55}
            color={globalColor.firstColor}
          />
        </TouchableOpacity>
        {isLoading && (
          <LoadingIndicator />
        )}
         {showModal && (
        <GlobalModal
      
          modalVisible={showModal}
          handleModelPress={() => setShowModal(false)}
          modalText={{
            buttonText: 'OK',
            headerValue: 'Ooops....!',
            inValid:  showErrorModal ? 'Please mode all Data' :'Invalid Response',
          }}
        />
      )}
      {/* </LinearGradient> */}
      </View>
    </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    height: hp(100),
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
  },
  logo: {
    height: hp(15),
    width: wp(50),
    resizeMode: 'contain',
    // position: 'absolute',
    // top: hp(5),
  },
  inputView: {
    height: hp(6),
    marginVertical: hp(1),
  },
  inputView1: {
    height: hp(6),
    marginVertical: hp(1),
    // zIndex:2,
    // backgroundColor:globalColor.appSecondary
  },
  submitButton: {
    position: 'absolute',
    bottom: hp(10),
    right: wp(8),
  },
  optionButton: {
    padding: 10,
    borderRadius: 5,
    marginVertical: 5,
    alignItems: 'center',
    borderRadius: 15,
    borderWidth: 1,
    borderColor: globalColor.firstColor,

    marginHorizontal: wp(2),
  },
  optionText: {
    color:"white",
  },
  optionTexthead: {
    fontSize: hp(2.3),
    color:globalColor.firstColor,
    fontFamily: commonfonts.medium,
    marginLeft: wp(2),
    marginVertical: hp(1),
  },
  cal:{
    height: hp(6),
    width: wp(85),
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: wp(3),
    borderRadius: 25,
    backgroundColor:globalColor.appSecondary,
  }
});

export default Profile;
