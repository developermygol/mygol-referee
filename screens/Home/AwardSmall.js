import React, { Component } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import config from '../../Config';
import { gColors } from '../../GlobalStyles';
import { getAwardUri } from '../../components/Utils';
import { withNavigation } from 'react-navigation';

class AwardSmall extends Component {

    handlePress = () => {
        const p = this.props;
        p.navigation.push('AwardDetails', { player: p.player, award: p.award });
    }
    
    render() {
        const p = this.props;
        const { award } = p;
        if (!award) return null;

        return (
            <TouchableOpacity onPress={this.handlePress} style={style.View}>
                <Image source={{uri: getAwardUri(award.type)}} style={style.AwardIcon}/>
                <Text style={style.Name}>{award.name}</Text>
                <Text style={style.Day}>{award.day.name}</Text>
            </TouchableOpacity>
        )
    }
}

const style = StyleSheet.create({
    View: {
        flex: 1,
        alignItems: 'center'
    },
    AwardIcon: {
        width: 60,
        height: 60,
        resizeMode: 'contain',
        marginBottom: 10
    },
    Name: {
        color: gColors.text1
    },
    Day: {
        color: gColors.text2
    }
});

export default withNavigation(AwardSmall);