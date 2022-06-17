import React, { useEffect } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { connect } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  Welcome,
  MainScreen,
} from '../screens/Container';
import {
  getTagName,
  getTagStorage,
  getAuthStatus,
  getProfileImage,
  getPortfolio,
  getAllUserTagStorage,
} from '../src/actions';

const USER_DETAILS = 'USER_DETAILS';
const Stack = createStackNavigator();
const screenOptions = {
  headerShown: false,
};

const gesture = {
  gestureEnabled: false,
};


function Navigation({ userDetails, getTagName, getTagStorage, getAuthStatus,
  getProfileImage, getPortfolio, getAllUserTagStorage, }) {
  const filterAuthStatus = userDetails.filter((e) => e.signedIn === true);
  const checkLength = filterAuthStatus.length > 0;

  getAllUserTagStorage(userDetails);
  if (checkLength) {
    getTagStorage(filterAuthStatus[0]);
    getTagName(filterAuthStatus[0].tagName);
    getAuthStatus(filterAuthStatus[0].signedIn);
    getProfileImage(filterAuthStatus[0].profileImage);
    getPortfolio(filterAuthStatus[0].portfolio || []);
  }

  // useEffect(() => {
  //   AsyncStorage.removeItem(USER_DETAILS);
  // }, []);

  return (
    <Stack.Navigator
      initialRouteName={checkLength ? 'MainScreen' : 'Welcome'}
      screenOptions={screenOptions}
      options={screenOptions}
      name='Navigation'
    >
      <Stack.Screen name="Welcome" component={Welcome} options={gesture} />
      <Stack.Screen name="MainScreen" component={MainScreen} options={gesture} />
    </Stack.Navigator>
  );
}

const mapDispatchToProps = (dispatch) => ({
  getTagName: tagName => {
    dispatch(getTagName(tagName));
  },
  getTagStorage: tagStorage => {
    dispatch(getTagStorage(tagStorage));
  },
  getAuthStatus: signedIn => {
    dispatch(getAuthStatus(signedIn));
  },
  getProfileImage: profileImage => {
    dispatch(getProfileImage(profileImage));
  },
  getPortfolio: portfolio => {
    dispatch(getPortfolio(portfolio));
  },
  getAllUserTagStorage: allUserTagStorage => {
    dispatch(getAllUserTagStorage(allUserTagStorage));
  },
});

export default connect(null, mapDispatchToProps)(Navigation);
