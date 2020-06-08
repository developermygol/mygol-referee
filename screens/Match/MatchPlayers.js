import React, { Component } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import MatchTeamPlayers from './MatchTeamPlayers';
import { gColors } from '../../GlobalStyles';
import { observer } from 'mobx-react/native';

class MatchPlayers extends Component {
  render() {
    const p = this.props;
    const { match } = p;
    if (!match) return null;

    const { homePlayers, visitorPlayers } = match;

    return (
      <ScrollView contentContainerStyle={style.ContainerView}>
        <View style={[style.Column, style.RightBorder]}>
          <MatchTeamPlayers players={homePlayers} team={match.homeTeam} match={match} />
        </View>
        <View style={[style.Column]}>
          <MatchTeamPlayers players={visitorPlayers} team={match.visitorTeam} match={match} />
        </View>
      </ScrollView>
    );
  }
}

const style = StyleSheet.create({
  ContainerView: {
    flexDirection: 'row',
  },
  Column: {
    flex: 1,
  },
  RightBorder: {
    borderRightWidth: 1,
    borderRightColor: gColors.tableHeaderBack,
  },
  LeftBorder: {
    borderLeftWidth: 0.5,
    borderLeftColor: gColors.tableHeaderBack,
  },
});

export default observer(MatchPlayers);
