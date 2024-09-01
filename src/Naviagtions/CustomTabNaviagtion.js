import { View, Text,TouchableOpacity ,Image} from 'react-native'
import React from 'react'
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { globalColor } from '../locales/appColors';

const CustomTabNaviagtion = ({state, descriptors, navigation,icons}) => {
    return (
        <View style={{ flexDirection: 'row' }}>
          {state.routes.map((route, index) => {
            const { options } = descriptors[route.key];
            const label =
              options.tabBarLabel !== undefined
                ? options.tabBarLabel
                : options.title !== undefined
                ? options.title
                : route.name;
    
            const isFocused = state.index === index;
            const iconName = icons[route.name];
    
            const onPress = () => {
              const event = navigation.emit({
                type: 'tabPress',
                target: route.key,
              });
    
              if (!isFocused && !event.defaultPrevented) {
                navigation.navigate(route.name);
              }
            };
    
            const onLongPress = () => {
              navigation.emit({
                type: 'tabLongPress',
                target: route.key,
              });
            };
    
            return (
              <TouchableOpacity
                accessibilityRole="button"
                accessibilityState={isFocused ? { selected: true } : {}}
                accessibilityLabel={options.tabBarAccessibilityLabel}
                testID={options.tabBarTestID}
                onPress={onPress}
                onLongPress={onLongPress}
                style={{ flex: 1,backgroundColor:globalColor.headerColor,height:hp(7) ,justifyContent:'center',alignItems:'center'}}
              key={index}>
            <FontAwesome
              name={iconName}
              size={30}
              color={isFocused ? globalColor.firstColor :"white"}
            />

              
              </TouchableOpacity>
            );
          })}
        </View>
      )
  
}

export default CustomTabNaviagtion


