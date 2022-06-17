
import React, { useState, useEffect, } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  TouchableOpacity,
  Keyboard,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { connect } from 'react-redux';
import { getStatusBarHeight } from 'react-native-iphone-x-helper';

import AsyncStorage from '@react-native-async-storage/async-storage';
import { colors, } from '../../constants/theme';
import {
  authImage,
} from '../../components/Images';
import { Button, ErrorWrapper, } from '../../components/Common';
import { Register, Login, } from '../../components/Auth';
import {
  getTagName,
  getTagStorage,
  getAllUserTagStorage,
  getAuthStatus,
  getProfileImage,
  getPortfolio,
} from '../../src/actions';

const {
  WHITE,
  ERROR,
  BUTTONCOLOR,
  PRIMARY,
  YELLOW,
  TORQUISE,
  SECONDARY,
} = colors;

const USER_DETAILS = 'USER_DETAILS';

function Welcome({ navigation, getTagName, getTagStorage, getAuthStatus,
  getProfileImage, getAllUserTagStorage, allUserTagStorage, getPortfolio, }) {
  const [registerSheetVisible, setRegisterSheetVisible] = useState(false);
  const [loginSheetVisible, setLoginSheetVisible] = useState(false);
  const [tagName, setTagName] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [openErrorWrapper, setOpenErrorWrapper] = useState(false);
  const [userDetails, setUserDetails] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    LoadAuth();
  }, [allUserTagStorage]);

  const LoadAuth = async () => {
    try {
      const storedData = await AsyncStorage.getItem(USER_DETAILS);
      const parsedData = JSON.parse(storedData);
      setUserDetails(parsedData || []);
    } catch (e) {
      console.warn(e);
    }
  };

  const saveUserDetail = async (userData) => {
    await AsyncStorage.setItem(USER_DETAILS, JSON.stringify(userData));
  };

  const CHECK_STORAGE = allUserTagStorage.length > 0;
  const SELECT_ACTIVE_TAG_NAME = CHECK_STORAGE ? allUserTagStorage[0].tagName : '';


  const showSheet = () => {
    if (CHECK_STORAGE) {
      setTagName(SELECT_ACTIVE_TAG_NAME);
      setLoginSheetVisible(true);
    } else {
      handleGetStarted();
    }
  };

  const handleGetStarted = () => {
    setTagName('');
    setRegisterSheetVisible(true);
  };

  const onChangeTagName = (name) => {
    setTagName(name.replace(/[^a-z0-9A-Z]/g, '').toLowerCase());
  };

  const handleLogin = () => {
    Keyboard.dismiss();
    setIsLoading(true);
    const filterAuthStatus = allUserTagStorage.filter((e) => e.tagName === tagName);
    const findTagIndex = allUserTagStorage.findIndex((e) => e.tagName === tagName);
    allUserTagStorage[findTagIndex].signedIn = true;

    getTagStorage(filterAuthStatus[0]);
    getTagName(tagName);
    getTagName(filterAuthStatus[0].tagName);
    getAuthStatus(filterAuthStatus[0].signedIn);
    getProfileImage(filterAuthStatus[0].profileImage);
    getPortfolio(filterAuthStatus[0].portfolio);
    getAllUserTagStorage(allUserTagStorage);
    saveUserDetail(allUserTagStorage);

    setTimeout(() => {
      setErrorMessage('');
      setOpenErrorWrapper(false);
      setIsLoading(false);
      setLoginSheetVisible(false);
      navigation.navigate('MainScreen');
    }, 2000);
  };

  const tagNameSelected = (name) => {
    const newTagName = name || tagName;
    setTagName(name || newTagName);
  };

  const handleRegister = () => {
    const filterTagName = allUserTagStorage.filter((e) => e.tagName === tagName);

    if (tagName.length < 3) {
      setErrorMessage('Your Tracker tag cannot be less than 3 characters');
      setOpenErrorWrapper(true);
    } else if (filterTagName.length > 0) {
      setErrorMessage(`@${tagName} is already in use`);
      setOpenErrorWrapper(true);
    } else if (allUserTagStorage.length === 5) {
      setErrorMessage('You cannot have more that 5 Tracker tags, kindly login to delete one of your current tag account');
      setOpenErrorWrapper(true);
    } else {
      Keyboard.dismiss();
      const newUserStorage = {
        tagName,
        portfolio: [],
        profileImage: null,
        signedIn: true,
        timeCreated: Date.now(),
      };

      setIsLoading(true);

      setTimeout(() => {
        userDetails.push(newUserStorage);
        saveUserDetail(userDetails);
        setUserDetails(userDetails);
        setTagName('');
        setErrorMessage('');
        setOpenErrorWrapper(false);

        getAllUserTagStorage(userDetails);
        getTagName(tagName);
        getTagStorage(newUserStorage);
        getPortfolio([]);
        getAuthStatus(true);
        getProfileImage(null);

        setRegisterSheetVisible(false);
        setIsLoading(false);
        navigation.navigate('MainScreen');
      }, 2000);
    }
  };


  return (
    <View style={styles.container}>
      <StatusBar translucent backgroundColor='transparent' style="light" />
      <ImageBackground
        style={styles.imageStyle}
        source={authImage}
        resizeMode={'cover'}
      >
        {CHECK_STORAGE &&
          <TouchableOpacity
            onPress={handleGetStarted}
            disabled={registerSheetVisible || loginSheetVisible}
            style={styles.registerButtonStyle}
          >
            <Text style={styles.registerTextStyle}>Get Started</Text>
          </TouchableOpacity>
        }
      </ImageBackground>
      <View style={styles.contentWrapper}>
        <Text style={[{ color: SECONDARY }, styles.textStyleFluid]}>Earn <Text style={styles.textStyleWhite}>Money</Text></Text>
        <Text style={[{ color: TORQUISE }, styles.textStyleFluid]}>Trade <Text style={styles.textStyleWhite}>Crypto</Text></Text>
        <Text style={[{ color: YELLOW }, styles.textStyleFluid]}>Track <Text style={styles.textStyleWhite}>Portfolio</Text></Text>
      </View>

      <Button
        title={CHECK_STORAGE ? 'Login' : 'Get Started'}
        style={styles.buttonWrapper}
        onPress={showSheet}
      />

      {registerSheetVisible &&
        <Register
          visible={registerSheetVisible}
          onDismiss={() => setRegisterSheetVisible(false)}
          onPressClose={() => setRegisterSheetVisible(false)}
          onPress={handleRegister}
          onChangeText={onChangeTagName}
          value={tagName}
          isLoading={isLoading}
          disabledPanSwipe={isLoading}
          validInput={tagName.length > 0}
        />
      }

      {loginSheetVisible &&
        <Login
          visible={loginSheetVisible}
          onDismiss={() => setLoginSheetVisible(false)}
          onPressClose={() => setLoginSheetVisible(false)}
          onPress={handleLogin}
          isLoading={isLoading}
          disabledPanSwipe={isLoading}
          data={allUserTagStorage}
          tagNameSelected={tagNameSelected.bind(this)}
          selectedTagName={SELECT_ACTIVE_TAG_NAME}
        />
      }

      <ErrorWrapper
        backgroundColor={ERROR}
        errorMessage={errorMessage}
        visible={openErrorWrapper}
        onDismiss={() => setOpenErrorWrapper(false)}
      />
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: PRIMARY,
  },
  imageStyle: {
    width: '100%',
    height: 550,
    paddingTop: getStatusBarHeight(),
  },
  textStyleFluid: {
    fontFamily: 'CircularMedium',
    fontSize: 35,
    paddingBottom: 5,
  },
  contentWrapper: {
    paddingHorizontal: 20,
    paddingVertical: 20,
    width: '100%',
  },
  textStyleWhite: {
    fontFamily: 'CircularMedium',
    fontSize: 35,
    paddingBottom: 5,
    color: WHITE,
  },
  buttonWrapper: {
    position: 'absolute',
    bottom: 20,
  },
  registerButtonStyle: {
    borderRadius: 20,
    backgroundColor: BUTTONCOLOR,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    top: getStatusBarHeight() + 20,
    right: 20,
  },
  registerTextStyle: {
    paddingVertical: 15,
    paddingHorizontal: 25,
    fontFamily: 'CircularMedium',
    color: WHITE,
    fontSize: 16,
  },
});

const mapDispatchToProps = (dispatch) => ({
  getTagName: tagName => {
    dispatch(getTagName(tagName));
  },
  getTagStorage: tagStorage => {
    dispatch(getTagStorage(tagStorage));
  },
  getAllUserTagStorage: allUserTagStorage => {
    dispatch(getAllUserTagStorage(allUserTagStorage));
  },
  getPortfolio: portfolio => {
    dispatch(getPortfolio(portfolio));
  },
  getAuthStatus: signedIn => {
    dispatch(getAuthStatus(signedIn));
  },
  getProfileImage: profileImage => {
    dispatch(getProfileImage(profileImage));
  },
});

const mapStateToProps = (state) => ({
  allUserTagStorage: state.UserReducer.allUserTagStorage,
});

export default connect(mapStateToProps, mapDispatchToProps)(Welcome);
