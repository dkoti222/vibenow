import React from 'react';
import { View } from 'react-native';
import SelectDropdown from 'react-native-select-dropdown';
import Entypo from 'react-native-vector-icons/Entypo';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { globalColor } from '../locales/appColors';

const GlobalDropDown = ({
  data,
  placeholder,
  range,
  buttonContainerStyle,
  rowStyle,
  dropdownIcon,
  onValueChange,
  // defaultValue
  
}) => {

  // console.log(defaultValue,'llllll')
  const generateRange = () => {
    if (range) {
      const start = range.start || 0;
      const end = range.end || 0;
      const step = range.step || 1;

      const heightOptions = [];

      for (let feet = start; feet <= end; feet += step) {
        for (let inches = 0; inches < 10; inches++) {
          const formattedHeight = `${feet}.${inches}`;
          heightOptions.push(formattedHeight);
        }
      }

      return heightOptions;
    }
    return data;
  
  };

  return (
    <View>
      <SelectDropdown
        data={generateRange()}
        onSelect={(selectedItem) => onValueChange(selectedItem)}
        buttonTextAfterSelection={(selectedItem) => selectedItem}
        rowTextForSelection={(item) => item}
        // defaultValue={defaultValue}
        buttonStyle={{
          height: hp(6),
          width: wp(85),
          borderRadius: 25,
          backgroundColor: globalColor.appSecondary,
          ...buttonContainerStyle,
        }}
        rowStyle={{
          borderBottomColor: 'white',
          borderBottomWidth: 2,
          backgroundColor: globalColor.appSecondary,
          ...rowStyle,
        }}
        dropdownStyle={{
          borderRadius: 10,
          backgroundColor: 'white',
          width: wp(85),
          alignContent: 'center',
        }}
        defaultButtonText={placeholder}
        renderDropdownIcon={(isVisible) => (
          <View style={{ flexDirection: 'row' }}>
            <View
              style={{
                position: 'relative',
                left: wp(-64),
                top: hp(0.6),
              }}>
              <MaterialCommunityIcons
                name={dropdownIcon}
                size={25}
                color={globalColor.appPrimary}
              />
            </View>

            <Entypo
              name={isVisible ? 'chevron-up' : 'chevron-down'}
              size={35}
              color={globalColor.appPrimary}
            />
          </View>
        )}
        buttonTextStyle={{
          marginLeft: wp(12),
          textAlign: 'left',
          fontSize: hp(1.8)
         
        }}
        rowTextStyle={{ textAlign: 'center', fontSize: hp(2.2),width:wp(85) }}
      />
    </View>
  );
};

export default GlobalDropDown;
