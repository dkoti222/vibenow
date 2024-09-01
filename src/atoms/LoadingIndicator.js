import React from 'react';
import { View, ActivityIndicator } from 'react-native';
import { globalColor } from '../../src/locales/appColors';

const LoadingIndicator = () => {
  return (
    <View
            style={{
              position: 'absolute',
              top: 0,
              bottom: 0,
              left: 0,
              right: 0,
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
            }}
          >
            <ActivityIndicator size="large" color={globalColor.firstColor} />
          </View>
  );
};

export default LoadingIndicator;
