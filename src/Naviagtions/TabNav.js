import {View, Text} from 'react-native';
import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import CustomTabNaviagtion from './CustomTabNaviagtion';
import Home from '../Components/Modules/Home/Home';
import MyProfile from '../Components/Modules/myProfile/MyProfile';
import Chat from '../Components/Modules/Chat/Chat';
import Explore from '../Components/Modules/Explore/Explore';
import LikedProfile from '../Components/Modules/Home/LikedProfile';

const Tab = createBottomTabNavigator();

const icons = {
  Home: 'home',
  Profile: 'user',
  Chat: 'wechat',
  LikedProfile: 'heart',
  Explore: 'th-large',
};

const TabNav = () => {
  return (
    <Tab.Navigator
      screenOptions={{headerShown: false}}
      tabBar={props => <CustomTabNaviagtion {...props} icons={icons} />}>
      <Tab.Screen name="Home" component={Home} />
      <Tab.Screen name="Explore" component={Explore} />
      <Tab.Screen name="LikedProfile" component={LikedProfile} />
      <Tab.Screen name="Chat" component={Chat} />
      <Tab.Screen name="Profile" component={MyProfile} />
    </Tab.Navigator>
  );
};

export default TabNav;
