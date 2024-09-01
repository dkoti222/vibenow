import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import { commonfonts } from '../locales/globalFontFamily';
import { globalColor } from '../locales/appColors';

const GlobalButton = ({ title, onPress, style, textStyle,disable, ...props }) => {
  return (
    <TouchableOpacity onPress={onPress} style={[styles.button, style]} disabled={disable} {...props}>
      <Text style={[styles.text, textStyle]}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    height:hp(6),
    paddingHorizontal: 20,
    backgroundColor:globalColor.firstColor,
    alignItems: 'center',
    justifyContent: 'center',
    width:wp(85),
    borderRadius:20,
 
  },
  text: {
    color:'white',
    fontWeight:'bold',
    fontSize: hp(2.5),
    fontFamily:commonfonts.medium
  },
});

export default GlobalButton;
