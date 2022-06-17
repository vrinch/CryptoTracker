
import React from 'react';
import { View, StyleSheet, } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const Layout = ({ children, ...props }) => (
  <View style={styles.container}>
    <LinearGradient {...props}>
      {children}
    </LinearGradient>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default Layout;
