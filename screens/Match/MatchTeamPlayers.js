import React, { Component } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import InfoBox from '../../components/common/InfoBox';
import GlobalStyles, { GS, gColors } from '../../GlobalStyles';
import { withNavigation } from 'react-navigation';
import { inject, observer } from 'mobx-react/native';
import { Localize } from '../../components/locale/Loc';
import { form } from 'tcomb-form-native/lib';

const TeamPlayerNav = inject('store')(
  observer(
    withNavigation(
      class TeamPlayer extends Component {
        handlePress = () => {
          const p = this.props;

          p.store.players.setCurrent(p.player);
          p.navigation.push('PlayerFicha', { team: p.team });
        };

        render() {
          const p = this.props;
          const { player } = p;

          if (!player) return null;

          const { matchData, teamData } = player;
          const matchNumber = matchData && matchData.apparelNumber > 0 && matchData.apparelNumber;
          const number = teamData && teamData.apparelNumber;
          const attends = matchData && matchData.status === 1;
          const currentTeam = player.teamData.idTeam;
          const playerHasSanctionOnCurrentTeam =
            player.idSanction > 0 && currentTeam === player.idSanctionTeam;

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
              </View>
              <TouchableOpacity onPress={this.handlePress}>
                <Text style={GS.font.touchable}>{player.name + ' ' + player.surname}</Text>
                {playerHasSanctionOnCurrentTeam && (
                  <Text style={style.SanctionedPlayer}>{Localize('TeamPlayer.Sanctioned')}</Text>
                )}
              </TouchableOpacity>
            </View>
          );
        }
      }
    )
  )
);

class MatchTeamPlayers extends Component {
  render() {
    const p = this.props;
    const { players, match, team } = p;
    if (!players || players.length === 0) return <InfoBox lMsg="TeamPlayers.NoPlayers" />;

    return (
      <ScrollView style={style.View}>
        {players.map(player => (
          <TeamPlayerNav
            key={player.id + ' ' + player.matchData.status}
            player={player}
            team={team}
            match={match}
          />
        ))}
      </ScrollView>
    );
  }
}

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
});

export default withNavigation(observer(MatchTeamPlayers));
