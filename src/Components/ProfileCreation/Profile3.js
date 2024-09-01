import {
  View,
  Text,
  StyleSheet,
  Image,
  TextInput,
  ImageBackground,
  TouchableOpacity,
  BackHandler,
  Alert,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {commonfonts} from '../../locales/globalFontFamily';
import {globalColor} from '../../locales/appColors';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import GlobalDropDown from '../../atoms/GlobalDropDown';
import LinearGradient from 'react-native-linear-gradient';
import ImagePicker from 'react-native-image-crop-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import storage from '@react-native-firebase/storage';
import uuid from 'react-native-uuid';
import LoadingIndicator from '../../atoms/LoadingIndicator';
import GlobalModal from '../../atoms/GlobalModal';
import {Modal} from 'react-native-paper';
import Entypo from 'react-native-vector-icons/Entypo';
import ImageCropPicker from 'react-native-image-crop-picker';
import GlobalTextInput from '../../atoms/GlobalTextInput';
import { GlobalContext } from '../../context/provider';


const Profile3 = ({navigation}) => {
  const [selectedValues, setSelectedValues] = useState({
    profession: null,
    education: null,
    explore:null,
    experience:'',
    price:'',
  
    pickedImages: [
      {id: 1, imageUrl: null},
      {id: 2, imageUrl: null},
      {id: 3, imageUrl: null},
    ],
  });
  const [errorModalText, setErrorModalText] = useState('');
  const [occupayData, setOccupayData] = useState([]);
  const [qualifyData, setQualifyData] = useState([]);
  const [exploreData, setExploreData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [visible, setVisible] = useState(false);
  const [selectId, setSlectId] = useState(1);

  const context = React.useContext(GlobalContext);
  console.log(context.modeId,'last check check')

  const showModalPic = id => {

    // console.log(id, 'llllll')
    setSlectId(id);
    setVisible(true);
  };
  const hideModalPic = () => setVisible(false);

  const containerStyle = {
    backgroundColor: 'white',
    paddingHorizontal: wp(4),
    paddingTop: hp(1),
    paddingBottom: hp(4),

    width: wp(80),
    alignSelf: 'center',
    rowGap: 10,
    borderRadius: 10,
  };

  const handleInputChange2 = (field, value) => {
    setSelectedValues({...selectedValues, [field]: value});
  };

  const profession = occupayData.occupationList?.map(
    ele => ele.occupation_name,
  );
  const education = qualifyData.qualificationsList?.map(
    ele => ele.qulification_name,
  );

  // const explore = exploreData.exploreList?.map(
  //   ele => ele.name,
  // );
  const exploreList = exploreData.exploreList || []

  const explore = ['None', ...exploreList.map(ele => ele.name)];

  const handleInputChange = (field, selectedItem) => {
    setSelectedValues(prevState => ({...prevState, [field]: selectedItem}));

    if (field === 'profession' && selectedItem) {
      const selectedOccupation = occupayData.occupationList.find(
        ele => ele.occupation_name === selectedItem,
      );
      if (selectedOccupation) {
        const {occupation_name, id} = selectedOccupation;
        // console.log(`Selected Occupation: ${occupation_name}, ID: ${id}`);
      }
    }

    if (field === 'education' && selectedItem) {
      const selectedQualification = qualifyData.qualificationsList.find(
        ele => ele.qulification_name === selectedItem,
      );
      if (selectedQualification) {
        const {qulification_name, id} = selectedQualification;
        // console.log(`Selected Qualification: ${qulification_name}, ID: ${id}`);
      }
    }


    // if (field === 'explore' && selectedItem) {
    //   const selectedExplore = exploreData.exploreList.find(
    //     ele => ele.name === selectedItem,
    //   );
    //   if (selectedExplore) {
    //     const {name, id} = selectedExplore;
    //     console.log(`Selected Qualification: ${name}, ID: ${id}`);
    //   }
    // }
    if (field === 'explore' && selectedItem) {
      const selectedExplore = exploreData.exploreList.find(ele => ele.name === selectedItem);
      if (selectedExplore) {
        const { name, id } = selectedExplore;
        // console.log(`Selected Explore: ${name}, ID: ${id}`);
      }
    }
  
  };

  const form3Validation = async () => {
    if (!selectedValues.profession || !selectedValues.education || !selectedValues.explore) {
      setErrorModalText(
        'Please select both Occupation and Highest Qualification.',
      );
      setShowModal(true);
      return;
    }

    const selectedOccupation = occupayData.occupationList.find(
      ele => ele.occupation_name === selectedValues.profession,
    );
    const occupationId = selectedOccupation ? selectedOccupation.id : null;

    const selectedQualification = qualifyData.qualificationsList.find(
      ele => ele.qulification_name === selectedValues.education,
    );
    const qualificationId = selectedQualification
      ? selectedQualification.id
      : null;

      // const selectedExplore = exploreData.exploreList.find(
      //   ele => ele.name === selectedValues.explore,
      // );
      // const exploreId = selectedExplore ? selectedExplore.id : null;    

      const selectedExplore = exploreData.exploreList.find(ele => ele.name === selectedValues.explore);
const exploreId = selectedExplore ? selectedExplore.id : 0;  ``


    if (selectedValues.pickedImages[0].imageUrl == null) {
      setErrorModalText(
        'Please upload the first image and at least one more image.',
      );
      setShowModal(true);
      return;
    } else {
      const indexImage = selectedValues.pickedImages[0].imageUrl;
      const indexImage2 = selectedValues.pickedImages[1].imageUrl;
      const indexImage3 = selectedValues.pickedImages[2].imageUrl;
      const reference = storage().ref(`userImages/${uuid.v4()}`);
      const reference2 =
        indexImage2 !== null ? storage().ref(`userImages/${uuid.v4()}`) : '';
      const reference3 =
        indexImage3 !== null ? storage().ref(`userImages/${uuid.v4()}`) : '';
      // console.log(reference, 'oo');
      setIsLoading(true);
      await reference.putFile(indexImage);
      indexImage2 !== null && (await reference2.putFile(indexImage2));
      indexImage3 !== null && (await reference3.putFile(indexImage3));
      const downloadURL = await reference.getDownloadURL();
      const downloadURL2 =
        indexImage2 !== null ? await reference2.getDownloadURL() : '';
      const downloadURL3 =
        indexImage3 !== null ? await reference3.getDownloadURL() : '';

      // console.log(downloadURL, downloadURL2, downloadURL3, 'images List ');
      setIsLoading(false);
      const bodyParameters = {
        occupation_id: occupationId,
        qualifications_id: qualificationId,
        explore_id : exploreId,
        experience : selectedValues.experience,
        price :selectedValues.price,

        images_list: `${downloadURL},${downloadURL2},${downloadURL3}`,
      };

      console.log(bodyParameters, 'koti Duddu=================================>');

      const result = await AsyncStorage.getItem('userToken');
      // console.log(result, 'srnnnnnnnnn');
      setIsLoading(true);
      const interstPostResponse = await fetch(
        'http://13.48.156.8:4000/User-Apis//Add-Images-User',
        {
          method: 'POST',
          body: JSON.stringify(bodyParameters),
          headers: {
            'Content-Type': 'application/json',
            'x-access-token': JSON.parse(result),
          },
        },
      );

      let res = await interstPostResponse.json();
      // console.log(res, 'kkkkkkkk');
      if (res?.success == true) {
        await AsyncStorage.setItem('LoginToken', JSON.stringify(res.token));
        setIsLoading(false);
        navigation.replace('DrawerNav');
      } else {
        setIsLoading(false);
      }
    }
  };


  const getOccupation = async () => {
    try {
      setIsLoading(true);
      const result = await AsyncStorage.getItem('userToken');
      // console.log(result,'valuuuu first')
      const OccuapationResponse = await fetch(
        'http://13.48.156.8:4000/User-Apis/Get-Occupation',
        {
          headers: {
            'Content-Type': 'application/json',
            'x-access-token': JSON.parse(result),
          },
        },
      );
      let res = await OccuapationResponse.json();
      setOccupayData(res);
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching occupation:', error);
      setIsLoading(false);
    }
  };

  const getQualifications = async () => {
    try {
      setIsLoading(true);
      const result = await AsyncStorage.getItem('userToken');
      const qualifiactionResponse = await fetch(
        'http://13.48.156.8:4000/User-Apis/Get-Qualifications',
        {
          headers: {
            'Content-Type': 'application/json',
            'x-access-token': JSON.parse(result),
          },
        },
      );
      let res = await qualifiactionResponse.json();
      setQualifyData(res);
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching qualifications:', error);
      setIsLoading(false);
    }
  };

  const getExplore = async () => {
    setIsLoading(true);
    const result = await AsyncStorage.getItem('userToken');
    // console.log(result,'value333')
    const exploreResponse = await fetch(
      'http://13.48.156.8:4000/User-Apis/Get-Explore',
      {
        headers: {
          'Content-Type': 'application/json',
          'x-access-token': JSON.parse(result),
        },
      },
    );
    let res = await exploreResponse.json();

    if (res?.success == true) {
      setExploreData(res);
      setIsLoading(false);
    } else {
      setShowModal(true);
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
          {text: 'YES', onPress: () => BackHandler.exitApp()},
        ],
        {cancelable: false},
      );
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );
    getOccupation();
    getQualifications();
    getExplore();

    return () => backHandler.remove();
  }, []);

  const uploadImage = async val => {
    try {
      let image;
      if (val === 'camera') {
        image = await ImageCropPicker.openCamera({
          width: 300,
          height: 400,
          cropping: true,
        });
        setVisible(false);
      } else if (val === 'gallery') {
        image = await ImageCropPicker.openPicker({
          width: 300,
          height: 400,
          cropping: true,
        });
        setVisible(false);
      }

      const imageUri = image.path;

      const uploadImageList = selectedValues.pickedImages.map(each => {
        if (each.id === selectId) {
          return {
            ...each,
            imageUrl: imageUri,
          };
        } else {
          return each;
        }
      });
      // console.log('===>>', uploadImageList);
      setSelectedValues({
        ...selectedValues,
        pickedImages: uploadImageList,
      });
    } catch (error) {
      setIsLoading(false);
    }
    // setShowModal(false)
  };

  return (
    // <LinearGradient colors={globalColor.bgColor} style={styles.Container}>
     <View style={styles.Container}>

    
      <View style={{width: wp(100), alignItems: 'center'}}>
        <Image
          style={styles.splashimage}
          source={require('../../assets/appLogo.png')}
        />
        {/* <Text
          style={{
            fontSize: hp(3),
            marginVertical: hp(4),
            color: globalColor.firstColor,
            fontWeight: '600',
          }}>
          {' '}
          Profile Creation
        </Text> */}
        <View style={{height: hp(6), marginTop: hp(2.5),marginBottom:hp(1)}}>
          <GlobalDropDown
            data={profession}
            placeholder="Occupation"
            dropdownIcon="webcam"
            onValueChange={profession =>
              handleInputChange('profession', profession)
            }
          />
        </View>
        <View style={{height: hp(6), marginVertical: hp(1)}}>
          <GlobalDropDown
            data={education}
            placeholder="Highest Qualification"
            dropdownIcon="ideogram-cjk-variant"
            onValueChange={education =>
              handleInputChange('education', education)
            }
          />
        </View>
        <View style={{height: hp(6), marginVertical: hp(1)}}>
          <GlobalDropDown
            data={explore}
            placeholder="What you like to Explore"
            dropdownIcon="ideogram-cjk-variant"
            onValueChange={explore =>
              handleInputChange('explore', explore)
            }
          />
        </View>

         
         {
          context.modeId == '3' && (

            <View style={{height: hp(6), marginVertical: hp(1)}}>
            <GlobalTextInput
                placeholder="Experience"
                onChangeText={text => handleInputChange2('experience', text)}
                value={selectedValues.experience}
                iconName="bag-checked"
                iconSize={25}
                iconColor={globalColor.firstColor}
              />
            </View>
          )
         }

           {
            context.modeId == '3' &&  (
              <View style={{height: hp(6), marginVertical: hp(1)}}>
              <GlobalTextInput
                  placeholder="Enter Price"
                  onChangeText={text => handleInputChange2('price', text)}
                  value={selectedValues.price}
                  iconName="currency-inr"
                  iconSize={25}
                  iconColor={globalColor.firstColor}
                />
              </View>
            )
           }
       
       
        

        <View style={{alignSelf: 'center', width: wp(85)}}>
          <Text style={styles.text}>Upload Recent Photos :</Text>
          <Text style={styles.normaltext}>
            Upload atleast one picture. Add more pictures to make your profile
            stand out.
          </Text>
          <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
            {selectedValues.pickedImages.map((each, index) => (
              <View key={index} style={styles.boxImage}>
                {each.imageUrl ? (
                  <Image style={styles.i} source={{uri: each.imageUrl}} />
                ) : (
                  <TouchableOpacity onPress={() => showModalPic(each.id)}>
                    <ImageBackground
                      style={styles.i}
                      source={require('../../assets/pimage.png')}>
                      <MaterialCommunityIcons
                        name="plus-circle"
                        size={25}
                        color={globalColor.firstColor}
                      />
                    </ImageBackground>
                  </TouchableOpacity>
                )}
              </View>
            ))}
          </View>
        </View>
      </View>

      <TouchableOpacity
        onPressIn={form3Validation}
        style={{position: 'absolute', bottom: 40, right: 50}}>
        <AntDesign
          name="rightcircle"
          size={55}
          color={globalColor.firstColor}
        />
      </TouchableOpacity>

      {isLoading && <LoadingIndicator />}
      {showModal && (
        <GlobalModal
          modalVisible={showModal}
          handleModelPress={() => setShowModal(false)}
          modalText={{
            buttonText: 'OK',
            headerValue: 'Ooops....!',
            inValid: showModal ? errorModalText : 'Invalid Response',
          }}
        />
      )}
      <Modal
        visible={visible}
        onDismiss={hideModalPic}
        contentContainerStyle={containerStyle}>
        <View style={{alignSelf: 'flex-end', marginBottom: hp(1)}}>
          <Entypo
            onPress={() => setVisible(false)}
            name="circle-with-cross"
            size={25}
            color="red"
          />
        </View>

        <TouchableOpacity
          onPress={() => {
            uploadImage('camera');
          }}
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            borderWidth: 1,
            padding: 10,
            borderRadius: 5,
          }}>
          <Text style={styles.cameraName}> Take a photo </Text>
          <MaterialCommunityIcons name="camera-plus" size={25} color="grey" />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            uploadImage('gallery');
          }}
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            borderWidth: 1,
            padding: 10,
            borderRadius: 5,
          }}>
          <Text style={styles.cameraName}>Photo from Gallery</Text>
          <AntDesign name="picture" size={25} color="grey" />
        </TouchableOpacity>
      </Modal>
      </View>
    // </LinearGradient>
  );
};

