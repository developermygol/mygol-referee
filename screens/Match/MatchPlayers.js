import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';

import MatchTeamPlayers from './MatchTeamPlayers';
import { nonPlayableRoles } from '../../helpers/helpers';
import { gColors } from '../../GlobalStyles';
import { useSelector } from 'react-redux';

const MatchPlayers = () => {
  const { activeMatch } = useSelector(state => state.matches);

  if (!activeMatch) return null;

  const { homePlayers, visitorPlayers, homeTeam, visitorTeam } = activeMatch;

  const filterNonPlayableRoles = players => {
    return players.filter(player => {
      // console.log(player.teamData.fieldPosition);
      // console.log(nonPlayableRoles);
      return !nonPlayableRoles.includes(player.teamData.fieldPosition);
    });
  };

  return (
    <ScrollView contentContainerStyle={style.ContainerView}>
      <View style={[style.Column, style.RightBorder]}>
        <MatchTeamPlayers players={filterNonPlayableRoles(homePlayers)} team={homeTeam} match={activeMatch} />
      </View>
      <View style={[style.Column]}>
        <MatchTeamPlayers
          players={filterNonPlayableRoles(visitorPlayers)}
          team={visitorTeam}
          match={activeMatch}
        />
      </View>
    </ScrollView>
  );
};

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

export default MatchPlayers;
