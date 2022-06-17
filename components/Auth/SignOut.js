
import React from 'react';
import {
  View,
  StyleSheet,
  TouchableWithoutFeedback,
} from 'react-native';
import { Button, BottomSheet } from '../Common';
import { colors, } from '../../constants/theme';


const {
  ERROR,
  SUCCESS,
} = colors;

const SignOut = ({ disabledPanSwipe, onPressSignOut, onPressDelete,
  isLoadingSignout, isLoadingDelete, disabled, onPressClose, ...props }) => {
  return (
    <View style={styles.modalStyle}>
      <TouchableWithoutFeedback onPress={onPressClose} disabled={disabledPanSwipe}>
        <View style={styles.blankWrapper} />
      </TouchableWithoutFeedback>
      <View style={styles.container}>
        <BottomSheet disabled={disabledPanSwipe} {...props}>
          <Button
            showRight
            title={'Confirm Sign Out'}
            style={{ marginBottom: 5 }}
            onPress={onPressSignOut}
            disabled={disabled}
            buttonColor={SUCCESS}
            isLoading={isLoadingSignout}
          />
          <Button
            showRight
            title={'Delete Tag'}
            style={{ marginBottom: 20 }}
            onPress={onPressDelete}
            buttonColor={ERROR}
            disabled={disabled}
            isLoading={isLoadingDelete}
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
  },
  blankWrapper: {
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    flex: 1,
  },
  container: {
    width: '100%',
  },
});

export default SignOut;
