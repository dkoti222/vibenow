import { StyleSheet, Image } from 'react-native'
import React from 'react'
import { createDrawerNavigator } from '@react-navigation/drawer';
import CustomDrawerNavigation from './CustomDrawerNavigation';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen'
import TabNav from './TabNav';

const Drawer = createDrawerNavigator();

const DrawerNav = ({navigation}) => {
  return (
    <Drawer.Navigator
      initialRouteName="TabNav"
      drawerContent={props => <CustomDrawerNavigation {...props} />}
      screenOptions={{
        drawerStatusBarAnimation: 'slide',
        drawerActiveTintColor: "black",
        drawerInactiveTintColor: 'black',
        drawerActiveBackgroundColor: 'white',
        drawerInactiveBackgroundColor: 'white',
        headerShown: false,
        drawerLabelStyle: {
          fontSize: 16,

          color: 'black'
        }
      }}>
      <Drawer.Screen
        name='TabNav'
        component={TabNav}

      />

    </Drawer.Navigator>
  )
}

export default DrawerNav


const styles = StyleSheet.create({
  sideIcon: {
    height: hp(5),
    width: wp(5),
    resizeMode: 'contain'

  }
})