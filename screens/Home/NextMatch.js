import React, { Component } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Loc from '../../components/locale/Loc';
import MatchHeader from '../Match/MatchHeader';

class NextMatch extends Component {

    render() {
        const p = this.props;
        if (!p.match) return null;

        return (
            <View style={p.style}>
                <MatchHeader match={p.match} title={<Loc>NextMatch</Loc>} pressToMatch />
            </View>
        )
    }
}

const style = StyleSheet.create({
    Title: {
        textAlign: 'center'
    }
});

export default NextMatch;