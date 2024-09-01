import { View, Text, StyleSheet } from 'react-native'
import React from 'react'
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
  } from 'react-native-responsive-screen'
import { globalColor } from '../locales/appColors'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';


const Globalhead = () => {
  return (
    <View style={styles.head}>
<MaterialCommunityIcons
                name='keyboard-backspace'
                size={30}
                color='white'
              />
      <Text>Globalhead</Text>
    </View>
  )
}

export default Globalhead

const styles=StyleSheet.create({
  head:{
    height:hp(6),
    width:wp(100),
    borderWidth:1,
    backgroundColor:globalColor.appPrimary,
    flexDirection:'row',
    alignItems:'center',
   paddingHorizontal:wp(3)


  }
})