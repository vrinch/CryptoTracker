
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  TextInput,
} from 'react-native';
import { MaterialIndicator } from 'react-native-indicators';
import { connect } from 'react-redux';
import moment from 'moment';
import { Ionicons, Entypo } from 'react-native-vector-icons';
import { colors, } from '../../constants/theme';
import {
  Layout,
  ListItem,
} from '../../components/Common';
import { greenCandle, redCandle, } from '../../components/Images';

const {
  WHITE,
  TEXT_GREY,
  PRIMARY,
  SUCCESS,
  TERTIARY,
  LIGHT_GREY,
  TEXT_BLACK,
  ORANGE,
  MID_GREY,
  ERROR,
} = colors;

const currentDate = moment().format('MMM Do,');
const currentYear = moment().format('YYYY');

const SUB_MENU = [
  'All Assets',
  'Tradables',
  'Gainers',
  'Losers',
];

const getComma = number =>
  number.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');

const MarketsScreen = ({
  tagStorage: { timeCreated },
  livePrices,
  onPressReload,
  isLoading,
  onPress,
}) => {
  const [borderColor, setBorderColor] = useState(MID_GREY);
  const [searchValue, setSearchValue] = useState('');
  const [errorMessage, setErrorMessage] = useState('There are currently no live crypto data');
  const [listData, setListData] = useState(livePrices);
  const [searchList, setSearchList] = useState([]);
  const [selectedMenu, setSelectedMenu] = useState(SUB_MENU[0]);


  const onChangeSearch = (value) => {
    setSearchValue(value);
    setErrorMessage(`'${value}' is not a valid crypto asset`);
    const searchedList = searchList.filter(item =>
      item.name.toLowerCase().includes(value.toLowerCase()),
    );
    setListData(searchedList);
  };

  const onFocus = () => {
    setBorderColor(TERTIARY);
    setSearchList(listData);
  };

  const onBlur = () => {
    setBorderColor(MID_GREY);
  };

  const handleReset = () => {
    setSearchValue('');
    setListData(searchList);
    setErrorMessage('');
  };

  const handleSubMenu = (item) => {
    setSelectedMenu(item);
    if (item === 'All Assets') {
      setListData(livePrices);
      setSearchList(livePrices);
    } else if (item === 'Tradables') {
      const data = livePrices;
      const sortedList = data.sort((a, b) => b.price_change_percentage_24h - a.price_change_percentage_24h);
      setListData(sortedList);
      setSearchList(sortedList);
    } else if (item === 'Gainers') {
      const filteredList = livePrices.filter(e => e.price_change_percentage_24h > 0);
      setListData(filteredList);
      setSearchList(filteredList);
      setErrorMessage('No crypto asset matches your search criteria');
    } else if (item === 'Losers') {
      const filteredList = livePrices.filter(e => e.price_change_percentage_24h < 0);
      setListData(filteredList);
      setSearchList(filteredList);
      setErrorMessage('No crypto asset matches your search criteria');
    }
  };


  const renderItem = ({ item, index }) => {
    const {
      image,
      name,
      price_change_percentage_24h,
      symbol,
      current_price,
    } = item;
    const priceChangeColor = price_change_percentage_24h > 0 ? SUCCESS : ERROR;
    const amount = parseFloat(current_price.toFixed(2));
    return (
      <ListItem
        onPress={onPress.bind(this, item)}
        image={image}
        name={name}
        symbol={symbol}
        amount={`$${getComma(amount)}`}
        priceChangeColor={priceChangeColor}
        price_change_percentage_24h={price_change_percentage_24h}
      />
    );
  };

  const emptyList = (
    <View style={styles.emptyListWrapper}>
      <Text style={styles.emptyListTextStyle}>
        {errorMessage}
      </Text>
      {livePrices.length === 0 &&
        <TouchableOpacity style={styles.emptyButtonStyle} onPress={onPressReload}>
          <Text style={styles.emptyButtonTextStyle}>Reload</Text>
        </TouchableOpacity>
      }
    </View>
  );

  return (
    <Layout
      style={styles.container}
      colors={[PRIMARY, TERTIARY]}
      start={[0, 1]}
      end={[1, 0]}
    >
      <View style={styles.headerWrapper}>
        <View style={styles.nameContainer}>
          <Text style={styles.nameStyle}>Market Trends</Text>
          <Ionicons name={'caret-up'} size={15} color={SUCCESS} />
          <Text style={styles.percentageStyle}>{'4.2%'}</Text>
        </View>

        <TouchableOpacity style={styles.notificationWrapper}>
          <View style={styles.notifcationDotStyle} />
          <Ionicons name='notifications' color={LIGHT_GREY} size={25} />
        </TouchableOpacity>
      </View>

      <View style={styles.contentWrapper}>
        {isLoading ?
          <View style={styles.loadingWrapper}>
            <MaterialIndicator size={50} color={SUCCESS} />
          </View>
          :
          <View style={styles.modalStyle}>
            {livePrices.length > 0 &&
              <View style={[{ borderColor, }, styles.searchWrapper]}>
                <Ionicons name='ios-search' color={TEXT_GREY} size={22} />
                <TextInput
                  placeholderTextColor={TEXT_GREY}
                  style={styles.inputStyle}
                  onFocus={onFocus}
                  onBlur={onBlur}
                  autoCorrect={false}
                  placeholder={'Search'}
                  underlineColorAndroid="transparent"
                  returnKeyType='done'
                  // autoFocus
                  onChangeText={onChangeSearch}
                  value={searchValue}
                  keyboardType='visible-password'
                  autoCapitalize='none'
                  // enablesReturnKeyAutomatically
                />
              </View>
            }
            {livePrices.length > 0 &&
              <View style={styles.submenuWrapper}>
                {SUB_MENU.map((item, index) => (
                  <TouchableOpacity
                    style={[{ backgroundColor: selectedMenu === item ? TERTIARY : WHITE, }, styles.submenuButtonStyle]}
                    onPress={handleSubMenu.bind(this, item)}
                    key={index.toString()}
                  >
                    <Text
                      style={[{ color: selectedMenu === item ? WHITE : TEXT_BLACK, }, styles.submenuButtonTextStyle]}
                    >{item}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            }
            <FlatList
              data={listData}
              renderItem={renderItem}
              keyExtractor={(item, index) => index.toString()}
              extraData={listData}
              ListEmptyComponent={emptyList}
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps={'always'}
            />
          </View>
        }
      </View>
    </Layout>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 60,
  },
  modalStyle: {
    flex: 1,
  },
  loadingWrapper: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
  headerWrapper: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  nameContainer: {
    flex: 1,
    paddingHorizontal: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  nameStyle: {
    fontFamily: 'CircularMedium',
    color: WHITE,
    fontSize: 16,
    textTransform: 'capitalize',
    paddingRight: 10,
  },
  notifcationDotStyle: {
    width: 10,
    height: 10,
    backgroundColor: ORANGE,
    borderRadius: 10,
    position: 'absolute',
    top: 0,
    right: 0,
  },
  percentageStyle: {
    fontFamily: 'CircularRegular',
    color: SUCCESS,
    fontSize: 10,
  },

  //CONTENT
  contentWrapper: {
    flex: 1,
    backgroundColor: WHITE,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    marginTop: 20,
    paddingHorizontal: 20,
  },
  searchWrapper: {
    width: '100%',
    height: 55,
    backgroundColor: LIGHT_GREY,
    borderRadius: 15,
    marginTop: 25,
    flexDirection: 'row',
    alignItems: 'center',
    paddingRight: 10,
    paddingLeft: 20,
    borderWidth: 2,
    zIndex: 100,
  },
  inputStyle: {
    fontFamily: 'CircularMedium',
    fontSize: 15,
    color: TEXT_BLACK,
    paddingLeft: 10,
    // width: '100%',
    height: '100%',
    flex: 1,
  },
  clearInputStyle: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 30,
    height: 30,
    borderRadius: 20,
    backgroundColor: MID_GREY,
  },
  emptyListWrapper: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 100,
  },
  emptyListTextStyle: {
    fontFamily: 'CircularRegular',
    color: TEXT_BLACK,
    fontSize: 15,
    textAlign: 'center',
  },
  emptyButtonStyle: {
    backgroundColor: SUCCESS,
    borderRadius: 30,
    paddingVertical: 15,
    paddingHorizontal: 30,
    marginVertical: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyButtonTextStyle: {
    fontFamily: 'CircularMedium',
    color: WHITE,
    fontSize: 14,
  },
  submenuWrapper: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 30,
  },
  submenuButtonStyle: {
    paddingVertical: 5,
    width: '25%',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 30,
  },
  submenuButtonTextStyle: {
    fontFamily: 'CircularMedium',
    fontSize: 13,
  },
});

const mapStateToProps = (state) => ({
  tagName: state.UserReducer.tagName,
  tagStorage: state.UserReducer.tagStorage,
  livePrices: state.UserReducer.livePrices,
  profileImage: state.UserReducer.profileImage,
});

export default connect(mapStateToProps)(MarketsScreen);
