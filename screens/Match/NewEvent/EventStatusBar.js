import React, { Component } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { inject, observer } from 'mobx-react/native';
import { Localize } from '../../../components/locale/Loc';


class EventStatusBar extends Component {

    render() {
        const p = this.props;
        const ev = p.store.matches.currentEvent;

        if (!ev) return null;

        const minute = parseInt(ev.matchMinute, 10);
        const type = ev.type;

        return (
            <View style={style.View}>
                {(minute > -1) && <Text>{Localize('Events.Minute')} {minute}'</Text>}
                {(type > -1) && <Text>{Localize('MatchEventType' + type)}</Text>}
            </View>
        )
    }
}

const style = StyleSheet.create({
    View: {
        alignSelf: 'stretch',
        flexDirection: 'row',
        justifyContent: 'space-around', 
        alignItems: 'center',
        paddingVertical: 10
    }
});

export default inject('store')(observer(EventStatusBar));