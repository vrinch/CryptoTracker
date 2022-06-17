
import React, { useRef, } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Platform,
} from 'react-native';
import {
  Feather,
} from 'react-native-vector-icons';
import { MaterialIndicator } from 'react-native-indicators';
import { colors, } from '../../constants/theme';


const { WHITE, BUTTONCOLOR, } = colors;


const AnimatedTouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity);

const SCALE = {
  // this defines the terms of our scaling animation.
  getScaleTransformationStyle(
    animated: Animated.Value, startSize: number = 1, endSize: number = 0.99) {
    const interpolation = animated.interpolate({
      inputRange: [0, 1],
      outputRange: [startSize, endSize],
    });
    return {
      transform: [
        { scale: interpolation },
      ],
    };
  },
  // This defines animation behavior we expext onPressIn
  pressInAnimation(animated: Animated.Value, duration: number = 150) {
    animated.setValue(0);
    Animated.timing(animated, {
      toValue: 1,
      duration,
      useNativeDriver: true,
    }).start();
  },
  // This defines animatiom behavior we expect onPressOut
  pressOutAnimation(animated: Animated.Value, duration: number = 150) {
    animated.setValue(1);
    Animated.timing(animated, {
      toValue: 0,
      duration,
      useNativeDriver: true,
    }).start();
  },
};


const Button = ({ isLoading, title, disabled, opacity, style, copilot, fontSize,
        buttonColor, buttonTextColor, onPress, showIcon, iconType, showRight, showLeft,
        ...props }) => {
  const scaleOutAnimated = useRef(new Animated.Value(0)).current;
  const newButtonStyle = SCALE.getScaleTransformationStyle(scaleOutAnimated, 1, 0.97);

  const DirectButton = () => (
    <View style={[style, styles.buttonWrapper]} {...props}>
      {isLoading ?
        <View style={[{ backgroundColor: buttonColor || BUTTONCOLOR }, styles.btnWrap]}>
          <MaterialIndicator
            size={fontSize ? (fontSize + 9) : 22}
            allowFontScaling={false}
            color={buttonTextColor || WHITE}
            style={{
              paddingVertical: Platform.OS === 'ios' ? 19 : 15,
              flex: 0,
              alignSelf: 'center',
            }}
          />
        </View>
        :
        <AnimatedTouchableOpacity
          style={[
            {
              opacity,
              backgroundColor: buttonColor || BUTTONCOLOR },
            newButtonStyle,
            styles.btnWrap]}
          disabled={disabled}
          onPress={onPress}
          onPressIn={() => { SCALE.pressInAnimation(scaleOutAnimated); }}
          onPressOut={() => { SCALE.pressOutAnimation(scaleOutAnimated); }}
          activeOpacity={1}
          {...copilot}
        >
          <Text
            style={[{
              color: buttonTextColor || WHITE,
              fontSize: fontSize || 13,
            },
              styles.btnTextStyle
            ]}
            allowFontScaling={false}
          >{title}</Text>
        </AnimatedTouchableOpacity>
      }
    </View>
  );

  const RightButton = () => (
    <View style={[style, styles.buttonWrapper]} {...props}>
      {isLoading ?
        <View style={[{ backgroundColor: buttonColor || BUTTONCOLOR }, styles.btnWrap]}>
          <MaterialIndicator
            size={fontSize ? (fontSize + 9) : 22}
            allowFontScaling={false}
            color={buttonTextColor || WHITE}
            style={{
              paddingVertical: Platform.OS === 'ios' ? 19 : 15,
              flex: 0,
              alignSelf: 'center',
            }}
          />
        </View>
        :
        <AnimatedTouchableOpacity
          style={[
            {
              opacity,
              backgroundColor: buttonColor || BUTTONCOLOR },
            newButtonStyle,
            styles.btnHorizontalWrap]}
          disabled={disabled}
          onPress={onPress}
          onPressIn={() => { SCALE.pressInAnimation(scaleOutAnimated); }}
          onPressOut={() => { SCALE.pressOutAnimation(scaleOutAnimated); }}
          activeOpacity={1}
          {...copilot}
        >
          <Text
            style={[{
              color: buttonTextColor || WHITE,
              fontSize: fontSize || 13,
            },
              styles.btnTextStyle
            ]}
            allowFontScaling={false}
          >{title}</Text>
          {!showIcon &&
            <Feather
              color={buttonTextColor || WHITE}
              size={20}
              name={iconType || 'arrow-right'}
            />
          }
        </AnimatedTouchableOpacity>
      }
    </View>
  );

  const LeftButton = () => (
    <View style={[style, styles.buttonWrapper]} {...props}>
      {isLoading ?
        <View style={[{ backgroundColor: buttonColor || BUTTONCOLOR }, styles.btnWrap]}>
          <MaterialIndicator
            size={fontSize ? (fontSize + 9) : 22}
            allowFontScaling={false}
            color={buttonTextColor || WHITE}
            style={{
              paddingVertical: Platform.OS === 'ios' ? 19 : 15,
              flex: 0,
              alignSelf: 'center',
            }}
          />
        </View>
        :
        <AnimatedTouchableOpacity
          style={[
            {
              opacity,
              backgroundColor: buttonColor || BUTTONCOLOR },
            newButtonStyle,
            styles.btnHorizontalWrap]}
          disabled={disabled}
          onPress={onPress}
          onPressIn={() => { SCALE.pressInAnimation(scaleOutAnimated); }}
          onPressOut={() => { SCALE.pressOutAnimation(scaleOutAnimated); }}
          activeOpacity={1}
          {...copilot}
        >
          {!showIcon &&
            <Feather
              color={buttonTextColor || WHITE}
              size={20}
              name={iconType || 'arrow-right'}
            />
          }
          <Text
            style={[{
              color: buttonTextColor || WHITE,
              fontSize: fontSize || 13,
            },
              styles.btnTextStyle
            ]}
            allowFontScaling={false}
          >{title}</Text>
        </AnimatedTouchableOpacity>
      }
    </View>
  );

  if (showLeft) {
    return LeftButton();
  } else if (showRight) {
    return RightButton();
  }
  return DirectButton();
};


const styles = StyleSheet.create({
  buttonWrapper: {
    paddingHorizontal: 20,
    width: '100%',
  },
  btnWrap: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 5,
    borderRadius: 30,
  },
  btnHorizontalWrap: {
    width: '100%',
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 5,
    paddingHorizontal: 20,
    borderRadius: 30,
  },
  btnTextStyle: {
    fontFamily: 'CircularMedium',
    paddingVertical: Platform.OS === 'ios' ? 22 : 18,
  },
});

export default Button;
