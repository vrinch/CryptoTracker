import React, { useEffect, useState, useCallback, } from 'react';
import {
  View,
  StyleSheet,
  LogBox,
  Vibration,
  Modal,
  Animated,
} from 'react-native';
import 'react-native-reanimated';
import 'react-native-gesture-handler';
import { Provider } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NavigationContainer } from '@react-navigation/native';
import { MaterialIndicator } from 'react-native-indicators';
import { Asset } from 'expo-asset';
import * as Font from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { useNetInfo } from '@react-native-community/netinfo';
import {
  FontAwesome,
  Entypo,
  AntDesign,
  EvilIcons,
  Feather,
  FontAwesome5,
  Foundation,
  Ionicons,
  MaterialCommunityIcons,
  MaterialIcons,
  SimpleLineIcons,
  Octicons,
  Zocial,
  Fontisto,
} from 'react-native-vector-icons';
import Navigation from './navigation';
import store from './src/store';
import {
  SplashScreen as CustomSplashScreen,
  ErrorWrapper,
} from './components/Common';
import {
  logo,
  authImage,
  greenCandle,
  redCandle,
} from './components/Images';
import {
  colors,
} from './constants/theme';

import CircularBlackItalic from './assets/fonts/CircularStd-BlackItalic.ttf';
import CircularBoldItalic from './assets/fonts/CircularStd-BoldItalic.ttf';
import CircularMediumItalic from './assets/fonts/CircularStd-MediumItalic.ttf';
import CircularRegularItalic from './assets/fonts/CircularStd-RegularItalic.ttf';
import CircularBlack from './assets/fonts/CircularStd-Black.ttf';
import CircularBold from './assets/fonts/CircularStd-Bold.ttf';
import CircularMedium from './assets/fonts/CircularStd-Medium.ttf';
import CircularRegular from './assets/fonts/CircularStd-Regular.ttf';


// import all used images
const images = [
  logo,
  authImage,
  greenCandle,
  redCandle,
];

const {
  WHITE,
  ERROR,
  PRIMARY,
} = colors;

const connectionMessage = 'Crypto Tracker could not connect to the internet. Please check your internet connection and try again.';

function cacheFonts(fonts) {
  return fonts.map(font => Font.loadAsync(font));
}

const USER_DETAILS = 'USER_DETAILS';

export default function App() {
  LogBox.ignoreLogs(['Setting a timer']);
  const [appIsReady, setAppIsReady] = useState(false);
  const [scaleViewAnimation] = useState(new Animated.Value(1.3));
  const [userDetails, setUserDetails] = useState([]);
  const netInfo = useNetInfo();

  useEffect(() => {
    async function prepare() {
      try {
        await SplashScreen.preventAutoHideAsync();
        await LoadAuth();
      } catch (e) {
        console.warn(e);
      } finally {
        setAppIsReady(true);
        HandleScaleAnimation();
      }
    }

    prepare();
  }, []);

  const LoadAuth = async () => {
    const storedData = await AsyncStorage.getItem(USER_DETAILS);
    const parsedData = await JSON.parse(storedData);
    await setUserDetails(parsedData || []);
    await ImageLoader();
    await FontLoader();
  };

  const ImageLoader = async () => {
    const cacheImages = images.map(image => Asset.fromModule(image).downloadAsync());
    const fontAssets = cacheFonts([
      FontAwesome.font,
      MaterialIcons.font,
      FontAwesome5.font,
      Octicons.font,
      MaterialCommunityIcons.font,
      SimpleLineIcons.font,
      Entypo.font,
      AntDesign.font,
      Ionicons.font,
      Foundation.font,
      EvilIcons.font,
      Zocial.font,
      Feather.font,
      Fontisto.font
    ]);

    return Promise.all([...cacheImages, ...fontAssets]);
  };

  const FontLoader = async () => {
    await Font.loadAsync({
      CircularBlackItalic,
      CircularBoldItalic,
      CircularMediumItalic,
      CircularRegularItalic,
      CircularBlack,
      CircularBold,
      CircularMedium,
      CircularRegular,
    });
  };

  const HandleScaleAnimation = () => {
    Animated.timing(scaleViewAnimation, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }

  const onLayoutRootView = useCallback(async () => {
    if (appIsReady) {
      await SplashScreen.hideAsync();
    }
  }, [appIsReady]);

  if (!appIsReady) {
    return null;
  }


  return (
    <View
      style={styles.container}
      onLayout={onLayoutRootView}
    >
      <Provider store={store}>
        <NavigationContainer>
          <Animated.View
            style={[{
              transform: [
                {
                  scale: scaleViewAnimation
                }
              ],
            }, styles.container]}
          >
            <Navigation userDetails={userDetails} />

            <ErrorWrapper
              backgroundColor={ERROR}
              errorMessage={connectionMessage}
              closeable={!netInfo.isConnected}
            />
          </Animated.View>
        </NavigationContainer>
      </Provider>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: PRIMARY,
  },
});
