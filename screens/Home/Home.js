import React, { Component } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { gColors } from '../../GlobalStyles';
import { inject, observer } from 'mobx-react/native';
import { Ionicons } from '@expo/vector-icons';
import { getIconPrefix } from '../../components/Utils';
import PlayerDetails from './PlayerDetails';
import { headerNavigationOptions } from './HEader';



class Home extends Component {

    static navigationOptions = headerNavigationOptions;

    render() {
        return <PlayerDetails navigation={this.props.navigation} />
    }
}

const style = StyleSheet.create({
    
});

export default inject('store')(observer(Home));