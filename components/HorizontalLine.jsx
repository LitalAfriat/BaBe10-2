import React from 'react';
import { View, StyleSheet } from 'react-native';

const HorizontalLine = () => {
  return <View style={styles.line} />;
};

const styles = StyleSheet.create({
  line: {
    height: 1,
    width: '90%',
    backgroundColor: '#ccc5b9',
    marginVertical: 10,
    alignSelf: 'center',
  },
});

export default HorizontalLine;