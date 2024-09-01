import {View, Text, Image, StyleSheet, Dimensions} from 'react-native';
import React, {useState, useCallback, useEffect} from 'react';
import {GiftedChat} from 'react-native-gifted-chat';
import firestore from '@react-native-firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Entypo from 'react-native-vector-icons/Entypo';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {commonfonts} from '../../../locales/globalFontFamily';
import {globalColor} from '../../../locales/appColors';
import LoadingIndicator from '../../../atoms/LoadingIndicator';
import GlobalModal from '../../../atoms/GlobalModal';
import {Modal} from 'react-native-paper';
import GlobalButton from '../../../atoms/GlobalButton';

const ChatScreen = ({route, navigation}) => {
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [visible, setVisible] = useState(false);
  const [myId, setMyId] = useState();

  // const showModal = () => setVisible(true);
  const hideModal = () => setVisible(false);
  const containerStyle = {
    backgroundColor: 'white',
    padding: 20,
    margin: 20,
    paddingVertical: hp(5),
    borderRadius:10
  };

  console.log(route.params.uid.user_id, 'kotitiititiitititiitititititi');

  const requiredUserId = async () => {
    const result = await AsyncStorage.getItem('userId');
    console.log(result, 'kkkkk');
    if (result !== null) {
      setMyId(result);
      const docid =
        route.params.uid.user_id > result
          ? result + '-' + route.params.uid.user_id
          : route.params.uid.user_id + '-' + result;

      const messageRef = firestore()
        .collection('Chatrooms')
        .doc(docid)
        .collection('messages')
        .orderBy('createdAt', 'desc');

      messageRef.onSnapshot(querySnap => {
        const allmsg = querySnap.docs.map(docSnap => {
          const data = docSnap.data();
          if (data.createdAt) {
            return {
              ...docSnap.data(),
              createdAt: docSnap.data().createdAt.toDate(),
            };
          } else {
            return {
              ...docSnap.data(),
              createdAt: new Date(),
            };
          }
        });

        if (allmsg.length !== 0) {
          setMessages(allmsg);
        }
      });
    }
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      requiredUserId();
    });
    return unsubscribe;
  }, [route.params, myId]);

  const onSend = messageArray => {
    const msg = messageArray[0];

    const mymsg = {
      ...msg,
      sentBy: myId,
      sentTo: route.params.uid.user_id,
      createdAt: new Date(),
    };

    setMessages(previousMessages => GiftedChat.append(previousMessages, mymsg));
    const docid =
      route.params.uid.user_id > myId
        ? myId + '-' + route.params.uid.user_id
        : route.params.uid.user_id + '-' + myId;

    firestore()
      .collection('Chatrooms')
      .doc(docid)
      .collection('messages')
      .add({...mymsg, createdAt: firestore.FieldValue.serverTimestamp()});
  };

  const reportPerson = async userId => {
    console.log(userId, 'new wwwwwww');

    const bodyParameters = {
      chat_id: userId,
      comment: 'test',
    };

    console.log(bodyParameters, 'koti s');

    setIsLoading(true);
    const result = await AsyncStorage.getItem('userToken');
    const connectionResponse = await fetch(
      'http://13.48.156.8:4000/User-Apis/Report-Profile',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-access-token': JSON.parse(result), // Assuming your token needs to be parsed from JSON.
        },
        body: JSON.stringify({
          chat_id: userId,
          comment: 'testcomments',
        }),
      }
    );
    let res = await connectionResponse.json();
    console.log(res, 'final checkingggggg');
    if (res?.success == true) {
      setVisible(false)
      setIsLoading(false)
      navigation.goBack()
    } else {
      setIsLoading(false);
    }
  };

  const unMatchedPerson = async userId => {
    console.log(userId, 'new wwwwwww');

    const bodyParameters = {
      chat_id: userId,
    };

    console.log(bodyParameters, 'koti s');

    setIsLoading(true);
    const result = await AsyncStorage.getItem('userToken');
    const connectionResponse = await fetch(
      'http://13.48.156.8:4000/User-Apis/Unmatch-Profile',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-access-token': JSON.parse(result),
        },
        body: JSON.stringify({
          chat_id: userId,
        }),
      }
    );
    let res = await connectionResponse.json();
    console.log(res, 'final checkingggggg');
    if (res?.success == true) {
      setVisible(false)
      setIsLoading(false)
      navigation.goBack()
    } else {
      setIsLoading(false);
    }
  };

  return (
    <View style={{flex: 1}}>
      <View style={styles.headerView}>
        <View
          style={{flexDirection: 'row', alignItems: 'center', columnGap: 5}}>
          <Ionicons
            onPress={() => navigation.goBack()}
            name="arrow-back"
            size={25}
            color="white"
          />
          <View style={styles.circle}>
            <Image
              source={{
                uri: route.params.uid.profilePic
                  ? route.params.uid.profilePic
                  : 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRwubkKsF_lBiBVy3bWVkVN5Ema3oUrG08vTQ&usqp=CAU',
              }}
              style={styles.empolyeimage}
            />
          </View>
        </View>

        <Text style={styles.name}>{route.params.uid.name}</Text>
        <Entypo
          onPress={() => setVisible(true)}
          name="dots-three-horizontal"
          size={30}
          color="white"
        />
      </View>

      <GiftedChat
        messages={messages}
        onSend={text => onSend(text)}
        user={{
          _id: myId,
        }}
        renderAvatar={props => (
          <Image
            source={{
              uri: route.params.uid.profilePic
                ? route.params.uid.profilePic
                : 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRwubkKsF_lBiBVy3bWVkVN5Ema3oUrG08vTQ&usqp=CAU',
            }}
            style={styles.empolyeimage}
          />
        )}
      />

      {isLoading && <LoadingIndicator />}
      {showModal && (
        <GlobalModal
          modalVisible={showModal}
          handleModelPress={() => {
            setShowModal(false);
            navigation.goBack();
          }}
          modalText={{
            buttonText: 'OK',
            headerValue: 'Rported successfully',
            inValid: '-------',
          }}
        />
      )}

      <Modal
        visible={visible}
        onDismiss={hideModal}
        contentContainerStyle={containerStyle}>
            <View style={{position:'absolute',top:hp(2),right:wp(5)}}>
            <Entypo
          onPress={() => setVisible(false)}
          name="circle-with-cross"
          size={25}
          color="red"
        />
            </View>
       

        <View style={{rowGap: 15, alignSelf: 'center',marginTop:hp(3)}}>
          <GlobalButton
            title="Unmatched Profile"
            style={styles.button}
            textStyle={styles.bttext}
            onPress={() => unMatchedPerson(route.params.uid.id)}

           
          />
          <GlobalButton
            style={styles.button}
            textStyle={styles.bttext}
            title="Unmatched Profile / Report"
            onPress={() => reportPerson(route.params.uid.id)}
          />
        </View>
      </Modal>
    </View>
  );
};
export default ChatScreen;

const styles = StyleSheet.create({
  empolyeimage: {
    borderRadius:
      Math.round(
        Dimensions.get('window').width + Dimensions.get('window').height,
      ) / 2,
    width: Dimensions.get('window').width * 0.1,
    height: Dimensions.get('window').width * 0.1,
  },
  headerView: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    // columnGap: 80,
    paddingVertical: hp(1),
    paddingHorizontal: wp(4.5),
    backgroundColor: globalColor.headerColor,
  },
  name: {
    fontSize: hp(2.5),
    fontFamily: commonfonts.medium,
    color: globalColor.white,
    marginRight: wp(15),
  },
  circle: {
    borderRadius:
      Math.round(
        Dimensions.get('window').width + Dimensions.get('window').height,
      ) / 2,
    width: Dimensions.get('window').width * 0.12,
    height: Dimensions.get('window').width * 0.12,
    backgroundColor: globalColor.headerColor,
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    width: wp(75),
    textAlign: 'center',
  },
  bttext: {
    fontSize: hp(2),
  },
});
