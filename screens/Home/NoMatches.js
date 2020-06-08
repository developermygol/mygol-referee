import React, { Component } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Loc from '../../components/locale/Loc';

class NoMatches extends Component {

    render() {
        const p = this.props;

        return (
            <View style={style.View}>
                <Text><Loc>Matches.NoMatches</Loc></Text>
            </View>
        )
    }
}

const style = StyleSheet.create({
    View: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    }
});

export default NoMatches;