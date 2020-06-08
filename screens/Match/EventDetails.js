import React, { Component } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Localize } from '../../components/locale/Loc';
import TeamData from '../Home/TeamData';
import PlayerIcon from '../Player/PlayerIcon';
import { findByIdInArray } from '../../components/Data';
import { observer } from 'mobx-react/native';
import InfoBox from '../../components/common/InfoBox';
import { eventStyles } from './EventStyles';
import { gMetrics } from '../../GlobalStyles';
import PlayerAndTeam from './PlayerAndTeam';


export function getTeamFromMatch(match, idTeam) {
    if (!match) return null;

    if (idTeam === match.idHomeTeam) return match.homeTeam;
    if (idTeam === match.idVisitorTeam) return match.visitorTeam;

    return null;
}

export function getPlayerFromMatch(match, idTeam, idPlayer) {
    if (!match) return null;

    if (idTeam === match.idHomeTeam) return findByIdInArray(match.homePlayers, idPlayer);
    if (idTeam === match.idVisitorTeam) return findByIdInArray(match.visitorPlayers, idPlayer);

    return null;
}

export function getEventFromMatch(match, idEvent) {
    if (!match || !match.events || !idEvent) return null;

    return findByIdInArray(match.events, idEvent);
}

const SimpleEventDetails = observer(({event, match, style}) => {
    return (
        <View style={[styles.DetailsView, style]}>
            <Text style={styles.MatchMinute}>{event.matchMinute}'</Text>
            <Text style={[styles.TypeLarge, eventStyles[event.type]]}>{Localize('MatchEventType' + event.type)}</Text>
        </View>
    )
})

const FullEventDetails = observer(({event, match, style}) => {
    const team = getTeamFromMatch(match, event.idTeam);
    const player = getPlayerFromMatch(match, event.idTeam, event.idPlayer);
    
    return (
        <View style={[styles.DetailsView, style]}>
            <Text style={styles.MatchMinute}>{event.matchMinute}'</Text>
            <Text style={[styles.TypeMedium, eventStyles[event.type]]}>{Localize('MatchEventType' + event.type)}</Text>
            <PlayerAndTeam team={team} player={player} style={styles.PlayerTeam} />

            {/* {team ? (
                <View>
                    <TeamData data={team} noLink />
                </View>
            ) : null }

            {player ? (
                <View>
                    <PlayerIcon data={player} />
                </View>
            ) : null } */}
        </View>
    )
})


const simpleEventTypes = [ 1, 10, 11, 12, 13, 15, 16, 17, 18, 100 ];

export const isSimpleEvent = (type) => {
    return simpleEventTypes.includes(type);
}


class EventDetails extends Component {
   
    render() {
        const p = this.props;
        const ev = p.event;
        if (!ev) return null;

        if (isSimpleEvent(ev.type)) return <SimpleEventDetails {...p} />

        return <FullEventDetails {...p} />
    }
} 


const styles = StyleSheet.create({
    DetailsView: {
        flex: 1,
        alignItems: 'stretch',
        justifyContent: 'space-evenly',
        paddingHorizontal: gMetrics.screenPadding
    },
    MatchMinute: {
        textAlign: 'center',
        padding: 15, 
        fontSize: 80, 
        fontWeight: '600'
    },
    TypeMedium: {
        textAlign: 'center', 
        fontSize: 40, 
        fontWeight: '600',
        padding: 15,
        borderRadius: 5,
        overflow: 'hidden'
    },
    TypeLarge: {
        textAlign: 'center', 
        fontSize: 50, 
        fontWeight: '600',
        padding: 15,
        borderRadius: 5,
        overflow: 'hidden'
    },
    PlayerTeam: {
        alignSelf: 'stretch',
        marginVertical: 20
    }
});

export default observer(EventDetails);