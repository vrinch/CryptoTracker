
import React from 'react';
import {
  View,
  StyleSheet,
  Image,
  Text,
} from 'react-native';
import { Ionicons, } from 'react-native-vector-icons';

import { Button, AbsoluteBottomSheet, } from '../../components/Common';
import { colors, } from '../../constants/theme';
import { greenCandle, redCandle, } from '../../components/Images';


const getComma = number =>
  number.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
const {
  ERROR,
  SUCCESS,
  TERTIARY,
  TEXT_BLACK,
  TEXT_GREY,
  LIGHT_GREY,
  DARK_GREY,
  GOLD,
} = colors;

const viewPosition = -500;
const AssetDetails = ({
  onPress,
  isLoading,
  disabled,
  onPressClose,
  portfolio,
  selectedAssets: {
    current_price,
    image,
    high_24h,
    low_24h,
    market_cap_rank,
    name,
    price_change_percentage_24h,
    symbol,
    sparkline_in_7d,
    price_change_percentage_24h_in_currency,
  },
}) => {
  const checkPortfolio = portfolio.filter(e => e.name === name).length;
  const amount = parseFloat(current_price.toFixed(2));
  const high_24hours = parseFloat(high_24h.toFixed(2));
  const low_24hours = parseFloat(low_24h.toFixed(2));
  const ranking = getComma(market_cap_rank);
  const priceChangeColor = price_change_percentage_24h > 0 ? SUCCESS : ERROR;

  return (
    <AbsoluteBottomSheet
      viewPosition={viewPosition}
      onPressClose={onPressClose}
      disabled={disabled}
    >
      <View style={styles.container}>
        <View style={styles.headerWrapper}>
          <Image source={{ uri: image }} style={styles.imageStyle} resizeMode={'contain'} />

          <View style={styles.nameContainer}>
            <Text style={styles.listNameStyle}>{name}</Text>
            <Text style={styles.listSymbolStyle}>{symbol.toUpperCase()}</Text>
          </View>
          <Ionicons
            name={checkPortfolio ? 'star' : 'star-outline'}
            color={checkPortfolio ? GOLD : DARK_GREY}
            size={25}
          />
        </View>

        <View style={styles.contentWrapper}>
          <View style={styles.cardWrapper}>
            <View style={styles.listTextWrapper}>
              <Text style={styles.listAmountStyle}>{`$${getComma(amount)}`}</Text>
              <Text style={[{ color: priceChangeColor }, styles.listPercentStyle]}>
                {parseFloat(price_change_percentage_24h.toFixed(2))}%
              </Text>
            </View>

            <Image
              source={price_change_percentage_24h > 0 ? greenCandle : redCandle}
              style={styles.listCandleStyle}
              resizeMode={'contain'}
            />
          </View>

          <View style={styles.cardWrapper}>
            <View style={styles.innerCardWrapper}>
              <Text style={styles.cardTitleStyle}>24H High</Text>
              <Text style={styles.cardContentStyle}>{`$${getComma(high_24hours)}`}</Text>
            </View>

            <View style={styles.innerCardWrapper}>
              <Text style={styles.cardTitleStyle}>24H Low</Text>
              <Text style={styles.cardContentStyle}>{`$${getComma(low_24hours)}`}</Text>
            </View>

            <View style={styles.innerCardWrapper}>
              <Text style={styles.cardTitleStyle}>M. Cap. Rank</Text>
              <Text style={styles.cardContentStyle}>{ranking}</Text>
            </View>
          </View>
        </View>

        <Button
          title={`${!checkPortfolio ? 'Track' : 'Delist'} ${name}`}
          onPress={onPress}
          buttonColor={!checkPortfolio ? SUCCESS : ERROR}
          disabled={disabled}
          isLoading={isLoading}
        />
      </View>

    </AbsoluteBottomSheet>
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
  headerWrapper: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  imageStyle: {
    width: 50,
    height: 50,
    borderRadius: 50,
    backgroundColor: TERTIARY,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 10,
  },
  nameContainer: {
    flex: 1,
    paddingHorizontal: 10,
  },
  listNameStyle: {
    fontFamily: 'CircularRegular',
    fontSize: 14,
    color: TEXT_BLACK,
    paddingBottom: 5,
  },
  listSymbolStyle: {
    fontFamily: 'CircularRegular',
    fontSize: 14,
    color: TEXT_GREY,
  },
  contentWrapper: {
    width: '100%',
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  cardWrapper: {
    width: '100%',
    backgroundColor: LIGHT_GREY,
    paddingVertical: 20,
    borderRadius: 20,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  listCandleStyle: {
    width: 70,
    height: 70,
  },
  listAmountStyle: {
    fontFamily: 'CircularMedium',
    fontSize: 25,
    color: TEXT_BLACK,
    paddingBottom: 5,
  },
  listPercentStyle: {
    fontFamily: 'CircularMedium',
    fontSize: 20,
  },
  cardTitleStyle: {
    fontFamily: 'CircularMedium',
    fontSize: 14,
    color: TEXT_GREY,
    paddingBottom: 5,
  },
  cardContentStyle: {
    fontFamily: 'CircularMedium',
    fontSize: 15,
    color: TEXT_BLACK,
    paddingBottom: 5,
  },
});

export default AssetDetails;
