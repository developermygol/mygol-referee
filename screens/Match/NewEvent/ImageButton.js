import React, { Component } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import GlobalStyles, { gColors, GS, gMetrics } from '../../../GlobalStyles';

class ImageButton extends Component {

    handlePress = () => {
        const p = this.props;

        if (p.onPress) p.onPress(p.id);
    }

    render() {
        const p = this.props;
        const { title, imgUrl, id, onPress, badge, imageWrapperStyle, imageStyle, textStyle } = p;

        return (
            <TouchableOpacity style={[style.View, p.style]} onPress={this.handlePress}>
                
                {imgUrl ? (
                    <View style={[style.ImageWrapper, imageWrapperStyle]}>
                        <Image source={{uri: imgUrl}} style={[style.Image, imageStyle]} />
                    </View>
                ) : null}

                <Text style={[style.Text, textStyle]}>{title}</Text>
                
                {badge ? (
                    <View style={[GlobalStyles.ApparelNumberWrapper, style.Badge]} >
                        <Text style={GlobalStyles.ApparelNumber}>{badge}</Text> 
                    </View>
                ): null}

            </TouchableOpacity>
        )
    }
}

const style = StyleSheet.create({
    View: {
        justifyContent: 'flex-start',
        alignItems: 'center'
    },
    ImageWrapper: {
        marginBottom: 5
    },
    Image: {
        flex: 1,
        resizeMode: 'contain'
    },
    Text:  {
        textAlign: 'center',
        ...GS.font.touchable
    },
    Badge: {
        position: 'absolute',
        width: 40, 
        height: 40, 
        borderRadius: 20, 
        left: 50, 
        top: 50
    }
});

export default ImageButton;