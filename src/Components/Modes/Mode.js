import React, {useState, useEffect} from 'react';
import {View, Text, TouchableOpacity, Image, Alert} from 'react-native';
import {styles} from '../Modes/Styles';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {globalColor} from '../../locales/appColors';
import {RadioButton} from 'react-native-paper';
import Toast from 'react-native-toast-message';
import {GlobalContext} from '../../context/provider';
import LinearGradient from 'react-native-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LoadingIndicator from '../../atoms/LoadingIndicator';
import GlobalModal from '../../atoms/GlobalModal';

const Mode = ({navigation}) => {
  const [selectedMode, setSelectedMode] = useState(1);
  const [isSelect, setIsSelect] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const context = React.useContext(GlobalContext);
  console.log(context.otpState,'intial checkkkkk again testtttttttt')

  const handleSelectMode = async(id) => {

    console.log(id,'first checkkkkkkkk')
    setSelectedMode(id);
    context.modeIdDispatch({ type: 'changeModeId', payload: id })
    await AsyncStorage.setItem("modeId",JSON.stringify(id))
    // await AsyncStorage.setItem('userToken', JSON.stringify(res.Token));
  };

  const getModes = async () => {
    setIsLoading(true);
    const loginResponse = await fetch(
      'http://13.48.156.8:4000/User-Apis/getModes',
    );
    let res = await loginResponse.json();
    console.log(res, 'kkkkkk');
    if (res?.success == true) {
      console.log('ressssss', res);
      await context.modeDispatch({type: 'GET_MODE', payload: res.modesList});
      setIsLoading(false);
    } else {
      setShowModal(true);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getModes();
  }, []);

  const modeVerify = async () => {
    const phValue=  await AsyncStorage.getItem('PhNumberValue');
    const requiredPhoneValue=JSON.parse(phValue)
    console.log(phValue,'phone number checked')
    const modeBodyDetails = {
      phonenumber:requiredPhoneValue,
      modeid: selectedMode,
    };
    console.log(modeBodyDetails,'klklklkl')
    setIsLoading(true);
    const modeResponse = await fetch(
      'http://13.48.156.8:4000/User-Apis/User-Check',
      {
        method: 'POST',
        body: JSON.stringify(modeBodyDetails),
        headers: {'Content-Type': 'application/json'},
      },
    );
    let res = await modeResponse.json();


    console.log(res,'checkinhgggggg')
    if (res?.registering_user == true) {
      await AsyncStorage.setItem('userToken', JSON.stringify(res.Token));
      await AsyncStorage.setItem('userId', JSON.stringify(res?.user_id));
      setIsLoading(false);
      await navigation.navigate('Profile');
    }
     else if (res?.profile_missing == true) {
      await AsyncStorage.setItem('userToken', JSON.stringify(res.Token));
      await AsyncStorage.setItem('userId', JSON.stringify(res?.user_id));
      setIsLoading(false);
      await navigation.navigate('Profile');
    } else if (res?.profile_additional_missing == true) {
      await AsyncStorage.setItem('userToken', JSON.stringify(res.Token));
      await AsyncStorage.setItem('userId', JSON.stringify(res?.user_id));
      setIsLoading(false);
      await navigation.navigate('Profile2');
    } else if (res?.interests_missing == true) {
      await AsyncStorage.setItem('userToken', JSON.stringify(res.Token));
      await AsyncStorage.setItem('userId', JSON.stringify(res?.user_id));
      setIsLoading(false);
      await navigation.navigate('Interst');
    } else if (res?.profile_pics_missing == true) {
      await AsyncStorage.setItem('userToken', JSON.stringify(res.Token));
      await AsyncStorage.setItem('userId', JSON.stringify(res?.user_id));
      setIsLoading(false);
      await navigation.navigate('Profile3');
    } else if(res?.success == false){
      setShowModal(true)
       setIsLoading(false);
       navigation.navigate('LoginScreen')
    } else {
      await AsyncStorage.setItem('makeOffer', JSON.stringify(res.make_offer));
      await AsyncStorage.setItem('userToken', JSON.stringify(res.Token));
      await AsyncStorage.setItem('userId', JSON.stringify(res?.user_id));
      await AsyncStorage.setItem('logCondition', JSON.stringify(res?.logged_user));
      setIsLoading(false);
      await navigation.navigate('DrawerNav');
    }
    
  };

  return (
    // <LinearGradient colors={globalColor.bgColor} >
       <View style={styles.container}>

     
      <Image
        style={styles.imageLogo}
        source={require('../../assets/appLogo.png')}
      />
      {context.mode?.map(mode => (
        <TouchableOpacity
          onPress={() => handleSelectMode(mode.mode_id)}
          key={mode.mode_id}
          style={styles.option}>
          <RadioButton.Android
            style={styles.radioCircle}
            value={mode.name}
            status={selectedMode === mode.mode_id ? 'checked' : 'unchecked'}
            onPress={() => handleSelectMode(mode.mode_id)}
          />
          <View style={styles.textContainer}>
            <Text style={styles.title}>{mode.name}</Text>
            <Text style={styles.description}>{mode.shortDescription}</Text>
          </View>
        </TouchableOpacity>
      ))}

      <TouchableOpacity
        activeOpacity={1}
        onPress={modeVerify}
        style={{position: 'absolute', bottom: 100, right: 50}}>
        <AntDesign
          name="rightcircle"
          size={50}
          color={globalColor.firstColor}
        />
      </TouchableOpacity>
      {isLoading && <LoadingIndicator />}
      {showModal && (
        <GlobalModal
          modalVisible={showModal}
          handleModelPress={() => setShowModal(false)}
          modalText={{
            buttonText: 'OK',
            headerValue: 'Ooops....!',
            inValid: 'Invalid Response',
          }}
        />
      )}
        </View>
    // </LinearGradient>
  );
};
export default Mode;
