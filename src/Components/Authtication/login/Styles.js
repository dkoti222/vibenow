import {StyleSheet} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {globalColor} from '../../../locales/appColors';
import { commonfonts } from '../../../locales/globalFontFamily';
export const styles = StyleSheet.create({
  Container: {
  alignItems:'center',
// justifyContent:'center',
height:hp(100),
width:wp(100),
// paddingBottom:hp(20),
  },
  splashimage: {
    height: hp(20),
    width: wp(50),
    resizeMode: 'contain',
  marginTop:hp(5),
  marginBottom:hp(1)
  },
  inputView: {
    marginVertical: hp(1),
  },
  errorText: {
    color: globalColor.appPrimary,
    fontSize: hp(2),
    marginTop: hp(1),
    marginLeft: wp(6),
  },
  button: {
    width: wp(60),
    marginBottom:hp(5)
  },
  privacyView:{
   marginVertical:hp(2),
   
  },
   circleImage: {
    width: hp(15),
    height: hp(15),
    borderRadius: hp(10),
    borderWidth:2,
    borderColor:"#ff7983",
    alignSelf:'center',
},
indicator: {
  width: 10,
  height: 10,
  borderRadius: 5,
  marginHorizontal: 5,

},
activeIndicator: {
  backgroundColor: 'red',
},
inactiveIndicator: {
  backgroundColor: 'gray',
},
dotContainer: {
  flexDirection: 'row',
  alignSelf: 'center',
},
dot: {
  height: 10,
  width: 10,
  borderRadius: 5,
  marginHorizontal: 5,
 marginBottom:20
},
activeDot: {
  backgroundColor: globalColor.firstColor,
},
inactiveDot: {
  backgroundColor:"#FFFFFF",
},
centeredView: {
  flex: 1,
  justifyContent: 'center',
  alignItems: 'center',
  marginTop: 22,
},
modalView: {
  margin: 20,
  backgroundColor: 'white',
  borderRadius: 20,
  padding: 35,
  alignItems: 'center',
  shadowColor: '#000',
  shadowOffset: {
    width: 0,
    height: 2,
  },
  shadowOpacity: 0.25,
  shadowRadius: 4,
  elevation: 5,
},
btModal:{
  height:hp(5),
  width:wp(30),
  backgroundColor:globalColor.firstColor,
  justifyContent:'center',
  alignItems:'center',
  borderRadius:10,

},bttext:{
    fontSize: hp(2),
    color: '#FFFFFF',
    fontFamily: commonfonts.bold,
  
},
head: {
  fontSize: hp(1.8),
  color: globalColor.firstColor,
  fontFamily: commonfonts.bold,
  textAlign: 'center',
},
});
