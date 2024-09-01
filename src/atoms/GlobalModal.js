import {View, Text, Modal, TouchableOpacity, StyleSheet} from 'react-native';
import React from 'react';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {globalColor} from '../locales/appColors';
import {commonfonts} from '../locales/globalFontFamily';
import {TextInput} from 'react-native-paper';
import Entypo from 'react-native-vector-icons/Entypo';

const GlobalModal = ({
  modalVisible,
  handleModelPress,
  modalText,
  headerText,
  closeModal,
  buttonWidth

}) => {
  return (
    <Modal transparent={true} visible={modalVisible} animationType="fade">
      <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
        <View
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            height: '30%',
            width: wp(80),
            backgroundColor: 'white',
            elevation: 6,
            borderRadius: 15,
            elevation: 1,
          }}>
         

          <Text style={styles.head}>{modalText.headerValue}</Text>
          <Text style={headerText ? headerText : styles.invalid}>
            {modalText.inValid}
          </Text>

             <View  style={{flexDirection:'row',width:wp(65),alignItems:'center',justifyContent:'center',columnGap:10}}>
             {headerText && (
            <TouchableOpacity
            style={[styles.bt, {width: buttonWidth}]} 
            onPress={closeModal}
            >
              {/* <Entypo name="circle-with-cross" size={25} color="red" />
               */}
               <Text style={styles.bttext}  >No</Text>
            </TouchableOpacity>
          )}   

          <TouchableOpacity
            style={[styles.bt, {width: buttonWidth}]} 
            onPress={() => handleModelPress()}>
            <Text style={styles.bttext}>{modalText.buttonText}</Text>
          </TouchableOpacity>


             </View>
         
        </View>
      </View>
    </Modal>
  );
};

export default GlobalModal;

const styles = StyleSheet.create({
  bt: {
    height: hp(6),
    paddingHorizontal: 20,
    backgroundColor: globalColor.firstColor,
    alignItems: 'center',
    justifyContent: 'center',
    width: wp(50),
    borderRadius: 15,
  },
  bttext: {
    fontSize: hp(2.5),
    color: '#FFFFFF',
    fontFamily: commonfonts.bold,
  },
  head: {
    fontSize: hp(2.5),
    color: globalColor.firstColor,
    fontFamily: commonfonts.bold,
    textAlign: 'center',
  },
  invalid: {
    fontSize: hp(2.2),
    color: 'grey',
    fontFamily: commonfonts.medium,
    marginVertical: hp(3),
    marginHorizontal: wp(4),
    textAlign: 'center',
  },
  input: {
    height: hp(5),
    width: wp(50),
  },
});
