
import React, { useState, useEffect, } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Keyboard,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { connect } from 'react-redux';
import moment from 'moment';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons, Entypo } from 'react-native-vector-icons';
import HomeScreen from './HomeScreen';
import MarketsScreen from './MarketsScreen';
import AssetDetails from './AssetDetails';
import { colors, } from '../../constants/theme';
import {
  ErrorWrapper,
} from '../../components/Common';
import { SignOut, } from '../../components/Auth';
import {
  getTagName,
  getTagStorage,
  getAllUserTagStorage,
  getAuthStatus,
  getProfileImage,
  getPortfolio,
  getLivePrices,
} from '../../src/actions';
import { getMarketData } from '../../services/cryptoService';

const {
  WHITE,
  SUCCESS,
  LIGHT_GREY,
  DARK_GREY,
  ERROR,
} = colors;

const BOTTOM_TABS = [
  {
    text: 'Home',
    name: 'home',
  },
  {
    text: 'Markets',
    name: 'bar-graph',
  },
  {
    text: 'Settings',
    name: 'settings',
  },
];

const USER_DETAILS = 'USER_DETAILS';

function MainScreen({
  tagName,
  portfolio,
  livePrices,
  profileImage,
  tagStorage,
  allUserTagStorage,
  navigation,
  getTagName,
  getTagStorage,
  getAllUserTagStorage,
  getAuthStatus,
  getProfileImage,
  getPortfolio,
  getLivePrices,
}) {
  const [authSheetVisible, setAuthSheetVisible] = useState(false);
  const [assetDetailsSheetVisible, setAssetDetailsSheetVisible] = useState(false);
  const [userDetails, setUserDetails] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingLivePrices, setIsLoadingLivePrices] = useState(false);
  const [isLoadingSignout, setIsLoadingSignout] = useState(false);
  const [isLoadingDelete, setIsLoadingDelete] = useState(false);
  const [isLoadingAssets, setIsLoadingAssets] = useState(false);
  const [openErrorWrapper, setOpenErrorWrapper] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [bgColor, setBgColor] = useState('');
  const [selectedTab, setSelectedTab] = useState(BOTTOM_TABS[0].text);
  const [selectedAssets, setSelectedAssets] = useState({});

  useEffect(() => {
    LoadAuth();
    fetchData();
  }, []);

  useEffect(() => {
    if (livePrices.length > 0) {
      updatedPortfolio();
    }
  }, [livePrices]);

  const LoadAuth = async () => {
    try {
      const storedData = await AsyncStorage.getItem(USER_DETAILS);
      const parsedData = JSON.parse(storedData);
      setUserDetails(parsedData || []);
    } catch (e) {
      console.warn(e);
    }
  };

  const fetchData = async () => {
    setIsLoadingLivePrices(true);
    const marketData = await getMarketData();
    getLivePrices(marketData || []);
    setIsLoadingLivePrices(false);
  };

  const updatedPortfolio = () => {
    const filteredList = [];
    portfolio.forEach(e => {
        filteredList.push(...livePrices.filter(val => val.image.includes(e.image)));
    });
    getPortfolio(filteredList);
  };


  const saveUserDetail = async (userData) => {
    await AsyncStorage.setItem(USER_DETAILS, JSON.stringify(userData));
  };

  const handleAddAsset = () => {
    const checkPortfolio = portfolio.filter(e => e.name === selectedAssets.name).length;
    const findTagIndex = allUserTagStorage.findIndex((e) => e.tagName === tagStorage.tagName);

    setIsLoadingAssets(true);

    setTimeout(() => {
      if (checkPortfolio) {
        const filteredList = portfolio.filter(e => e.name !== selectedAssets.name);
        getPortfolio(filteredList);

        tagStorage.portfolio = filteredList;
        allUserTagStorage[findTagIndex] = tagStorage;

        getAllUserTagStorage(allUserTagStorage);
        getTagStorage(tagStorage);
        saveUserDetail(allUserTagStorage);

        setAssetDetailsSheetVisible(false);
        setIsLoadingAssets(false);
        setOpenErrorWrapper(true);
        setBgColor(ERROR);
        setErrorMessage(`${selectedAssets.name} has been successfully delisted from your portfolio.`);
      } else {
        const updatedNewPortfolio = [...portfolio, selectedAssets];
        getPortfolio(updatedNewPortfolio);

        tagStorage.portfolio = updatedNewPortfolio;
        allUserTagStorage[findTagIndex] = tagStorage;

        getAllUserTagStorage(allUserTagStorage);
        getTagStorage(tagStorage);
        saveUserDetail(allUserTagStorage);

        setAssetDetailsSheetVisible(false);
        setIsLoadingAssets(false);
        setOpenErrorWrapper(true);
        setBgColor(SUCCESS);
        setErrorMessage(`${selectedAssets.name} has been successfully added to your portfolio.`);
      }
    }, 3000);
  };

  const handleSelection = (item) => {
    Keyboard.dismiss();
    setAssetDetailsSheetVisible(true);
    setSelectedAssets(item);
  };

  const handlePickPhoto = async () => {
    try {
      const photo = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.image,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      if (!photo.cancelled) {
        getProfileImage(photo.uri);
        const userIndex = userDetails.findIndex(e => e.tagName === tagName);
        userDetails[userIndex].profileImage = photo.uri;

        setUserDetails(userDetails);
        saveUserDetail(userDetails);
        getAllUserTagStorage(userDetails);
      }
    } catch (e) {
      setOpenErrorWrapper(true);
      setBgColor(ERROR);
      setErrorMessage('Enable camera roll permissions for the app to make this work');
    }
  };

  const handleSignOut = () => {
    const userIndex = userDetails.findIndex(e => e.tagName === tagName);
    userDetails[userIndex].signedIn = false;

    setIsLoading(true);
    setIsLoadingSignout(true);
    setUserDetails(userDetails);
    saveUserDetail(userDetails);

    setTimeout(() => {
      setIsLoading(false);
      setIsLoadingSignout(false);
      setAuthSheetVisible(false);
      getAllUserTagStorage(userDetails);
      getTagName('');
      getTagStorage({});
      getAuthStatus(true);
      getProfileImage(null);
      getPortfolio([]);
      getLivePrices([]);
      navigation.navigate('Welcome');
    }, 2000);
  };

  const handleDelete = () => {
    const filteredTags = userDetails.filter(e => e.tagName !== tagName);

    setIsLoading(true);
    setIsLoadingDelete(true);
    saveUserDetail(filteredTags);
    setTimeout(() => {
      setIsLoading(false);
      getAllUserTagStorage(filteredTags);
      getTagName('');
      getTagStorage({});
      getAuthStatus(true);
      getProfileImage(null);
      getPortfolio([]);
      getLivePrices([]);
      navigation.navigate('Welcome');
    }, 2000);
  };

  const handleTabPress = (item) => {
    if (item.text === 'Settings') {
      setAuthSheetVisible(true);
    } else {
      setSelectedTab(item.text);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar translucent backgroundColor='transparent' style="light" />
      <View style={styles.contentWrapper}>
        {selectedTab === 'Home' &&
          <HomeScreen
            onPressAdd={() => setSelectedTab('Markets')}
            onPressImage={handlePickPhoto}
          />
        }
        {selectedTab === 'Markets' &&
          <MarketsScreen
            isLoading={isLoadingLivePrices}
            onPressReload={fetchData}
            onPress={handleSelection}
          />
        }
      </View>
      <View style={styles.bottomTabWrapper}>
        {BOTTOM_TABS.map((item, index) => (
          <TouchableOpacity
            style={[
              {
                backgroundColor: selectedTab === item.text ? SUCCESS : WHITE
              },
              styles.tabContainer]}
            key={index.toString()}
            onPress={handleTabPress.bind(this, item)}
          >
            {item.text === 'Markets' ?
              <Entypo
                name={item.name}
                color={selectedTab === item.text ? WHITE : DARK_GREY}
                size={20}
              />
              :
              <Ionicons
                name={item.name}
                color={selectedTab === item.text ? WHITE : DARK_GREY}
                size={20}
              />
            }
            {selectedTab === item.text &&
              <Text style={styles.tabTitleStyle}>{item.text}</Text>
            }
          </TouchableOpacity>
        ))}
      </View>

      {authSheetVisible &&
        <SignOut
          visible={authSheetVisible}
          onDismiss={() => setAuthSheetVisible(false)}
          onPressClose={() => setAuthSheetVisible(false)}
          onPressSignOut={handleSignOut}
          onPressDelete={handleDelete}
          isLoadingSignout={isLoadingSignout}
          isLoadingDelete={isLoadingDelete}
          disabledPanSwipe={isLoading}
          disabled={isLoading}
        />
      }

      {assetDetailsSheetVisible &&
        <AssetDetails
          onPressClose={() => setAssetDetailsSheetVisible(false)}
          disabled={isLoadingAssets}
          onPress={handleAddAsset}
          selectedAssets={selectedAssets}
          portfolio={portfolio}
          isLoading={isLoadingAssets}
        />
      }

      <ErrorWrapper
        backgroundColor={bgColor}
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
  },
  contentWrapper: {
    flex: 1,
    backgroundColor: LIGHT_GREY,
  },
  bottomTabWrapper: {
    width: '100%',
    paddingHorizontal: 20,
    paddingVertical: 20,
    backgroundColor: WHITE,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  tabTitleStyle: {
    fontFamily: 'CircularMedium',
    color: WHITE,
    fontSize: 15,
    paddingLeft: 5,
  },
  tabContainer: {
    width: '33%',
    paddingVertical: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 30,
  },
});

const mapStateToProps = (state) => ({
  tagName: state.UserReducer.tagName,
  portfolio: state.UserReducer.portfolio,
  livePrices: state.UserReducer.livePrices,
  profileImage: state.UserReducer.profileImage,
  tagStorage: state.UserReducer.tagStorage,
  allUserTagStorage: state.UserReducer.allUserTagStorage,
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
  getAuthStatus: signedIn => {
    dispatch(getAuthStatus(signedIn));
  },
  getProfileImage: profileImage => {
    dispatch(getProfileImage(profileImage));
  },
  getPortfolio: portfolio => {
    dispatch(getPortfolio(portfolio));
  },
  getLivePrices: livePrices => {
    dispatch(getLivePrices(livePrices));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(MainScreen);
