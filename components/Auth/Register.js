
import React, { useState, useEffect, } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
} from 'react-native';
import { Button, BottomSheet } from '../Common';
import { colors, } from '../../constants/theme';


const {
  TEXT_BLACK,
  LIGHT_GREY,
  TEXT_GREY,
  BUTTONCOLOR,
  MID_GREY,
} = colors;

const Register = ({ onPress, validInput, disabledPanSwipe, onPressClose, ...props }) => {
  const [keyboardStatus, setKeyboardStatus] = useState(false);
  const [borderColor, setBorderColor] = useState(MID_GREY);

  useEffect(() => {
    const showSubscription = Keyboard.addListener('keyboardDidShow', () => {
      setKeyboardStatus(true);
    });
    const hideSubscription = Keyboard.addListener('keyboardDidHide', () => {
      setKeyboardStatus(false);
      setBorderColor(MID_GREY);
    });

    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, []);

  const onFocus = () => {
    setBorderColor(BUTTONCOLOR);
  };

  const onBlur = () => {
    setBorderColor(MID_GREY);
  };

  return (
    <View style={styles.modalStyle}>
      <KeyboardAvoidingView
        style={styles.modalStyle}
        behavior={Platform.OS === 'ios' ? 'padding' : null}
        enabled
      >
      <TouchableWithoutFeedback onPress={onPressClose} disabled={disabledPanSwipe}>
        <View style={styles.blankWrapper} />
      </TouchableWithoutFeedback>
        <View style={styles.container}>
          <BottomSheet disabled={disabledPanSwipe} {...props}>
            <View style={styles.contentWrapper}>
              <Text style={styles.titleStyle}>
                Create your Crypto Tracker tag
              </Text>
              <View style={[{ borderColor }, styles.inputWrapper]}>
                <Text
                  style={[{
                    color: validInput ? TEXT_BLACK : TEXT_GREY },
                    styles.tagStyle]}
                >@</Text>
                <TextInput
                  placeholderTextColor={TEXT_GREY}
                  style={styles.inputStyle}
                  onFocus={onFocus}
                  onBlur={onBlur}
                  autoCorrect={false}
                  placeholder={'janedoe'}
                  maxLength={10}
                  underlineColorAndroid="transparent"
                  returnKeyType='done'
                  // autoFocus
                  autoCorrect={false}
                  keyboardType='visible-password'
                  autoCapitalize='none'
                  // enablesReturnKeyAutomatically
                  {...props}
                />
              </View>

              <Text style={styles.infoTextStyle}>
                Your tag must be at least 3 characters and cannot be more than 10 characters.
              </Text>
            </View>
            <Button
              title={'Proceed'}
              style={{
                marginVertical: 10,
                marginBottom: (keyboardStatus && Platform.OS === 'ios') ? 20 : 10,
              }}
              onPress={onPress}
              {...props}
            />
          </BottomSheet>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
};


const styles = StyleSheet.create({
  modalStyle: {
    ...StyleSheet.absoluteFillObject,
    // backgroundColor: 'rgba(0, 0, 0, 0.4)',
  },
  blankWrapper: {
    flex: 1,
  },
  contentWrapper: {
    paddingHorizontal: 20,
    width: '100%',
  },
  titleStyle: {
    fontSize: 20,
    color: TEXT_BLACK,
    paddingBottom: 20,
    fontFamily: 'CircularMedium',
  },
  inputWrapper: {
    width: '100%',
    flexDirection: 'row',
    paddingHorizontal: 15,
    height: 55,
    borderRadius: 10,
    alignItems: 'center',
    backgroundColor: LIGHT_GREY,
    borderWidth: 2,
  },
  tagStyle: {
    fontSize: 20,
    fontFamily: 'CircularMedium',
  },
  inputStyle: {
    width: '100%',
    height: '100%',
    fontFamily: 'CircularMedium',
    fontSize: 20,
  },
  infoTextStyle: {
    fontSize: 12,
    fontFamily: 'CircularMedium',
    color: TEXT_GREY,
    textAlign: 'center',
    paddingTop: 15,
  },
});

export default Register;
