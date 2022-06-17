import React, { useEffect, useRef } from 'react';
import {
  Text,
  StyleSheet,
  Animated,
} from 'react-native';
import { colors, } from '../../constants/theme';


const { WHITE, TEXT_BLACK, } = colors;

const viewPosition = -300;

const ErrorWrapper = ({ backgroundColor, errorMessage, closeable,
  visible, onDismiss, }) => {
  const slideError = useRef(new Animated.Value(viewPosition)).current;

  useEffect(() => {
    if (visible) {
      Animated.timing(slideError, {
        toValue: 0,
        friction: 3,
        useNativeDriver: false,
      }).start(() => {
        setTimeout(() => {
          handleCloseSlider();
        }, 2000);
      });
    } else if (!visible && closeable) {
      Animated.timing(slideError, {
        toValue: 0,
        friction: 3,
        useNativeDriver: false,
      }).start();
    } else if (!visible && !closeable) {
      Animated.timing(slideError, {
        toValue: viewPosition,
        friction: 3,
        useNativeDriver: false,
      }).start();
    }
  }, [visible, closeable]);


  const handleCloseSlider = () => {
    Animated.timing(slideError, {
      toValue: viewPosition,
      friction: 3,
      useNativeDriver: false,
    }).start(() => {
      onDismiss();
    });
  };


  return (
    <Animated.View
      style={[
        {
          top: slideError,
          backgroundColor },
           styles.container]}
    >
      <Text style={styles.errorMessage}>
        {errorMessage}
      </Text>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    position: 'absolute',
    shadowColor: TEXT_BLACK,
    paddingTop: 30,
    paddingBottom: 20,
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 8 },
    shadowRadius: 5,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    zIndex: 999999999,
  },
  errorMessage: {
    fontFamily: 'CircularMedium',
    fontSize: 16,
    color: WHITE,
    paddingVertical: 10,
    flex: 1,
  },
});


export default ErrorWrapper;
