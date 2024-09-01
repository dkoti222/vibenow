import { View, Text } from 'react-native'
import React from 'react'
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import SentReq from './SentReq';
import ReceivedReq from './ReceivedReq';
import { SafeAreaView } from 'react-native-safe-area-context';
import { globalColor } from '../../../locales/appColors';
import Globalhaeder from '../../GlobalComponets/Globalhaeder';

const Tab = createMaterialTopTabNavigator();

const Chat = ({navigation}) => {
  return (
    <SafeAreaView style={{ flex: 1 }} >
        <Globalhaeder onPress={()=>navigation.navigate("Notifications")} />
            <Tab.Navigator
        initialRouteName="SentReq"
        screenOptions={{
          tabBarLabelStyle: { fontSize: hp(1.7), color: 'white',fontWeight:'600' },
          tabBarStyle: { backgroundColor: globalColor.headerColor },
          tabBarScrollEnabled: true, // Enable horizontal scroll
          tabBarItemStyle:{width:wp(50)},
          tabBarIndicatorStyle: {
            backgroundColor:globalColor.firstColor, 
            height: 3, 
          },
        

        }}
      >
        <Tab.Screen
          name="SentReq"
          component={SentReq}
          options={{ tabBarLabel: 'Sent Request' }}
        />
        <Tab.Screen
          name="ReceivedReq"
          component={ReceivedReq}
          options={{ tabBarLabel: ' Received Request' }}
        />
       
       
      </Tab.Navigator>
      </SafeAreaView>
  )
}

export default Chat