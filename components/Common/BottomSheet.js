
import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  StyleSheet,
  Dimensions,
  Animated,
} from 'react-native';
import { PanGestureHandler } from 'react-native-gesture-handler';
import { colors, } from '../../constants/theme';


const { WHITE, BLACK, DARK_GREY, } = colors;

const { height, } = Dimensions.get('window');
const bottomSheetHeight = -height;

const BottomSheet = ({ backgroundColor, children, onDismiss, visible, disabled, }) => {
  const [open, setOpen] = useState(false);
  const bottom = useRef(new Animated.Value(bottomSheetHeight)).current;

  useEffect(() => {
    if (visible) {
      setOpen(visible);
      Animated.timing(bottom, {
        toValue: 0,
        friction: 3,
        useNativeDriver: false,
      }).start();
    } else {
      Animated.timing(bottom, {
        toValue: bottomSheetHeight,
        friction: 3,
        useNativeDriver: false,
      }).start(() => {
        setOpen(visible);
      });
    }
  }, [visible]);

  const onGesture = (event) => {
    if (!disabled && event.nativeEvent.translationY > 0) {
        bottom.setValue(-event.nativeEvent.translationY);
    }
  };

  const onGestureEnd = () => {
    if (!disabled) {
      onDismiss();
    }
  };

  if (!open) {
    return null;
  }

  return (
    <Animated.View
      style={[styles.container,
        {
          backgroundColor: backgroundColor || WHITE,
          bottom,
        }]}
    >
      <PanGestureHandler onGestureEvent={onGesture} onEnded={onGestureEnd}>
        <View style={styles.paneWrapper}>
          <View style={styles.paneOpener} />
        </View>
      </PanGestureHandler>
      {children}
    </Animated.View>
  );
};


const styles = StyleSheet.create({
  container: {
    width: '100%',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    shadowColor: BLACK,
    shadowOffset: { width: 0, height: 0, },
    shadowOpacity: 0.24,
    shadowRadius: 5,
    elevation: 5,
    position: 'absolute',
    left: 0,
    right: 0,
  },
  paneWrapper: {
    width: '100%',
    paddingVertical: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  paneOpener: {
    width: 70,
    height: 5,
    borderRadius: 5,
    backgroundColor: DARK_GREY,
    alignSelf: 'center',
  },
});

export default BottomSheet;
