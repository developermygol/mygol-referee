import React, { Component } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import EventDetails from '../EventDetails';
import { inject, observer } from 'mobx-react/native';
import InfoBox from '../../../components/common/InfoBox';
import { withNavigation } from 'react-navigation';
import SpinnerButton from '../../../components/common/SpinnerButton';
import { gMetrics } from '../../../GlobalStyles';
import { Localize } from '../../../components/locale/Loc';


class NewEventStep5 extends Component {

    handleSave = async () => {
        const p = this.props;
        const ev = p.store.matches.currentEvent;
        if(ev && ev.type === -1) {
            Alert.alert(Localize('Error.MatchEventTypeNotSet'));
            return;
        }

        await p.store.matches.createCurrentEvent();

        p.navigation.goBack();
    }

    render() {
        const p = this.props;
        const store = p.store.matches;
        const match = store.current;
        const ev = store.currentEvent;

        if (!ev) return <InfoBox lMsg='Events.NoEvent' />

        return (
            <View style={style.View}>
                <EventDetails match={match} event={ev} style={style.Details} />
                <View style={style.ButtonWrapper}>
                    <SpinnerButton title='Events.SaveEvent' onPress={this.handleSave} loading={store.loading} />
                </View>
            </View>
        )
    }
}

const style = StyleSheet.create({
    View: {
        flex: 1,
        marginHorizontal: gMetrics.screenPadding,
    },
    Details: {
        alignSelf: 'stretch'
    }, 
    ButtonWrapper: {
        marginVertical: gMetrics.screenPadding
    }
});

export default withNavigation(inject('store')(observer(NewEventStep5)));