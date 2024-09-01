import {
  View,
  Text,
  StyleSheet,
  TouchableWithoutFeedback,
  Keyboard,
  TouchableOpacity,
  BackHandler,
  FlatList,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import LinearGradient from 'react-native-linear-gradient';
import {globalColor} from '../../../locales/appColors';
import Globalhaeder from '../../GlobalComponets/Globalhaeder';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {commonfonts} from '../../../locales/globalFontFamily';
import GlobalTextInput from '../../../atoms/GlobalTextInput';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import GlobalDropDown from '../../../atoms/GlobalDropDown';
import DatePicker from 'react-native-date-picker';
import {ScrollView} from 'react-native-gesture-handler';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LoadingIndicator from '../../../atoms/LoadingIndicator';
import GlobalModal from '../../../atoms/GlobalModal';
import {GlobalContext} from '../../../context/provider';
import AntDesign from 'react-native-vector-icons/AntDesign';

const EditProfile = ({navigation}) => {
  const context = React.useContext(GlobalContext);

  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedItems, setSelectedItems] = useState([]);
  const [occupayData, setOccupayData] = useState([]);
  const [qualifyData, setQualifyData] = useState([]);
  const [profileDetails, setProfileDetails] = useState({});
  const [selectedIntrests, setSelectedIntrests] = useState([]);
  const [textmsg, setTextMsg] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    gender: '',
    selectedOffer: '',
    selectedInterest: '',
    date: null,
    zodiac: null,
    drink: null,
    smoke: null,
    children: null,
    religion: null,
    height: null,
    profession: null,
    education: null,
  });

  const profession = occupayData.occupationList?.map(
    ele => ele.occupation_name,
  );
  const education = qualifyData.qualificationsList?.map(
    ele => ele.qulification_name,
  );

  const genderOptions = ['Male', 'Female'];
  const zodiacSigns = [
    'Aries',
    'Taurus',
    'Gemini',
    'Cancer',
    'Leo',
    'Virgo',
    'Libra',
    'Scorpio',
    'Sagittarius',
    'Capricorn',
    'Aquarius',
    'Pisces',
  ];

  const drink = ['Frequnetly', 'Socially', 'rarely', 'Never', 'Sober'];
  const smoke = ['Socially', 'Never', 'Regularly'];
  const childerns = [
    'Want SomeDay',
    'Have and want more',
    'Not sure yet',
    'Have Kids',
  ];
  const religion = ['Hindhu', 'Christian', 'Buddhist', 'Atheist', 'Catholic'];
  const heightRange = {start: 3, end: 7, step: 1};
  const customButtonContainerStyle = {
    width: wp(85),
  };

  const customRowStyle = {
    width: wp(85),
    alignSelf: 'center',
  };

  //  Api Calls
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
    if (res?.success == true) {
      await context.interstDispatch({
        type: 'GET_INTERST',
        payload: res.interestTypeList,
      });
      setIsLoading(false);
    } else {
      setIsLoading(false);
    }
  };
  const getOccupation = async () => {
    try {
      setIsLoading(true);
      const result = await AsyncStorage.getItem('userToken');
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
  const getProfileDetails = async () => {
    try {
      setIsLoading(true);
      const result = await AsyncStorage.getItem('userToken');
      const matchingResponse = await fetch(
        'http://13.48.156.8:4000/User-Apis/Get-User-Deatails',
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'x-access-token': JSON.parse(result),
          },
        },
      );
      let res = await matchingResponse.json();

      if (res?.success == true) {
        setProfileDetails(res?.userdetails);
        setIsLoading(false);
      } else {
        setIsLoading(false);
      }
    } catch (error) {
      setIsLoading(false);
      console.error('Error fetching qualifications:', error);
    }
  };

  // handle Input change
  const handleInputChange = (field, value) => {
    setFormData({...formData, [field]: value});
    if (field === 'profession' && value) {
      const selectedOccupation = occupayData.occupationList.find(
        ele => ele.occupation_name === value,
      );
      if (selectedOccupation) {
        const {occupation_name, id} = selectedOccupation;
        console.log(`Selected Occupation: ${occupation_name}, ID: ${id}`);
      }
    }

    if (field === 'education' && value) {
      const selectedQualification = qualifyData.qualificationsList.find(
        ele => ele.qulification_name === value,
      );
      if (selectedQualification) {
        const {qulification_name, id} = selectedQualification;
        console.log(`Selected Qualification: ${qulification_name}, ID: ${id}`);
      }
    }
  };

  const handleOfferSelect = offer => {
    setFormData({...formData, selectedOffer: offer});
  };
  const handleSelectedInterest = item => {
    setFormData({...formData, selectedInterest: item});
  };

  getApiData = async () => {
    await getInterst();
    await getOccupation();
    await getQualifications();
    await getProfileDetails();
  };

  useEffect(() => {
    getApiData();
  }, []);

  useEffect(() => {
    if (selectedIntrests) {
      console.log(selectedIntrests, 'lllllll');
    }
    console.log(profileDetails.name, 'koti dateeed');
    if (profileDetails) {
      setFormData(prevState => ({
        ...prevState,
        name: profileDetails?.name,
        email: profileDetails?.email,
        gender: profileDetails?.gender,
        selectedOffer: profileDetails?.i_want_be,
        selectedInterest: profileDetails?.oppositeInterest,
        zodiac: profileDetails?.profiledetails?.zodicsign,
        drink: profileDetails?.profiledetails?.drink,
        smoke: profileDetails?.profiledetails?.smoke,
        children: profileDetails?.profiledetails?.children,
        religion: profileDetails?.profiledetails?.religion,
        height: profileDetails?.profiledetails?.height,
      }));
      setSelectedItems({selectedItems: profileDetails?.interestId});
      let intrests = profileDetails?.interestId
        ?.split('')
        .filter(each => each !== ',');
      const resList = context.interst.map(interestType => {
        const updatedInterestList = interestType.interestList.map(item => ({
          ...item,
          isIntrestSelected: intrests?.includes(String(item?.interest_id)),
        }));

        return {
          ...interestType,
          interestList: updatedInterestList,
        };
      });
      setSelectedIntrests(resList);
    }
  }, [profileDetails]);

  const toggleItemSelection = id => {
    console.log('id', id);
    const updatedList = selectedIntrests.map(each => {
      return {
        ...each,
        interestList: each.interestList.map(item =>
          item.interest_id == id
            ? {...item, isIntrestSelected: !item.isIntrestSelected}
            : {...item},
        ),
      };
    });
    setSelectedIntrests(updatedList);
  };

  const renderItem = ({item}) => (
    <TouchableOpacity
      onPress={() => toggleItemSelection(item.interest_id)}
      style={
        item.isIntrestSelected
          ? [styles.itemContainer, {backgroundColor: globalColor.firstColor}]
          : styles.itemContainer
      }>
      <Text style={{color: 'white', fontSize: 15}}>{item.name}</Text>
    </TouchableOpacity>
  );

  const finalEditUpdate = async () => {
    const selectedOccupation = occupayData.occupationList.find(
      ele => ele.occupation_name === formData.profession,
    );
    const occupationId = selectedOccupation ? selectedOccupation.id : 1;

    const selectedQualification = qualifyData.qualificationsList.find(
      ele => ele.qulification_name === formData.education,
    );
    const qualificationId = selectedQualification
      ? selectedQualification.id
      : 1;
    const listIdsString = selectedIntrests
      .flatMap(({interestList}) =>
        interestList
          .filter(({isIntrestSelected}) => isIntrestSelected)
          .map(({interest_id}) => interest_id),
      )
      .join(',');
      if (!listIdsString) {
        setTextMsg('OOPPS...')
        setShowModal(true);
        return; 
      }
  
      console.log(listIdsString,'testing oneeeee')

    const ediProfileDataBodydetails = {
      fullname: formData.name,
      email: formData.email,
      modeId: '1',
      gender: formData.gender,
      i_want_be: formData.selectedOffer,
      im_interest_in: formData.selectedInterest,
      dob: formData.date
        ? formData.date.toISOString().split('T')[0]
        : profileDetails?.dob?.split('T')[0],
      interests: listIdsString,
      height: formData.height,
      zodicsign: formData.zodiac,
      drink: formData.drink,
      smoke: formData.smoke,
      children: formData.children,
      religion: formData.religion,
      occupation_id: occupationId,
      qualifications_id: qualificationId,
    };

    console.log(ediProfileDataBodydetails, 'final Edit Dataaaaaaaaaaaaaaaa');
    const result = await AsyncStorage.getItem('userToken');
    setIsLoading(true);
    const profileOneResponse = await fetch(
      'http://13.48.156.8:4000/User-Apis/Update-User-Details',
      {
        method: 'POST',
        body: JSON.stringify(ediProfileDataBodydetails),
        headers: {
          'Content-Type': 'application/json',
          'x-access-token': JSON.parse(result),
        },
      },
    );
    let res = await profileOneResponse.json();
    console.log(res, 'bbbbbbbbbbbbbbbb');
    if (res?.success == true) {
      setIsLoading(false);
      await navigation.navigate('Home');
    } else {
      setIsLoading(false);
    }
  };
  // console.log('profileDetails?.dob?',profileDetails?.dob)
  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <LinearGradient colors={globalColor.bgColor} style={styles.container}>
        <DatePicker
          modal
          mode="date"
          open={open}
          date={formData.date || new Date()}
          onConfirm={date => {
            setFormData({...formData, date});
            setOpen(false);
          }}
          onCancel={() => {
            setOpen(false);
          }}
        />
        <Globalhaeder
          iconSide={
            <Ionicons
              onPress={() => navigation.navigate('DrawerNav')}
              name="arrow-back"
              size={30}
              color="white"
            />
          }
        />
        <Text style={styles.headername}>Profile Edit</Text>
        <View style={{height: hp(80), alignItems: 'center'}}>
          <ScrollView showsVerticalScrollIndicator={false}>
            <View style={styles.inputView}>
              <GlobalTextInput
                placeholder="Enter Full Name"
                onChangeText={text => handleInputChange('name', text)}
                value={formData.name}
                iconName="account"
                iconSize={25}
                iconColor={globalColor.firstColor}
              />
            </View>

            <View style={styles.inputView}>
              <GlobalTextInput
                placeholder="Enter Email Address"
                onChangeText={text => handleInputChange('email', text)}
                value={formData.email}
                iconName="gmail"
                iconSize={30}
                iconColor={globalColor.firstColor}
              />
            </View>
            <View style={styles.inputView}>
              <TouchableOpacity onPress={() => setOpen(true)}>
                <View style={styles.cal}>
                  <MaterialCommunityIcons
                    name="calendar-month"
                    size={30}
                    color={globalColor.appPrimary}
                  />
                  <Text style={{marginLeft: wp(2), fontSize: hp(2)}}>
                    {formData.date
                      ? formData.date.toISOString().split('T')[0]
                      : profileDetails?.dob?.split('T')[0]}
                  </Text>
                </View>
              </TouchableOpacity>
            </View>

            <View style={styles.inputView}>
              <GlobalDropDown
                data={genderOptions}
                placeholder={profileDetails?.gender}
                dropdownIcon="gender-male-female"
                onValueChange={gender => handleInputChange('gender', gender)}
              />
            </View>

            <View>
              <Text style={styles.optionTexthead}>I want to...</Text>
              <View style={{flexDirection: 'row', width: wp(80)}}>
                <TouchableOpacity
                  onPress={() => handleOfferSelect('Make Offers')}
                  style={[
                    styles.optionButton,
                    formData.selectedOffer === 'Make Offers' && {
                      backgroundColor: globalColor.firstColor,
                    },
                  ]}>
                  <Text
                    style={[
                      styles.optionText,
                      {
                        color:
                          formData.selectedOffer === 'Make Offers'
                            ? 'white'
                            : globalColor.firstColor,
                      },
                    ]}>
                    Make Offers
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => handleOfferSelect('Receive Offers')}
                  style={[
                    styles.optionButton,
                    formData.selectedOffer === 'Receive Offers' && {
                      backgroundColor: globalColor.firstColor,
                    },
                  ]}>
                  <Text
                    style={[
                      styles.optionText,
                      {
                        color:
                          formData.selectedOffer === 'Receive Offers'
                            ? 'white'
                            : globalColor.firstColor,
                      },
                    ]}>
                    Receive Offers
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            <View>
              <Text style={styles.optionTexthead}>
                I am Interested in meeting...
              </Text>
              <View style={{flexDirection: 'row', width: wp(80)}}>
                <TouchableOpacity
                  onPress={() => handleSelectedInterest('Men')}
                  style={[
                    styles.optionButton,
                    formData.selectedInterest === 'Men' && {
                      backgroundColor: globalColor.firstColor,
                    },
                  ]}>
                  <Text
                    style={[
                      styles.optionText,
                      {
                        color:
                          formData.selectedInterest === 'Men'
                            ? 'white'
                            : globalColor.firstColor,
                      },
                    ]}>
                    Men
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => handleSelectedInterest('Women')}
                  style={[
                    styles.optionButton,
                    formData.selectedInterest === 'Women' && {
                      backgroundColor: globalColor.firstColor,
                    },
                  ]}>
                  <Text
                    style={[
                      styles.optionText,
                      {
                        color:
                          formData.selectedInterest === 'Women'
                            ? 'white'
                            : globalColor.firstColor,
                      },
                    ]}>
                    Women
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => handleSelectedInterest('Both')}
                  style={[
                    styles.optionButton,
                    formData.selectedInterest === 'Both' && {
                      backgroundColor: globalColor.firstColor,
                    },
                  ]}>
                  <Text
                    style={[
                      styles.optionText,
                      {
                        color:
                          formData.selectedInterest === 'Both'
                            ? 'white'
                            : globalColor.firstColor,
                      },
                    ]}>
                    Both
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.inputView}>
              <GlobalDropDown
                range={heightRange}
                placeholder={profileDetails?.profiledetails?.height}
                buttonContainerStyle={customButtonContainerStyle}
                rowStyle={customRowStyle}
                dropdownIcon="human-male-height"
                onValueChange={height => handleInputChange('height', height)}
              />
            </View>
            <View style={styles.inputView}>
              <GlobalDropDown
                data={zodiacSigns}
                placeholder={profileDetails?.profiledetails?.zodicsign}
                dropdownIcon="zodiac-gemini"
                onValueChange={zodiac => handleInputChange('zodiac', zodiac)}
              />
            </View>
            <View style={styles.inputView}>
              <GlobalDropDown
                data={drink}
                placeholder={profileDetails?.profiledetails?.drink}
                dropdownIcon="glass-wine"
                onValueChange={drink => handleInputChange('drink', drink)}
              />
            </View>
            <View style={styles.inputView}>
              <GlobalDropDown
                data={smoke}
                placeholder={profileDetails?.profiledetails?.smoke}
                dropdownIcon="cigar"
                onValueChange={smoke => handleInputChange('smoke', smoke)}
              />
            </View>
            <View style={styles.inputView}>
              <GlobalDropDown
                data={childerns}
                placeholder={profileDetails?.profiledetails?.children}
                dropdownIcon="human-male-female-child"
                onValueChange={children =>
                  handleInputChange('children', children)
                }
              />
            </View>
            <View style={styles.inputView}>
              <GlobalDropDown
                data={religion}
                placeholder={profileDetails?.profiledetails?.religion}
                dropdownIcon="rhombus-split"
                onValueChange={religion =>
                  handleInputChange('religion', religion)
                }
              />
            </View>
            <View style={{height: hp(6), marginVertical: hp(2)}}>
              <GlobalDropDown
                data={profession}
                placeholder={
                  profileDetails?.occupation_name
                    ? profileDetails?.occupation_name
                    : 'Select Profession'
                }
                dropdownIcon="webcam"
                onValueChange={profession =>
                  handleInputChange('profession', profession)
                }
              />
            </View>
            <View style={{height: hp(6), marginVertical: hp(2)}}>
              <GlobalDropDown
                data={education}
                placeholder={
                  profileDetails?.qulification_name
                    ? profileDetails?.qulification_name
                    : 'Select Qualification'
                }
                dropdownIcon="ideogram-cjk-variant"
                onValueChange={education =>
                  handleInputChange('education', education)
                }
              />
            </View>

            {selectedIntrests.map(interestType => (
              <View key={interestType.type_id}>
                <Text style={styles.sectionTitle}>
                  {interestType.type_name}
                </Text>
                <FlatList
                  horizontal
                  data={interestType.interestList}
                  keyExtractor={item => item.interest_id.toString()}
                  renderItem={renderItem}
                />
              </View>
            ))}
          </ScrollView>
        </View>

        {isLoading && <LoadingIndicator />}
        {showModal && (
          <GlobalModal
            modalVisible={showModal}
            handleModelPress={() => {
              // profileMatching();
              setShowModal(false);
            }}
            modalText={{
              buttonText: 'OK',
              headerValue: textmsg,
              inValid: 'please Select Atleast one Interest',
            }}
          />
        )}

        <TouchableOpacity onPress={finalEditUpdate} style={styles.submitButton}>
          <AntDesign
            name="rightcircle"
            size={55}
            color={globalColor.firstColor}
          />
        </TouchableOpacity>
      </LinearGradient>
    </TouchableWithoutFeedback>
  );
};

