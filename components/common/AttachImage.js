import React, { Component } from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { Localize } from '../locale/Loc';
// import { ImagePicker, Permissions } from 'expo';
import * as Permissions from 'expo-permissions'; // SDK 34
import * as ImagePicker from 'expo-image-picker'; // SDK 34
import { observer } from 'mobx-react/native';
import { observable, decorate } from 'mobx';
import IconButton from './IconButton';
import { gColors } from '../../GlobalStyles';

class AttachImage extends Component {
  image = this.props.image;

  changed = false;

  componentDidMount = () => {};

  getImage = () => {
    return this.changed ? this.image : false;
  };

  isChanged = () => {
    return this.changed;
  };

  cameraPressed = async () => {
    const { status: cameraPerm } = await Permissions.askAsync(Permissions.CAMERA);
    const { status: cameraRollPerm } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
    // only if user allows permission to camera AND camera roll
    if (cameraPerm === 'granted' && cameraRollPerm === 'granted') {
      let pickerResult = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        quality: 0.8,
        aspect: this.props.aspect,
      });
      this.handleImagePicked(pickerResult);
    }
  };

  galleryPressed = async () => {
    const { status: cameraRollPerm } = await Permissions.askAsync(Permissions.CAMERA_ROLL);

    // only if user allows permission to camera roll
    if (cameraRollPerm === 'granted') {
      let pickerResult = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: 'Images',
        quality: 0.8,
        allowsEditing: true,
        aspect: this.props.aspect,
      });

      this.handleImagePicked(pickerResult);
    }
  };

  handleImagePicked = result => {
    if (result.cancelled) return;

    this.image = result.uri;
    this.changed = true;
  };

  render() {
    const p = this.props;
    //console.log("AttachImage.render()", this.image, this.props.image);

    return (
      <View style={[style.View, p.style]}>
        {p.label ? <Text style={style.Label}>{Localize(p.label)}</Text> : null}
        <View style={style.Horizontal}>
          {this.image ? <Image source={{ uri: this.image }} style={[style.Image, p.imageSize]} /> : null}
          <View
            style={
              this.image
                ? style.CameraButtons
                : [style.CameraButtonsHorizontal, { height: p.imageSize && p.imageSize.height }]
            }
          >
            <IconButton icon="camera" size={30} color={gColors.text1} onPress={this.cameraPressed} />
            {p.cameraOnly ? null : (
              <IconButton icon="photos" size={30} color={gColors.text1} onPress={this.galleryPressed} />
            )}
          </View>
        </View>
      </View>
    );
  }
}

const style = StyleSheet.create({
  View: {},
  Image: {
    height: 200,
    width: 300,
    resizeMode: 'cover',
    borderWidth: 1,
    borderColor: gColors.text1,
    backgroundColor: 'white',
  },
  Horizontal: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  Label: {
    fontSize: 16,
    marginBottom: 5,
  },
  CameraButtons: {
    width: 120,
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  CameraButtonsHorizontal: {
    borderWidth: 1,
    borderColor: gColors.text2,
    backgroundColor: 'white',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    height: 200,
    flex: 1,
  },
});

export default observer(AttachImage);

decorate(AttachImage, {
  image: observable,
});
