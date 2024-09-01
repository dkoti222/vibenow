import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ImageBackground,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  ScrollView
} from 'react-native';
import Globalhaeder from '../../GlobalComponets/Globalhaeder';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { commonfonts } from '../../../locales/globalFontFamily';
import { globalColor } from '../../../locales/appColors';
import LoadingIndicator from '../../../atoms/LoadingIndicator';
import GlobalModal from '../../../atoms/GlobalModal';

const Explore = ({ navigation }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [expData, setExpData] = useState([]);

  const getExplore = async () => {
    setIsLoading(true);
    const loginResponse = await fetch('http://13.48.156.8:4000/User-Apis/Get-Explore');
    let res = await loginResponse.json();
    console.log(res,'kkkokokokokokokkkokokokokokokoko')
    if (res?.success == true) {
      setExpData(res?.exploreList);
      setIsLoading(false);
    } else {
      setShowModal(true);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getExplore();
  }, []);

  const renderItem = ({ item }) => (
    <TouchableOpacity
      activeOpacity={1}
      // onPress={() => navigation.navigate('FreeToNight',{exploreId:item})}

      onPress={() => navigation.navigate('ExploreItem',{exploreId:item})}
    >
      <View style={styles.itemContainer}>
        <ImageBackground source={{ uri: item.image }} style={styles.fimages}>
          <View style={styles.overlay}>
            <Text style={styles.boldName}>{item.name}</Text>
          </View>
        </ImageBackground>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={{ flex: 1, paddingBottom: hp(0.4) }}>
      <Globalhaeder onPress={() => navigation.navigate('Notifications')} />

      <View style={{ marginLeft: wp(4) }}>
        <Text style={[styles.boldName, { color: globalColor.firstColor }]}>
          Welcome to Explore
        </Text>
        <Text style={styles.normaltext}>My Vibe...</Text>
      </View>

      <ScrollView>
        <View style={{ alignItems: 'center' }}>
          <FlatList
            data={expData}
            renderItem={renderItem}
            numColumns={2}
          />
        </View>

        {isLoading && <LoadingIndicator />}
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
      </ScrollView>
    </View>
  );
};

export default Explore;

const styles = StyleSheet.create({
  boldName: {
    fontSize: hp(3),
    fontFamily: commonfonts.bold,
    color: 'white',
    marginVertical: hp(0.5),
    textAlign: 'center',
  },
  normaltext: {
    fontSize: hp(2),
    fontFamily: commonfonts.bold,
    color: globalColor.firstColor,
  },
  fimages: {
    flex: 1,
    height: hp(20),
    width: wp(46),
    marginLeft: wp(1),
    marginTop: hp(1),
    borderRadius: 10,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    height: hp(20),
    width: wp(46),
  },
});

