
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
} from 'react-native';
import { colors, } from '../../constants/theme';
import { greenCandle, redCandle, } from '../Images';


const { WHITE, TEXT_BLACK, SECONDARY, BLACK, TERTIARY, TEXT_GREY, } = colors;


const ListItem = ({
  onPress,
  disabled,
  image,
  name,
  symbol,
  amount,
  price_change_percentage_24h,
  priceChangeColor,
}) => (
  <TouchableOpacity style={styles.listWrapper} disabled={disabled} onPress={onPress}>
    <Image
      source={{ uri: image }}
      style={styles.listImageStyle}
      resizeMode={'contain'}
    />
    <View style={styles.listTextWrapper}>
      <Text style={styles.listNameStyle}>{name}</Text>
      <Text style={styles.listSymbolStyle}>{symbol.toUpperCase()}</Text>
    </View>
    <Image
      source={price_change_percentage_24h > 0 ? greenCandle : redCandle}
      style={styles.listCandleStyle}
      resizeMode={'contain'}
    />
    <View style={styles.priceTextWrapper}>
      <Text style={styles.listAmountStyle}>{amount}</Text>
      <Text style={[{ color: priceChangeColor }, styles.listPercentStyle]}>
        {`${parseFloat(price_change_percentage_24h.toFixed(2))}%`}
      </Text>
    </View>
  </TouchableOpacity>
);


const styles = StyleSheet.create({
  //List Styling
  listWrapper: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  listImageStyle: {
    width: 50,
    height: 50,
    borderRadius: 50,
    backgroundColor: TERTIARY,
  },
  listTextWrapper: {
    flex: 0.5,
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
  listCandleStyle: {
    width: 40,
    height: 40,
  },
  priceTextWrapper: {
    alignItems: 'flex-end',
    flex: 0.5,
  },
  listAmountStyle: {
    fontFamily: 'CircularMedium',
    fontSize: 15,
    color: TEXT_BLACK,
    paddingBottom: 5,
  },
  listPercentStyle: {
    fontFamily: 'CircularMedium',
    fontSize: 13,
  },
});

export default ListItem;
