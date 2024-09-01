import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {commonfonts} from '../../locales/globalFontFamily';
import {globalColor} from '../../locales/appColors';
import {StyleSheet} from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',

  },
  imageLogo: {
    height: hp(20),
    width: wp(50),
      resizeMode: 'contain',
      position:'absolute',
      top:hp(5)
  },

  option: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: globalColor.appSecondary,
    width: wp(85),
    height: hp(10),
    paddingVertical: hp(1),
    paddingHorizontal: wp(3),
    borderBottomWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    marginVertical: hp(0.6),
  },
  radioCircle: {
    height: 30,
    width: 30,
    borderRadius: 15,
    borderWidth: 2,
    borderColor:'#ED766A',
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectedRb: {
    width: 15,
    height: 15,
    borderRadius: 7.5,
    backgroundColor:'#ED766A',
  },
  textContainer: {
    marginLeft: wp(2),
  },
  title: {
    fontSize: hp(2),
    fontFamily:commonfonts.bold,
    color:globalColor.firstColor,
    width:wp(70)
  },
  description: {
    fontSize: hp(1.5),
    fontFamily: commonfonts.heading,
    color: globalColor.secondary,
    width:wp(70)

  },
  modebutton: {
    marginVertical: hp(5),
  },
});
