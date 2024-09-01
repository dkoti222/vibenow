import React from 'react';
import { TextInput, StyleSheet, View } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { globalColor } from '../locales/appColors';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import { GlobalContext } from '../context/provider';

const GlobalTextInput = ({ style, iconName, iconSize, iconColor,isMultiLine, ...otherProps }) => {
  const context = React.useContext(GlobalContext);

  
  return (
    <View style={[styles.container, style]}>
          <Icon name={iconName} size={iconSize || hp(5)} color={iconColor || globalColor.appPrimary} />
      <TextInput multiline={isMultiLine} style={[styles.input, iconName ? styles.inputWithIcon : null]} {...otherProps} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: hp(6),
    width: wp(85),
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: wp(3),
    borderRadius: 25,
    backgroundColor:globalColor.appSecondary,

  },
  input: {
    height: hp(6),
    width:wp(75),
    fontSize:hp(2),
   
  },
  inputWithIcon: {
    paddingLeft: wp(2),
    paddingRight:wp(7)
  },

});

export default GlobalTextInput;
