import React, { Component } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Localize } from '../../../components/locale/Loc';
import { eventStyles } from '../EventStyles';

class EventButton extends Component {

    handlePress = () => {
        const p = this.props;
        p.onPress(p.type);
    }

    render() {
        const p = this.props;
        const { type, onPress, size } = p;

        return (
            <TouchableOpacity style={[style.View]} onPress={this.handlePress}>
                <View style={[style.Button, eventStyles[type]]}>
                    <Text style={[style.ButtonText, , eventStyles[type]]}>{Localize('MatchEventType' + type).toUpperCase()}</Text>
                </View>
            </TouchableOpacity>
        )
    }
}

const style = StyleSheet.create({
    View: {
        flex: 1,
        padding: 5
    },
    Button: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        height: 70,
        padding: 10,
        borderRadius: 5, 
        overflow: 'hidden'
    },
    ButtonText: {
        textAlign: 'center',
    }
});

export default EventButton;