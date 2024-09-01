import {View, Text, StyleSheet, Image, TouchableOpacity} from 'react-native';
import React from 'react';
import LinearGradient from 'react-native-linear-gradient';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {globalColor} from '../../locales/appColors';
import Ionicons from 'react-native-vector-icons/Ionicons';

const Globalhaeder = ({iconSide, notify, navigation}) => {
  return (
    <View
      style={styles.container}>
      <Text>{iconSide ? iconSide : null}</Text>
      <Image
        style={styles.smallogo}
        source={require('../../assets/vibenow.png')}
      />
      <Text>{notify ? notify : null}</Text>
    </View>
  );
};

export default Globalhaeder;

const styles = StyleSheet.create({
  container:{
      backgroundColor: globalColor.headerColor,
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: wp(5),
      paddingVertical: hp(1),
      justifyContent:'space-between'
  },
  smallogo: {
    height: hp(6),
    width: wp(45),
    resizeMode: 'contain',
  },
  icon: {
    height: hp(5),
    width: wp(5),
    resizeMode: 'contain',
  },
});
