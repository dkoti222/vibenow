import React, { useState, useEffect, useContext } from 'react';
import { View, StyleSheet, TouchableOpacity, Text, Image } from 'react-native';
import { RadioButton } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { globalColor } from '../locales/appColors';
import LoadingIndicator from '../atoms/LoadingIndicator';
import GlobalModal from '../atoms/GlobalModal';
import { GlobalContext } from '../context/provider';

const CustomDrawerNavigation = ({ navigation }) => {
  const context = useContext(GlobalContext);
  const [selectedOption, setSelectedOption] = useState([]);
  const [radioChecked, setRadioChecked] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const handleRadioPress = async id => {
    console.log(id, 'side navigations id');
    setRadioChecked(id);
    context.modeIdDispatch({ type: 'changeModeId', payload: id });
    await AsyncStorage.setItem('modeId', JSON.stringify(id));
    navigation.closeDrawer();
  };

  const getModes = async () => {
    try {
      setIsLoading(true);
      const result = await AsyncStorage.getItem('userToken');
      const loginResponse = await fetch(
        'http://13.48.156.8:4000/User-Apis/get-user-modes',
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'x-access-token': JSON.parse(result),
          },
        }
      );
      let res = await loginResponse.json();
      if (res?.success) {
        setSelectedOption(res.modesList);
        setIsLoading(false);
      } else {
        setShowModal(true);
        setIsLoading(false);
      }
    } catch (error) {
      console.error('Error fetching qualifications:', error);
      setIsLoading(false);
    }
  };

  useEffect(() => {
   

    const unsubscribe = navigation.addListener('focus', () => {
      const loadInitialData = async () => {
        const storedModeId = await AsyncStorage.getItem('modeId');
        const modeId = JSON.parse(storedModeId) 
        setRadioChecked(modeId);
        getModes();
      };
  
      loadInitialData();
    });

    return unsubscribe;
  }, [radioChecked]);


  useEffect(() => {
    if (radioChecked === 3) {
      context.modeIdDispatch({ type: 'changeModeId', payload: radioChecked });
      navigation.closeDrawer();
    }
  }, [radioChecked]);

  return (
    <View style={styles.container}>
      <Image
        style={styles.splashimagesmall}
        source={require('../../src/assets/vibenow.png')}
      />

      <View>
        {selectedOption.map((option, index) => (
          <TouchableOpacity
            key={option.mode_id}
            style={styles.optionContainer}
            onPress={async () => {
              await handleRadioPress(option.mode_id);
            }}
          >
            <Text style={styles.optionText}>{option.name}</Text>
            <RadioButton
              value={option}
              status={radioChecked === option.mode_id ? 'checked' : 'unchecked'}
              onPress={() => handleRadioPress(option.mode_id)}
            />
          </TouchableOpacity>
        ))}
      </View>
      {isLoading && <LoadingIndicator />}
      {showModal && (
        <GlobalModal
          modalVisible={showModal}
          handleModelPress={() => setShowModal(false)}
          modalText={{
            buttonText: 'OK',
            headerValue: 'Invalid Response....',
          }}
        />
      )}
    </View>
  );
};

export default CustomDrawerNavigation;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: globalColor.headerColor,
  },
  optionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
    marginHorizontal: wp(3),
    paddingHorizontal: wp(2),
    backgroundColor: globalColor.primary,
    marginTop: hp(1),
    borderRadius: 10,
  },
  optionText: {
    fontSize: hp(2),
    color: globalColor.secondary,
    marginLeft: wp(3),
  },
  splashimagesmall: {
    height: hp(12),
    width: wp(40),
    resizeMode: 'contain',
    marginVertical: hp(2.5),
    alignSelf: 'center',
  },
});
