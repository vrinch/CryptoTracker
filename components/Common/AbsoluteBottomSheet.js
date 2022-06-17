import React, { useEffect, useRef, } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Dimensions,
} from 'react-native';
import { Ionicons } from 'react-native-vector-icons';

import { colors, } from '../../constants/theme';


const { WHITE, TEXT_BLACK, SECONDARY, BLACK, } = colors;

const { height, } = Dimensions.get('window');

const AbsoluteBottomSheet = ({ viewPosition, onPressClose, disabled, title,
  containerBackgroundColor, showHeader, showCloseButton, closeButtonColor,
  contentContainerStyle, children, sheetStyle, contentBackgroundColor, }) => {
  const sliderInView = useRef(new Animated.Value(viewPosition)).current;

  useEffect(() => {
    Animated.timing(sliderInView, {
      toValue: 0,
      friction: 3,
      useNativeDriver: false,
    }).start();
  }, []);

  const backgroundColor = containerBackgroundColor || 'rgba(0, 0, 0, 0.6)';


  return (
    <View style={[{ backgroundColor }, contentContainerStyle, styles.modalStyle]}>
      <TouchableWithoutFeedback onPress={onPressClose} disabled={disabled}>
        <View style={styles.blankWrapper} />
      </TouchableWithoutFeedback>
      <Animated.View
      style={[{
        bottom: sliderInView,
        maxHeight: height - 150,
        backgroundColor: contentBackgroundColor || WHITE },
        sheetStyle, styles.contentWrapper]}>
        {showHeader &&
          <View style={styles.headerWrapper}>
            <Text style={styles.headerTextStyle}>
              {title}
            </Text>
            {showCloseButton &&
              <TouchableOpacity
                onPress={onPressClose}
                disabled={disabled}
                style={[{ backgroundColor: closeButtonColor || SECONDARY }, styles.closeButtonStyle]}
              >
                <Ionicons name={'close'} color={WHITE} size={20} />
              </TouchableOpacity>
            }
          </View>
        }

        {children}
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  modalStyle: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    zIndex: 1,
  },
  blankWrapper: {
    flex: 1,
  },
  contentWrapper: {
    width: '100%',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingVertical: 20,
    shadowColor: BLACK,
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 8 },
    shadowRadius: 5,
    zIndex: 2,
    elevation: 1,
  },
  headerWrapper: {
    width: '100%',
    paddingHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTextStyle: {
    fontFamily: 'PoppinsBold',
    fontSize: 12,
    color: TEXT_BLACK,
    paddingVertical: 10,
  },
  closeButtonStyle: {
    width: 30,
    height: 30,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 5,
  },
});

export default AbsoluteBottomSheet;
