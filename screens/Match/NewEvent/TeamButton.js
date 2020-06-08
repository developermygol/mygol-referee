import React, { Component } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import ImageButton from './ImageButton';
import { getUploadsIcon } from '../../../components/Utils';

class TeamButton extends Component {

    render() {
        const p = this.props;
        const { team, onPress } = p;

        if (!team) return null;

        const img = getUploadsIcon(team.logoImgUrl, team.id, 'team');

        return (
            <ImageButton
                id={team.id}
                title={team.name}
                imgUrl={img}
                onPress={onPress}
                style={style.Button}
                imageWrapperStyle={style.ImageWrapper}
                imageStyle={style.Image}
                textStyle={style.Text}
            />
        )
    }
}

const style = StyleSheet.create({
    View: {
        flex: 1
    },
    Button: {
        flex: 1
    },
    ImageWrapper: {
        width: 150,
        height: 150
    },
    Image: {

    },
    Text: {

    }
});

export default TeamButton;