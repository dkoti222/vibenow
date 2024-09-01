import { View } from 'react-native'
import React, { useEffect, useState } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'
import LoadingIndicator from '../../../atoms/LoadingIndicator'
import WebView from 'react-native-webview'
import Globalhaeder from '../../GlobalComponets/Globalhaeder'

const About = () => {
  const [term, setTerm] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const getTerms = async () => {
    try {
      const result = await AsyncStorage.getItem('userToken');
      console.log(result, 'Home pageToken');

      const matchingResponse = await fetch(
        'http://13.48.156.8:4000/User-Apis/Get-Informations/about-us',
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'x-access-token': JSON.parse(result),
          },
        },
      );

      let res = await matchingResponse.json();
      setTerm(res.pageInfo.information_url);
      console.log(res, 'koti');

      if (res?.success) {
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
      {/* <Globalhaeder /> */}
      {isLoading ? (
        <LoadingIndicator />
      ) : (
        <WebView style={{ flex: 1, padding: 15 }} source={{ uri: term }} />
      )}
    </View>
  );
};

export default About;
