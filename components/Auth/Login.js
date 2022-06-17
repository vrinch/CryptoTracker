
import React, { useState, useEffect, } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableHighlight,
  TouchableWithoutFeedback,
} from 'react-native';
import { MaterialCommunityIcons } from 'react-native-vector-icons';
import { Button, BottomSheet } from '../Common';
import { colors, } from '../../constants/theme';


const {
  TEXT_BLACK,
  WHITE,
  TEXT_GREY,
  BUTTONCOLOR,
  LIGHT_GREY,
} = colors;

const Login = ({ onPress, disabledPanSwipe, tagNameSelected, selectedTagName,
                data, onPressClose, ...props }) => {
  const [activeTagName, setActiveTagName] = useState(selectedTagName);

  useEffect(() => {
    setActiveTagName(selectedTagName);
  }, [selectedTagName]);

  const handleSelection = ({ tagName }) => {
    setActiveTagName(tagName);
    tagNameSelected(tagName);
  };


  const renderItem = ({ item }) => {
    const checkTagName = activeTagName === item.tagName;

    return (
      <TouchableHighlight
        activeOpacity={0.6}
        underlayColor={LIGHT_GREY}
        onPress={handleSelection.bind(this, item)}
        key={item.tagName}
        disabled={disabledPanSwipe}
      >
        <View style={styles.tagWrapper}>
          <Text
            style={[{ color: checkTagName ? BUTTONCOLOR : TEXT_BLACK }, styles.tagNameStyle]}
          >
            {item.tagName}
          </Text>
          {checkTagName &&
            <View style={styles.tagCheckWrapper}>
              <MaterialCommunityIcons name='check-bold' size={13} color={WHITE} />
            </View>
          }
        </View>
      </TouchableHighlight>
    );
  };


  return (
    <View style={styles.modalStyle}>
      <TouchableWithoutFeedback onPress={onPressClose} disabled={disabledPanSwipe}>
        <View style={styles.blankWrapper} />
      </TouchableWithoutFeedback>
      <View style={styles.container}>
        <BottomSheet disabled={disabledPanSwipe} {...props}>
          <View style={styles.contentWrapper}>
            <Text style={styles.titleStyle}>
              Select Crypto Tracker Tag
            </Text>
            <Text style={styles.infoTextStyle}>
              Please select the your Tracker Crypto account you want to access
            </Text>
            <View style={styles.flatlistWrapper}>
              <FlatList
                data={data}
                renderItem={renderItem}
                keyExtractor={(item, index) => index.toString()}
                extraData={data}
              />
            </View>


          </View>
          <Button
            title={'Proceed'}
            style={{ marginVertical: 10 }}
            onPress={onPress}
            {...props}
          />
        </BottomSheet>
      </View>
    </View>
  );
};


const styles = StyleSheet.create({
  modalStyle: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 1,
    elevation: 5,
    // backgroundColor: 'rgba(0, 0, 0, 0.4)',
  },
  blankWrapper: {
    flex: 1,
  },
  contentWrapper: {
    width: '100%',
  },
  titleStyle: {
    fontSize: 20,
    paddingHorizontal: 20,
    color: TEXT_BLACK,
    paddingBottom: 5,
    fontFamily: 'CircularMedium',
  },
  infoTextStyle: {
    paddingHorizontal: 20,
    fontSize: 12,
    fontFamily: 'CircularMedium',
    color: TEXT_GREY,
    paddingBottom: 5,
  },
  flatlistWrapper: {
    maxHeight: 200,
    width: '100%',
  },
  tagWrapper: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    justifyContent: 'space-between',
  },
  tagNameStyle: {
    fontFamily: 'CircularMedium',
    fontSize: 15,
    paddingVertical: 15,
    textTransform: 'capitalize',
  },
  tagCheckWrapper: {
    width: 25,
    height: 25,
    borderRadius: 25,
    backgroundColor: BUTTONCOLOR,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default Login;
