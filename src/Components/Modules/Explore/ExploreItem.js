import { View, Text, ImageBackground, StyleSheet } from 'react-native'
import React from 'react'
import Globalhaeder from '../../GlobalComponets/Globalhaeder'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { commonfonts } from '../../../locales/globalFontFamily';
import GlobalButton from '../../../atoms/GlobalButton';
import Ionicons from 'react-native-vector-icons/Ionicons';

const ExploreItem = ({navigation,route}) => {

    console.log(route.params.exploreId.id,'exxxxxxxploreeeeeeeeeeeeeeee')
  return (
    <View style={{flex:1}}>
        <Globalhaeder  
          iconSide={
            <Ionicons
              onPress={() => navigation.navigate('DrawerNav')}
              name="arrow-back"
              size={30}
              color="white"
            />
          }
        
        />
        <ImageBackground 
        source={{uri:route?.params.exploreId.image}}

        style={styles.free}>
        <Text style={styles.boldName}>{route.params.exploreId.name}</Text>
        <Text style={styles.normaltext}>Find someone down for something spontaneous</Text>
        <GlobalButton
        title='JOIN NOW'
        style={styles.buttonStyle}
    textStyle={styles.buttonText} 
    onPress={() => navigation.navigate('FreeToNight',{exploreId:route?.params.exploreId.id})}
    

        />
        <Text style={styles.normaltext}>NO THANKS</Text>
        </ImageBackground>
   
    </View>
  )
}

export default ExploreItem
const styles=StyleSheet.create({
    free:{
        height:hp(90),
        width:wp(100),
        resizeMode:'contain',
        // justifyContent:'center',
        alignItems:'center',
        paddingTop:hp(55)
    },
    boldName:{
        fontSize:hp(3),
        fontFamily:commonfonts.extraBold,
        color:"white"
        },
        normaltext:{
            fontSize:hp(2),
            fontFamily:commonfonts.medium,
            color:"white",
            width:wp(70),
            textAlign:'center'
            },
            buttonStyle:{
                width:wp(60),
                borderRadius:5,
                backgroundColor:'white',
                marginVertical:hp(2)
              },
              buttonText:{
                fontSize:hp(2.8),
                fontFamily:commonfonts.heading,
                color:'black'
              },
})
