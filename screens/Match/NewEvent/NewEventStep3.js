import React, { Component } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import EventStatusBar from './EventStatusBar';
import { inject, observer } from 'mobx-react/native';
import { Localize } from '../../../components/locale/Loc';
import TeamButton from './TeamButton';
import InfoBox from '../../../components/common/InfoBox';
import { gMetrics } from '../../../GlobalStyles';


class NewEventStep3 extends Component {

    handlePress = (idTeam) => {
        const p = this.props;
        const store = p.store.matches;

        store.currentEvent.idTeam = idTeam;

        p.navigateToPage(3);
    }

    render() {
        const p = this.props;
        const store = p.store.matches;
        const match = store.current;

        if (!match) return <InfoBox lMsg='Events.NoMatch' />

        const { homeTeam, visitorTeam } = match;

        return (
            <View style={style.View}>
                <EventStatusBar />
                <View style={style.Teams}>
                    <TeamButton team={homeTeam} onPress={this.handlePress} />
                    <TeamButton team={visitorTeam} onPress={this.handlePress} />
                </View>
            </View>
        )
    }
}

const style = StyleSheet.create({
    View: {
        flex: 1,
        paddingHorizontal: gMetrics.screenPadding
    }, 
    Teams: {
        flex: 4,
        flexDirection: 'row', 
        justifyContent: 'space-evenly',
        alignItems: 'center',
        alignSelf: 'stretch'
    }
});

export default inject('store')(observer(NewEventStep3));