import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import Profile from '../Components/ProfileCreation/Profile';
import Profile2 from '../Components/ProfileCreation/Profile2';
import FreeToNight from '../Components/Modules/Explore/FreeToNight';
import Mode from '../Components/Modes/Mode';
import DrawerNav from './DrawerNav';
import SplashScreen from '../Components/Authtication/splash/SplashScreen';
import LoginScreen from '../Components/Authtication/login/LoginScreen';
import OtpScreen from '../Components/Authtication/otp/OtpScreen';
import Interst from '../Components/Intersts/Interst';
import Profile3 from '../Components/ProfileCreation/Profile3';
import ChatScreen from '../Components/Modules/Chat/ChatScreen';
import SuperSwipe from '../Components/Modules/Home/SuperSwipe';
import Undo from '../Components/Modules/Home/Undo';
import Notifications from '../Components/Modules/Notifications';
import Globalhaeder from '../Components/GlobalComponets/Globalhaeder';
import TermsAndCondition from '../Components/Modules/myProfile/TermsAndCondition';
import About from '../Components/Modules/myProfile/About';
import Privacy from '../Components/Modules/myProfile/Privacy';
import EditProfile from '../Components/Modules/myProfile/EditProfile';
import ProfileMatchingDetails from '../Components/Modules/Home/ProfileMatchingDetails';
import LikedProfileDetails from '../Components/Modules/Home/LikedProfileDetails';
import Chat from '../Components/Modules/Chat/Chat';
import ExploreItem from '../Components/Modules/Explore/ExploreItem';
import Liked from '../Components/Modules/myProfile/Liked';
import Connection from '../Components/Modules/myProfile/Connection';
import GiftSent from '../Components/Modules/myProfile/GiftSent';
import GiftReceived from '../Components/Modules/myProfile/GiftReceived';
import Assitanace from '../Components/Modules/Home/Assitanace';


const Stack = createStackNavigator();

const Navigation = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="SplashScreen"
        screenOptions={{headerShown: false}} >
        <Stack.Screen name="SplashScreen" component={SplashScreen} />
        <Stack.Screen name="LoginScreen" component={LoginScreen} />
        <Stack.Screen name="OtpScreen" component={OtpScreen} />
        <Stack.Screen name="Profile" component={Profile} />
        <Stack.Screen name="Profile2" component={Profile2} />
        <Stack.Screen name="Profile3" component={Profile3} />
        <Stack.Screen name="DrawerNav" component={DrawerNav} />
        <Stack.Screen name="FreeToNight" component={FreeToNight} />
        <Stack.Screen name="Mode" component={Mode} />
        <Stack.Screen name="Interst" component={Interst} />
        <Stack.Screen name="ChatScreen" component={ChatScreen} />
        <Stack.Screen name="Chat" component={Chat} />
        <Stack.Screen name="SuperSwipe" component={SuperSwipe} />
        <Stack.Screen name="Undo" component={Undo} />
        <Stack.Screen name="Notifications" component={Notifications} />
        <Stack.Screen name="Globalhaeder" component={Globalhaeder} />
        <Stack.Screen name="TermsAndCondition" component={TermsAndCondition} />
        <Stack.Screen name="About" component={About} />
        <Stack.Screen name="Privacy" component={Privacy} />
        <Stack.Screen name="EditProfile" component={EditProfile} />
        <Stack.Screen name="ProfileMatchingDetails" component={ProfileMatchingDetails} />
        <Stack.Screen name="LikedProfileDetails" component={LikedProfileDetails} />
        <Stack.Screen name="ExploreItem" component={ExploreItem} />
        <Stack.Screen name="Liked" component={Liked} />
        <Stack.Screen name="Connection" component={Connection} />
        <Stack.Screen name="GiftSent" component={GiftSent} />
        <Stack.Screen name="GiftReceived" component={GiftReceived} />
        <Stack.Screen name="Assitanace" component={Assitanace} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default Navigation;
