import React, { Component } from 'react';
import { View, Text, StyleSheet, FlatList, SectionList } from 'react-native';
import { gColors, ScrollableTabViewProps } from '../../GlobalStyles';
import MatchListItem from './MatchListItem';
import ScrollableTabView from 'react-native-scrollable-tab-view';
import InfoBox from '../../components/common/InfoBox';
import FsSpinner from '../../components/common/FsSpinner';
import { getDateOnlyString, getDateOnlyStringFromDate, parseShortDateString } from '../../components/Utils';


const MatchDayList = ({ matches }) => {
    return (
        <FlatList
            data={matches.slice()}
            renderItem={({ item }) => <MatchListItem match={item} />}
            keyExtractor={item => item.id.toString()}
            style={style.MatchList}
        />
    )
}


class MatchList extends Component {

    getInitialTabIndex = (matchesByDays) => {
        if (!matchesByDays || matchesByDays.length === 0) return 0;

        const today = parseShortDateString(getDateOnlyStringFromDate(new Date()));

        const keys = Object.keys(matchesByDays);
        for (let i = 0; i < keys.length; ++i) {
            const key = keys[i];
            const parsed = parseShortDateString(key);

            if (parsed.year >= today.year && parsed.month >= today.month && parsed.day >= today.day) return i;
        }

        //return matchesByDays.length - 1;

        return keys.length - 1;
    }

    render() {
        const p = this.props;
        const matchesByDays = p.days;

        if (!matchesByDays) return <FsSpinner lMsg='Loading matches list' />
        if (matchesByDays.length === 0) return <InfoBox lMsg='Matches.NoMatches' />

        const initialIndex = this.getInitialTabIndex(matchesByDays);

        return (
            <ScrollableTabView {...ScrollableTabViewProps} initialPage={initialIndex}>
                {Object.keys(matchesByDays).map(key => {
                    return <MatchDayList key={key} tabLabel={key} matches={matchesByDays[key]} />
                })}
            </ScrollableTabView>
        )
    }
}

const style = StyleSheet.create({
    View: {
        backgroundColor: gColors.background
    },
    MatchList: {

    }
});

export default MatchList;