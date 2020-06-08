import React, { Component } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import ImageButton from './ImageButton';
import { getUploadsIcon } from '../../../components/Utils';

class PlayerButton extends Component {
  render() {
    const p = this.props;
    const { player, onPress } = p;

    if (!player) return null;

    const img = getUploadsIcon(player.idPhotoImgUrl, player.id, 'user');

    return (
      <ImageButton
        id={player.id}
        title={player.name + ' ' + player.surname}
        imgUrl={img}
        onPress={onPress}
        badge={player.teamData.apparelNumber}
        style={style.Button}
        imageWrapperStyle={style.ImageWrapper}
      />
    );
  }
}

const style = StyleSheet.create({
  View: {},
  Button: {
    flex: 1,
    justifyContent: 'center',
    margin: 15,
  },
  ImageWrapper: {
    width: 90,
    height: 90,
    borderRadius: 45,
    overflow: 'hidden',
  },
});

export default PlayerButton;
