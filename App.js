import {View, StatusBar,} from 'react-native';
import React from 'react';
import Navigation from './src/Naviagtions/Navigation';
import {globalColor} from './src/locales/appColors';
import GlobalProvider from './src/context/provider';
import { Provider } from 'react-native-paper';
const App = () => {
  return (
    <GlobalProvider>
      <Provider>
      <StatusBar backgroundColor={globalColor.headerColor} />
      <Navigation />
      </Provider>
      
    </GlobalProvider>
  )
}
export default App




