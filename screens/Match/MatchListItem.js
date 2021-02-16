import React, { Component } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { getUploadsIcon, getShortMatchTime } from '../../components/Utils';
import { inject, observer } from 'mobx-react/native';
import { gColors } from '../../GlobalStyles';
import { withNavigation } from 'react-navigation';
import { matchHasSootOut } from '../../helpers/helpers';

class MatchListItem extends Component {
  handlePress = () => {
    const p = this.props;
    const idMatch = p.match.id;
    p.navigation.push('MatchDetails', { idMatch });
  };

  render() {
    const p = this.props;
    const { match } = p;
    if (!match) return null;

    const normalTeams = p.store.teams.normal;
    const homeTeam = match.homeTeam || (normalTeams && normalTeams[match.idHomeTeam]);
    const visitorTeam = match.visitorTeam || (normalTeams && normalTeams[match.idVisitorTeam]);

    const tournament = match.tournament && match.tournament.name;

    const hasShootout = matchHasSootOut(match);

    return (
      <View style={style.View}>
        <TouchableOpacity onPress={this.handlePress} style={null}>
          <Text style={[style.Touchable, style.Date]}>{getShortMatchTime(match.startTime)}</Text>
          {tournament ? <Text style={[style.Touchable, style.Tournament]}>{tournament}</Text> : null}
          <View style={style.Row}>
            {homeTeam && (
              <Image
                source={{ uri: getUploadsIcon(homeTeam.logoImgUrl, homeTeam.id, 'team') }}
                style={style.TeamLogo}
              />
            )}
            <Text style={[style.Touchable, style.Name, style.Left]}>
              {(homeTeam && homeTeam.name) || '--'}
            </Text>
            <View style={style.ScoreView}>
              <View>
                <Text style={[style.Score]}>
                  {match.status > 1
                    ? (hasShootout ? match.visibleHomeScore : match.homeScore) +
                      ' · ' +
                      (hasShootout ? match.visibleVisitorScore : match.visitorScore)
                    : '---'}
                </Text>
              </View>
              {hasShootout && <View style={style.Dote}></View>}
            </View>

            <Text style={[style.Touchable, style.Name, style.Right]}>
              {(visitorTeam && visitorTeam.name) || '--'}
            </Text>
            {visitorTeam && (
              <Image
                source={{ uri: getUploadsIcon(visitorTeam.logoImgUrl, visitorTeam.id, 'team') }}
                style={style.TeamLogo}
              />
            )}
          </View>
        </TouchableOpacity>
      </View>
    );
  }
}

const style = StyleSheet.create({
  View: {
    marginHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: gColors.tableHeaderBack,
  },
  Row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 5,
    alignItems: 'center',
  },
  Date: {
    marginTop: 5,
    flex: 2.5,
    fontSize: 12,
    textAlign: 'center',
  },
  Tournament: {
    fontSize: 10,
    fontWeight: '400',
    textAlign: 'center',
  },
  Name: {
    flex: 4,
  },
  Left: {
    //textAlign: 'center'
    textAlign: 'left',
    marginHorizontal: 10,
  },
  Right: {
    //textAlign: 'center'
    textAlign: 'right',
    marginHorizontal: 10,
  },
  Touchable: {
    color: gColors.touchableText,
    fontWeight: '600',
  },
  ScoreView: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  Score: {
    flex: 1.3,
    fontWeight: '800',
    fontSize: 16,
    color: gColors.text1,
    textAlign: 'center',
  },
  TeamLogo: {
    width: 30,
    height: 30,
  },
  Dote: {
    backgroundColor: 'green',
    height: 5,
    width: 5,
    borderRadius: 100,
    marginBottom: 5,
    marginLeft: 2,
  },
});

export default withNavigation(inject('store')(observer(MatchListItem)));
