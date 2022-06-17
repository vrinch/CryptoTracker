
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import { connect } from 'react-redux';
import moment from 'moment';
import { Ionicons } from 'react-native-vector-icons';
import { colors, } from '../../constants/theme';
import {
  Layout,
  ListItem,
} from '../../components/Common';
import { greenCandle } from '../../components/Images';

const {
  WHITE,
  PRIMARY,
  SUCCESS,
  TERTIARY,
  LIGHT_GREY,
  TEXT_BLACK,
  DARK_GREY,
  ORANGE,
  ERROR,
} = colors;

const TOTAL_AMOUNT = 3975.21;
const TOTAL_PROFIT = 1205;
const currentDate = moment().format('MMM Do,');
const currentYear = moment().format('YYYY');

const getComma = number =>
  number.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');

const HomeScreen = ({
  tagName,
  profileImage,
  tagStorage: { timeCreated },
  portfolio,
  onPressAdd,
  onPressImage,
}) => {
  const createdDate = moment(timeCreated).format('MMM Do,');
  const createdTime = moment(timeCreated).format('hh:mm A');
  const createdYear = moment(timeCreated).format('YYYY');
  const createdYearString = currentYear === createdYear;
  const dateString = moment(timeCreated).format(`MMM Do, ${createdYearString ? ''
  : 'YYYY,'} hh:mm A`);
  const createdString = currentDate === createdDate ? `Today, ${createdTime}` : `on ${dateString}`;

  const renderItem = ({ item }) => {
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
        disabled
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
        You currently have no asset in your portfolio
      </Text>

      <TouchableOpacity style={styles.emptyButtonStyle} onPress={onPressAdd}>
        <Ionicons name={'add'} color={WHITE} size={20} />
        <Text style={styles.emptyButtonTextStyle}>Add</Text>
      </TouchableOpacity>
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
        <TouchableOpacity style={styles.imageWrapper} onPress={onPressImage}>
          <Text style={{ fontSize: 30 }}>🧔🏾‍♂️</Text>
          {profileImage &&
            <Image
              source={{ uri: profileImage }}
              style={styles.profileImage}
              resizeMode={'cover'}
            />
          }
        </TouchableOpacity>

        <View style={styles.nameContainer}>
          <Text style={styles.nameStyle}>@{tagName}</Text>
          <Text style={styles.timeStyle}>Created {createdString}</Text>
        </View>

        <TouchableOpacity style={styles.notificationWrapper}>
          <View style={styles.notifcationDotStyle} />
          <Ionicons name='notifications' color={LIGHT_GREY} size={25} />
        </TouchableOpacity>
      </View>

      <View style={styles.amountWrapper}>
        <View style={styles.balanceWrapper}>
          <Text style={styles.amountTitleTextStyle}>Balance</Text>
          <View style={styles.profitWrapper}>
            <Text style={[{ color: SUCCESS, }, styles.amountTextStyle]}>
              {`$${getComma(TOTAL_AMOUNT)}`}
            </Text>
            <Ionicons name={'caret-up'} size={15} color={WHITE} />
            <Text style={styles.percentageStyle}>{'20%'}</Text>
          </View>
        </View>
        <View style={styles.balanceWrapper}>
          <Text style={styles.amountTitleTextStyle}>Today's Profit</Text>
          <View style={styles.profitWrapper}>
            <Text style={[{ color: WHITE, }, styles.amountTextStyle]}>
              {`$${getComma(TOTAL_PROFIT)}`}
            </Text>
            <Image
              source={greenCandle}
              style={styles.greenCandleStyle}
              resizeMode={'contain'}
            />
          </View>
        </View>
      </View>
      <View style={styles.contentWrapper}>
        <View style={styles.portfolioWrapper}>
          <View style={styles.portfolioHeaderWrapper}>
            <Text style={styles.dataTitleTextStyle}>Portfolio</Text>
            <Ionicons name={'wallet'} size={25} color={DARK_GREY} />
          </View>
          <FlatList
            data={portfolio}
            renderItem={renderItem}
            keyExtractor={(item, index) => index.toString()}
            extraData={portfolio}
            ListEmptyComponent={emptyList}
            style={{ padding: 20 }}
          />
        </View>
      </View>
    </Layout>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 60,
  },
  headerWrapper: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  imageWrapper: {
    width: 50,
    height: 50,
    borderRadius: 50,
    backgroundColor: SUCCESS,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 10,
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 55,
    resizeMode: 'cover',
    alignSelf: 'center',
    position: 'absolute',
    top: 0,
    left: 0,
  },
  nameContainer: {
    flex: 1,
    paddingHorizontal: 10,
  },
  nameStyle: {
    fontFamily: 'CircularMedium',
    color: WHITE,
    fontSize: 16,
    textTransform: 'capitalize',
  },
  timeStyle: {
    fontFamily: 'CircularMedium',
    color: LIGHT_GREY,
    fontSize: 12,
    paddingBottom: 5,
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
  amountWrapper: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 30,
  },
  balanceWrapper: {
    paddingRight: 30,
    // width: '50%',
  },
  profitWrapper: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
  },
  amountTitleTextStyle: {
    paddingBottom: 5,
    fontFamily: 'CircularMedium',
    color: WHITE,
    fontSize: 13,
  },
  amountTextStyle: {
    fontFamily: 'CircularRegular',
    fontSize: 25,
    paddingRight: 10,
  },
  percentageStyle: {
    fontFamily: 'CircularRegular',
    color: WHITE,
    fontSize: 10,
  },
  greenCandleStyle: {
    width: 20,
    height: 20,
  },

  //CONTENT
  contentWrapper: {
    flex: 1,
    backgroundColor: WHITE,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    marginTop: 40,
    paddingVertical: 20,
  },
  portfolioWrapper: {
    flex: 1,
  },
  portfolioHeaderWrapper: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
  },
  dataTitleTextStyle: {
    fontFamily: 'CircularMedium',
    color: TEXT_BLACK,
    fontSize: 16,
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
    flexDirection: 'row',
  },
  emptyButtonTextStyle: {
    fontFamily: 'CircularMedium',
    color: WHITE,
    fontSize: 14,
    paddingLeft: 5,
  },
});

const mapStateToProps = (state) => ({
  tagName: state.UserReducer.tagName,
  tagStorage: state.UserReducer.tagStorage,
  portfolio: state.UserReducer.portfolio,
  livePrices: state.UserReducer.livePrices,
  profileImage: state.UserReducer.profileImage,
});

export default connect(mapStateToProps)(HomeScreen);
