import React, { useState, useRef } from 'react';
import { View, Text, FlatList, StyleSheet, Dimensions ,TouchableOpacity,Image} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import GlobalButton from '../../atoms/GlobalButton';
import { commonfonts } from '../../locales/globalFontFamily';

const { width: screenWidth } = Dimensions.get('window');

const data = [
  { id: '1', text: 'Get Go2Date Silver', buttonText: 'Get Go2Date Silver' },
  { id: '2', text: 'Get Go2Date Gold', buttonText: 'Get Go2Date Gold' },
  { id: '3', text: 'Get Go2Date Platinum', buttonText: 'Get Go2Date Platinum' },
];

const DotIndicator = ({ length, currentIndex }) => {
    return (
      <View style={styles.dotContainer}>
        {Array.from({ length: length }).map((_, index) => (
          <View
            key={index}
            style={[
              styles.dot,
              currentIndex === index ? styles.activeDot : styles.inactiveDot,
            ]}
          />
        ))}
      </View>
    );
  }
const Carousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef();

  const renderItem = ({ item }) => (
    <View style={styles.itemContainer}>
        <View style={{flexDirection:'row',alignItems:'center',height:hp(5)}}>
            {/* <Image style={styles.imagefire} source={require('../../Images/fire.png')} /> */}
            <MaterialCommunityIcons   name='fire'  size={40} color='#FF9A00' />
            <Text style={styles.itemText}>{item.text}</Text>
        </View>
      
      <Text style={styles.text}>Level up every action you take on Go2Date</Text>
      <DotIndicator length={data.length} currentIndex={currentIndex} />
      <View style={{marginTop:hp(8)}}>
      <GlobalButton 
      title={item.buttonText} 
      />
      </View>
     

    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        ref={flatListRef}
        data={data}
        keyExtractor={item => item.id}
        horizontal
        pagingEnabled
        renderItem={renderItem}
        onScroll={({ nativeEvent }) => {
          const slide = Math.round(
            nativeEvent.contentOffset.x / nativeEvent.layoutMeasurement.width
          );
          if (slide !== currentIndex) {
            setCurrentIndex(slide);
          }
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
    container: {
      flex:1,
      marginTop:hp(8)
    },
    itemContainer: {
      width: screenWidth,
      alignItems: 'center', 
      height:hp(30)
   
    },
    itemText: {
     fontSize:hp(2.6),
     fontFamily:commonfonts.extraBold,
      marginBottom: 10,
      marginLeft:wp(2)
    },
    dotContainer: {
      flexDirection: 'row',
      alignSelf: 'center', 
    marginVertical:hp(2),
      backgroundColor: 'transparent', 
    },
    dot: {
      height: 15,
      width: 15,
      borderRadius: 15,
      marginHorizontal: wp(1.5), 
    },
    activeDot: {
      backgroundColor: 'black',
    },
    inactiveDot: {
      backgroundColor: 'blue',
    },
    text:{
        fontSize:hp(1.5),
        fontFamily:commonfonts.heading,
        color:'black',
       },
  });
  
export default Carousel;