export default EditProfile;

const styles = StyleSheet.create({
  container: {
    height: hp(100),
    backgroundColor: 'white',
  },
  headername: {
    fontSize: hp(3),
    fontFamily: commonfonts.bold,
    textAlign: 'center',
    marginVertical: hp(2),
    color: globalColor.firstColor,
  },
  inputView: {
    height: hp(6),
    marginVertical: hp(1),
  },
  cal: {
    height: hp(6),
    width: wp(85),
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: wp(3),
    borderRadius: 25,
    backgroundColor: globalColor.appSecondary,
  },
  optionTexthead: {
    fontSize: hp(2.3),
    color: globalColor.firstColor,
    fontFamily: commonfonts.medium,
    marginLeft: wp(2),
    marginVertical: hp(1),
  },
  optionText: {
    color: 'white',
  },
  optionButton: {
    padding: 10,
    borderRadius: 5,
    marginVertical: 5,
    alignItems: 'center',
    borderRadius: 15,
    borderWidth: 1,
    borderColor: globalColor.firstColor,
    marginHorizontal: wp(2),
  },
  itemContainer: {
    padding: 10,
    marginBottom: hp(1),
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    marginLeft: wp(1.5),
  },
  sectionContainer: {
    marginBottom: hp(2),
  },
  sectionTitle: {
    fontSize: hp(2),
    color: globalColor.firstColor,
    fontFamily: commonfonts.medium,
    marginBottom: hp(1),
    marginLeft: wp(4),
  },
  submitButton: {
    position: 'absolute',
    bottom: hp(5),
    right: wp(8),
  },
});
