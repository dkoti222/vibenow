import { View } from 'react-native'
import React, { useEffect, useState } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'
import LoadingIndicator from '../../../atoms/LoadingIndicator'
import WebView from 'react-native-webview'
import Globalhaeder from '../../GlobalComponets/Globalhaeder'
import Ionicons from 'react-native-vector-icons/Ionicons';

const TermsAndCondition = ({navigation}) => {
  const [term, setTerm] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const getTerms = async () => {
    try {
      const result = await AsyncStorage.getItem('userToken');
      console.log(result, 'Home pageToken');

      const matchingResponse = await fetch(
        'http://13.48.156.8:4000/User-Apis/Get-Informations/Terms-and-Conditions',
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'x-access-token': JSON.parse(result),
          },
        },
      );

      let res = await matchingResponse.json();

      console.log(res, 'koti');
      if (res?.success) {
        setTerm(res.pageInfo.information_url);
        setIsLoading(false);
      } else {
        setIsLoading(false);
      }
    } catch (error) {
      console.error('Error fetching terms:', error);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getTerms();
  }, []);

  return (
    <View style={{ flex: 1 }}>
      {/* <Globalhaeder  
       iconSide={
        <Ionicons
        onPress={() => navigation.goBack()}
          name="arrow-back"
          size={30}
          color="white"
        />
      }
      /> */}
      {isLoading ? (
        <LoadingIndicator />
      ) : (
        <WebView style={{ flex: 1, padding: 15 }} source={{ uri: term }} />
      )}
    </View>
  );
};

export default TermsAndCondition;
