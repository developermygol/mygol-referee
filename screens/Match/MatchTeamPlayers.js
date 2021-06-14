import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import InfoBox from '../../components/common/InfoBox';
import GlobalStyles, { GS, gColors } from '../../GlobalStyles';
import { withNavigation } from 'react-navigation';
import { Localize } from '../../components/locale/Loc';
import uuid from 'react-native-uuid';

const TeamPlayerNav = withNavigation(({ navigation, team, player, match }) => {
  const handlePress = () => {
    navigation.push('PlayerFicha', { team, player, match });
  };

  if (!player) return null;

  const { matchData, teamData } = player;
  const matchNumber = matchData && matchData.apparelNumber > 0 && matchData.apparelNumber;
  const number = teamData && teamData.apparelNumber;
  const attends = matchData && matchData.status === 1;
  const currentTeam = player.teamData.idTeam;
  const playerHasSanctionOnCurrentTeam = player.idSanction > 0 && currentTeam === player.idSanctionTeam;

  const isStarter = matchData && matchData.titular;
  const isCaptain = matchData && matchData.captain;

  return (
    <View style={style.Player}>
      <View
        style={[
          GlobalStyles.ApparelNumberWrapper,
          style.NumberWrapper,
          attends ? style.AttendsTrue : style.AttendsFalse,
        ]}
      >
        <Text style={[GlobalStyles.ApparelNumber]}>{matchNumber ? matchNumber : number}</Text>
        {isCaptain && (
          <View style={style.Captain}>
            <Text style={style.SmallText}>C</Text>
          </View>
        )}
        {isStarter && (
          <View style={style.Titular}>
            <Text style={style.SmallText}>T</Text>
          </View>
        )}
      </View>
      <TouchableOpacity onPress={handlePress}>
        <Text style={GS.font.touchable}>{player.name + ' ' + player.surname}</Text>
        {playerHasSanctionOnCurrentTeam && (
          <Text style={style.SanctionedPlayer}>{Localize('TeamPlayer.Sanctioned')}</Text>
        )}
      </TouchableOpacity>
    </View>
  );
});

const MatchTeamPlayers = ({ players, match, team }) => {
  if (!players || players.length === 0) return <InfoBox lMsg="TeamPlayers.NoPlayers" />;
  return (
    <ScrollView style={style.View}>
      {players.map(player => (
        <TeamPlayerNav
          // key={player.id + ' ' + player.matchData.status}
          key={uuid.v4()}
          player={player}
          team={team}
          match={match}
        />
      ))}
    </ScrollView>
  );
};

const style = StyleSheet.create({
  View: {},
  Player: {
    padding: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  SanctionedPlayer: {
    color: gColors.red,
  },
  NumberWrapper: {
    marginRight: 5,
  },
  AttendsTrue: {
    backgroundColor: gColors.green,
  },
  AttendsFalse: {
    backgroundColor: gColors.red,
  },
  Titular: {
    borderRadius: 15,
    width: 11,
    height: 11,
    position: 'absolute',
    bottom: -2,
    right: -2,
    backgroundColor: 'blue',
    justifyContent: 'center',
    alignItems: 'center',
  },
  Captain: {
    borderRadius: 15,
    width: 11,
    height: 11,
    position: 'absolute',
    top: -2,
    right: -2,
    backgroundColor: 'orange',
    justifyContent: 'center',
    alignItems: 'center',
  },
  SmallText: {
    color: 'white',
    fontSize: 8,
    fontWeight: '900',
  },
});

export default MatchTeamPlayers;
