import React, { Component } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import EventDetails, { getEventFromMatch } from './EventDetails';
import { inject, observer } from 'mobx-react/native';
import InfoBox from '../../components/common/InfoBox';
import { gMetrics } from '../../GlobalStyles';
import SpinnerButton from '../../components/common/SpinnerButton';
import { Localize } from '../../components/locale/Loc';


class EventDetailsPage extends Component {

    static navigationOptions = { 
        title: Localize('Events.Details'),
    }

    handleDeleteEvent = async () => {
        const p = this.props;
        const store = p.store.matches;

        const { event } = this.getData();

        await store.deleteEvent(event);

        p.navigation.goBack();
    }

    getData = () => {
        const p = this.props;
        const store = p.store.matches;
        const idEvent = p.navigation.getParam('idEvent');
        const match = store.current;
        const event = getEventFromMatch(match, idEvent);

        return { match, event };
    }

    render() {
        const { match, event } = this.getData();

        if (!match) return <InfoBox lMsg='Events.NoMatch' />
        if (!event) return <InfoBox lMsg='Events.NoEvent' />

        return (
            <View style={style.View}>
                <EventDetails event={event} match={match} style={style.Details} />
                <View style={style.DeleteButton}>
                    <SpinnerButton title='Events.Delete' onPress={this.handleDeleteEvent} loading={this.props.store.matches.loading} />
                </View>
            </View>
        )
    }
}

const style = StyleSheet.create({
    View: {
        flex: 1
    },
    Details: {
        alignSelf: 'stretch'
    },
    DeleteButton: {
        padding: gMetrics.screenPadding
    }

});

export default inject('store')(observer(EventDetailsPage));