import {StyleSheet} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {globalColor} from '../../../locales/appColors';
import {commonfonts} from '../../../locales/globalFontFamily';
export const styles = StyleSheet.create({
  container: {
    height: hp(100),
    width: wp(100),
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',

  
  
  },
  splashimagesmall: {
    height: hp(20),
    width: wp(50),
      resizeMode: 'contain',
      position:'absolute',
      top:hp(5)
    
      
  },
  hand: {
    height: hp(25),
    width: wp(75),
    resizeMode: 'contain',
  },
  boldText: {
    fontSize: hp(3),
    color: 'black',
    marginVertical: hp(2),
    fontFamily:commonfonts.medium,
    marginTop:hp(10)
  },
  smalltext: {
    fontSize: hp(2),
    fontFamily: commonfonts.medium,
    color: 'black',
    marginVertical:hp(0.5)
  },
  btview: {
    width: wp(90),
    alignSelf: 'center',
    marginVertical: hp(10),
  },
  buttonStyle: {
    width: wp(70),
    borderRadius: 25,
    alignSelf:'center'
  },
  buttonText: {
    fontSize: hp(3),
    fontFamily: commonfonts.medium,
  },
  inputContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: hp(2),
    marginVertical: hp(1),
   
  },
  pinInput: {
    marginRight: wp(4),
    textAlign: 'center',
    width: wp(12),
    height: hp(6),
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#ED766A',
    backgroundColor:globalColor.appSecondary
  },
  errorText: {
    color: globalColor.appPrimary,
    fontSize: hp(2),
    textAlign: 'center',
    marginVertical: hp(1),
  },
  resend: {
    flexDirection: 'row',
    width: wp(90),
    justifyContent:'center',
    marginVertical: hp(1),
   
  },
});
