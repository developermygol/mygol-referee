import React, { Component } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, StatusBar, ScrollView } from 'react-native';
import gStyles, { gColors, GS } from '../../GlobalStyles';
import { Ionicons } from '@expo/vector-icons';
import { getIconPrefix } from '../../components/Utils';
import NextMatch from './NextMatch';
import MatchList from '../Match/MatchList';
import { inject, observer } from 'mobx-react/native';
import FsSpinner from '../../components/common/FsSpinner';
import { flow } from 'mobx';
import NoMatches from './NoMatches';
import { Localize } from '../../components/locale/Loc';


export const headerNavigationOptions = ({ navigation, navigationOptions, screenProps }) => {
    return {
        headerLeft: (
            <TouchableOpacity onPress={() => navigation.toggleDrawer() }>
                <Ionicons name={getIconPrefix() + 'menu'} size={25} color={gColors.headerTint} style={{marginLeft: 10}} />
            </TouchableOpacity>
        ),
        headerRight: (
            <TouchableOpacity onPress={() => { instance && instance.handleUpdate() } }>
                <Ionicons name={getIconPrefix() + 'refresh'} size={25} color={gColors.headerTint} style={{marginRight: 20}} />
            </TouchableOpacity>
        ) 
    }
};


export const getNextMatch = (matches) => {
    if (!matches) return null;

    // Select the next match based on date

    const now = new Date();
    for (let i = 0; i < matches.length; ++i) {
        const match = matches[i];
        if (!match) continue;
        const matchDate = new Date(match.startTime);
        if (matchDate > now) return match;
    }

    return null;
}


class RefereeHome extends Component {

    static navigationOptions = headerNavigationOptions;
    static instance = null;

    constructor(props) {
        super(props);
        
    }

    componentDidMount = () => {
        this.handleUpdate();

        instance = this;
    }

    handleUpdate = flow( function*() {
        const p = this.props;

        // Load organizacion
        const org = yield p.store.organization.fetch();

        // Load matches
        const res = yield p.store.referees.getDetails();
    })

    render() {
        const p = this.props;
        const store = p.store.matches;
        const matches = store.all;
        const { matchesByDays } = store;

        if (this.error) return <ErrorBox lMsg={this.error} />
        if (!matchesByDays) return <FsSpinner lMsg='Loading matches list' />
        if (matchesByDays.length === 0) return <NoMatches />

        const nextMatch = getNextMatch(matches);

        return (
            <View style={style.View}>
                <StatusBar barStyle='light-content' />
                
                <NextMatch match={nextMatch} />

                <Text style={[GS.font.title2, style.Title]}>{Localize('My matches')}</Text>
                <View style={style.BottomScrollList}>
                    <MatchList showDaySeparator={true} days={matchesByDays} topMatch={nextMatch} />
                </View>
            </View>
        )
    }
}

const style = StyleSheet.create({
    View: {
        flex: 1
    },
    Title: {
        paddingVertical: 14,
        color: gColors.text1,
        backgroundColor: gColors.backgroundTitleAfterHeader,
    },
    BottomScrollList: {
        flex: 1
    }
});

export default inject('store', 'ui')(observer(RefereeHome));