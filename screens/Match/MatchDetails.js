import React, { Component } from 'react';
import { View, ScrollView, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { inject, observer } from 'mobx-react/native';
import { withNavigation } from 'react-navigation';
import FsSpinner from '../../components/common/FsSpinner';
import MatchHeader from './MatchHeader';
import MatchPlayers from './MatchPlayers';
import MatchEvents from './MatchEvents';
import { Localize } from '../../components/locale/Loc';
import ScrollableTabView from 'react-native-scrollable-tab-view';
import { gColors, ScrollableTabViewProps } from '../../GlobalStyles';
import { Ionicons } from '@expo/vector-icons';
import { getIconPrefix } from '../../components/Utils';
import MatchMinutes from './MatchMinutes';
import MatchChrono from './MatchChrono';
import { startLoadMatch } from '../../store-redux/actions/matches';
import { connect } from 'react-redux';
import { startLoadTournamentModes } from '../../store-redux/actions/tournamentModes';
import { setActiveTournament, startLoadTournaments } from '../../store-redux/actions/tournaments';

class MatchDetails extends Component {
  static instance = null;

  static navigationOptions = {
    title: Localize('Match.Overview'),
    headerRight: (
      <TouchableOpacity
        onPress={() => {
          instance && instance.handleUpdate();
        }}
      >
        <Ionicons
          name={getIconPrefix() + 'refresh'}
          size={25}
          color={gColors.headerTint}
          style={{ marginRight: 20 }}
        />
      </TouchableOpacity>
    ),
  };

  componentDidMount = async () => {
    instance = this;
    const idMatch = this.props.navigation.getParam('idMatch');
    // 🚧💥🚧 Multiples organizations issue
    await this.props.onLoadTournamentsModes();
    const tournaments = await this.props.onLoadTournaments();
    const match = await this.props.onLoadMatch(idMatch);
    this.props.onLoadActiveTournament(tournaments.find(t => t.id === match.idTournament));
    this.loadData();
  };

  loadData = async () => {
    const p = this.props;
    const idMatch = p.navigation.getParam('idMatch');

    p.store.matches.actions.get(idMatch);
  };

  handleUpdate = () => {
    this.loadData();
  };

  render() {
    const p = this.props;
    const match = p.store.matches.current;
    const idMatch = p.navigation.getParam('idMatch');

    if (!match || match.id !== idMatch) return <FsSpinner lMsg="Loading match details" />;

    return (
      <View style={style.View}>
        <MatchHeader match={match} />
        {/* <MatchSummonStatus match={match}  /> */}

        <ScrollableTabView {...ScrollableTabViewProps} initialPage={1}>
          <MatchPlayers key={2} tabLabel={Localize('Players')} match={match} />
          <MatchEvents key={1} tabLabel={Localize('Events')} match={match} />
          <MatchChrono
            key={3}
            tabLabel={Localize('Chrono')}
            match={match}
            navigation={this.props.navigation}
          />
          <MatchMinutes key={4} tabLabel={Localize('Minutes')} match={match} />
        </ScrollableTabView>
      </View>
    );
  }
}

const style = StyleSheet.create({
  View: {
    flex: 1,
    backgroundColor: gColors.background,
  },
});

const mapDispatchToProps = dispatch => ({
  onLoadTournamentsModes: () => dispatch(startLoadTournamentModes()),
  onLoadTournaments: () => dispatch(startLoadTournaments()),
  onLoadActiveTournament: tournamentId => dispatch(setActiveTournament(tournamentId)),
  onLoadMatch: matchId => dispatch(startLoadMatch(matchId)),
});

export default connect(null, mapDispatchToProps)(withNavigation(inject('store')(observer(MatchDetails))));
