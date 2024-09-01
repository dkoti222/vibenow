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
    padding: 16,
    paddingBottom:hp(13)
  },
  heading: {
    fontSize: hp(3),
    textAlign: 'center',
    color:globalColor.firstColor,
    fontWeight:'500'
  },
  subheading: {
    fontSize: hp(2),
    fontFamily: commonfonts.medium,
    color: 'black',
    width: wp(85),
    marginVertical: hp(2),
  },
  sectionContainer: {
    marginBottom: hp(2),
  },
  sectionTitle: {
    fontSize: hp(2),
    color: globalColor.firstColor,
    fontFamily: commonfonts.medium,
    // marginBottom: hp(1),
    marginVertical:hp(1)
  },
  itemContainer: {
    padding: 10,
    // marginBottom: hp(1),
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    marginLeft: wp(1.5),
  },
  selectedItem: {
    backgroundColor: globalColor.appSecondary,
  },

  viewToggle: {
    color: globalColor.firstColor,
    marginTop: hp(1),
    fontSize: hp(1.5),
  },
  bt: {
    alignSelf: 'center',
    marginBottom: hp(6),
  },
  splashimage:{
    height: hp(15),
    width: wp(50),
    resizeMode: 'contain',
    alignSelf:'center',
    marginVertical:hp(3)
    // position:'absolute',
    // top:hp(5)
  }
});
