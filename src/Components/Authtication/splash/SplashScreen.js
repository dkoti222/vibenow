import React, {useEffect} from 'react';
import {StyleSheet, Image} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import LinearGradient from 'react-native-linear-gradient';
import {globalColor} from '../../../locales/appColors';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SplashScreen = ({navigation}) => {
  const getToken = async () => {
    const result = await AsyncStorage.getItem('userToken');
    const loggedCondition = await AsyncStorage.getItem('logCondition');
    const parseItem2 = JSON.parse(loggedCondition);
    const parseItem = JSON.parse(result);
    if (parseItem && parseItem2) {
      navigation.replace('DrawerNav');
    } else {
      const result2 = await AsyncStorage.getItem('userId');
      if (result2) {
        navigation.replace('Mode');
      } else {
        navigation.replace('LoginScreen');
      }
    }
  };
  useEffect(() => {
    const timeout = setTimeout(() => {
      getToken();
    }, 1500);
    return () => clearTimeout(timeout);
  }, []);

  return (
    <LinearGradient colors={globalColor.bgColor} style={styles.container}>
      <Image
        style={styles.image}
        source={require('../../../assets/appLogo.png')}
      />
    </LinearGradient>
  );
};

export default SplashScreen;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    height: hp(75),
    width: wp(75),
    resizeMode: 'contain',
  },
});
