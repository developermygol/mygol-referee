import React, { Component } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, StatusBar } from 'react-native';
import { inject, observer } from 'mobx-react/native';

class First extends Component {
    constructor(props) {
        super(props);
        this.bootstrapAsync(props);
    }

    bootstrapAsync = async (props) => {
        const token = props.ui.auth.token;
        const initialScreen = token ? 'RefereeHome' : 'Auth';

        // Debug navigation
        //this.props.navigation.navigate('CreateEvent');
        //this.props.navigation.navigate('MatchDetails', { idMatch: 1657 });      // Events
        //this.props.navigation.navigate('MatchDetails', { idMatch: 1666 });    // No events
        // End debug navigation

        // NOTE: this is the production code (uncomment in production, remove all the other navigation)
        this.props.navigation.navigate(initialScreen);
    }

    render() {
        return (
            <View style={style.View}>
                <ActivityIndicator />
                <StatusBar barStyle="default" />
            </View>
        )
    }
}

const style = StyleSheet.create({
    View: {

    }
});

export default inject('ui')(observer(First));