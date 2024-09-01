import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  Alert,
  BackHandler,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {styles} from './Styles';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {globalColor} from '../../locales/appColors';
import LinearGradient from 'react-native-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {GlobalContext} from '../../context/provider';
import LoadingIndicator from '../../atoms/LoadingIndicator';
import GlobalModal from '../../atoms/GlobalModal';

const Interst = ({navigation}) => {
  const [selectedItems, setSelectedItems] = useState([]);
  const context = React.useContext(GlobalContext);
  const [isLoading, setIsLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  
  const getInterst = async () => {
    const result = await AsyncStorage.getItem('userToken');
    setIsLoading(true);
    const interstsList = await fetch(
      'http://13.48.156.8:4000/User-Apis/Get-Interestes',
      {
        headers: {
          'Content-Type': 'application/json',
          'x-access-token': JSON.parse(result),
        },
      },
    );
    let res = await interstsList.json();
    console.log(res)
    if (res?.success == true) {
      await context.interstDispatch({
        type: 'GET_INTERST',
        payload: res.interestTypeList,
      });
      setIsLoading(false)

    } else {
      setIsLoading(false);
      
      
    }
  };

  useEffect(() => {
    const backAction = () => {
      Alert.alert(
        'Exit App',
        'Do you really want to exit?',
        [
          {
            text: 'Cancel',
            onPress: () => null,
            style: 'cancel',
          },
          { text: 'YES', onPress: () => BackHandler.exitApp() },
        ],
        { cancelable: false },
      );
      return true;
    };

    const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);
 
    getInterst();

    return () => backHandler.remove();
  }, []);

  const savedNamesId = async () => {
    
      const selectedIdsString = selectedItems.join(',');
      const rqData = {
        interests: selectedIdsString,
      };

      const result = await AsyncStorage.getItem('userToken');
      setIsLoading(true)
      const interstPostResponse = await fetch(
        'http://13.48.156.8:4000/User-Apis/interest-post',
        {
          method: 'POST',
          body: JSON.stringify(rqData),
          headers: {
            'Content-Type': 'application/json',
            'x-access-token': JSON.parse(result),
          },
        },
      );

      let res = await interstPostResponse.json();
      console.log(res, 'go to profile 3');
      if (res?.success == true) {
        // await AsyncStorage.setItem("userTokenProfileThird",JSON.stringify(res.token))
        setIsLoading(false);
        navigation.navigate('Profile3');
      } else {
        setIsLoading(false)
        setShowModal(true)

      }
    
  };

  const toggleItemSelection = id => {
    if (selectedItems.includes(id)) {
      setSelectedItems(prevSelectedItems =>
        prevSelectedItems.filter(selectedId => selectedId !== id),
      );
    } else {
      setSelectedItems(prevSelectedItems => [...prevSelectedItems, id]);
    }
  };

  const renderItem = ({item}) => (
    <TouchableOpacity
      onPress={() => toggleItemSelection(item.interest_id)}
      style={[
        styles.itemContainer,
        selectedItems.includes(item.interest_id) && {
          backgroundColor: globalColor.appPrimary,
        },
      ]}>
      <Text style={{color: 'black', fontSize: 15}}>{item.name}</Text>
    </TouchableOpacity>
  );

  return (
    // <LinearGradient colors={globalColor.bgColor} >
    <View style={styles.container}>

   
      <Image
        style={styles.splashimage}
        source={require('../../assets/appLogo.png')}
      />
      <Text style={styles.heading}>Your Interests</Text>
      <Text style={styles.subheading}>
        Pick Up to 5 things you love.it 'll help you match with people who love
        them too
      </Text>
      {context.interst.map(interestType => (
        <View key={interestType.type_id}>
          <Text style={styles.sectionTitle}>{interestType.type_name}</Text>
          <FlatList
            horizontal
            data={interestType.interestList}
            keyExtractor={item => item.interest_id.toString()}
            renderItem={renderItem}
          />
        </View>
      ))}

      <TouchableOpacity
        activeOpacity={1}
        onPress={savedNamesId}
        style={{position: 'absolute', bottom: 40, right: 50,}}>
        <AntDesign
          name="rightcircle"
          size={55}
          color={globalColor.firstColor}
        />
      </TouchableOpacity>
      {isLoading && (
          <LoadingIndicator />
        )}
        {showModal && (
        <GlobalModal
      
          modalVisible={showModal}
          handleModelPress={() => setShowModal(false)}
          modalText={{
            buttonText: 'OK',
            headerValue: 'Ooops....!',
            inValid: 'Invalid Response',
          }}
        />
      )}
 
 </View>
    // </LinearGradient>
  );
};

export default Interst;
