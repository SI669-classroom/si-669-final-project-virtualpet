import React from 'react';
import { TouchableOpacity, Image, StyleSheet } from 'react-native';

const images = {
  poop: require('../assets/poop.png'),
};

const Poop = ({ onPress, position }) => {
    return (
      <TouchableOpacity style={{...styles.container, ...position}} onPress={onPress}>
        <Image source={images.poop} style={styles.image} />
      </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    alignItems: 'center',
    justifyContent: 'center',
    width: 35,
    height: 35,
    marginLeft: '-10%',
    marginTop: '10%',
  },
  image: {
    width: 35, // Adjust the width as needed
    height: 35, // Adjust the height as needed
  },
});

export default Poop;