export default Profile3;

const styles = StyleSheet.create({
  Container: {
    // flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    height:hp(100),
    width:wp(100)
  },
  splashimagesmall: {
    height: hp(12),
    width: wp(45),
    resizeMode: 'contain',
    marginVertical: hp(2.5),
    marginLeft: wp(2),
  },
  boldText: {
    fontSize: hp(3.5),
    fontFamily: commonfonts.extraBold,
    color: globalColor.firstColor,
    marginVertical: hp(2),
  },
  text: {
    fontSize: hp(2),
    fontFamily: commonfonts.extraBold,
    color:'black',
    marginVertical: hp(2),
  },
  normaltext: {
    fontSize: hp(1.7),
    fontFamily: commonfonts.extraBold,
    color: 'black',
    marginVertical: hp(2),
  },
  boxImage: {
    height: hp(11),
    width: wp(24),
    backgroundColor: 'white',
    borderRadius: 15,
  },
  i: {
    height: hp(11),
    width: wp(24),
    borderRadius: 15,
    alignItems: 'flex-end',
    justifyContent: 'flex-end',
    padding: 5,
  },
  splashimage: {
    height: hp(15),
    width: wp(50),
    resizeMode: 'contain',
    position: 'absolute',
    top: hp(-13),

  },
});
