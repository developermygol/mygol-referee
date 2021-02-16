import React, { Component } from 'react';
import { View, Text, StyleSheet, ImageBackground, TouchableOpacity } from 'react-native';
import TeamData from '../Home/TeamData';
import { inject, observer } from 'mobx-react/native';
import MatchStatus from './MatchStatus';
import { withNavigation } from 'react-navigation';
import Back from '../../assets/backgrounds/top1.jpg';
import { gColors, GS } from '../../GlobalStyles';

class MatchHeader extends Component {
  handlePress = () => {
    const p = this.props;
    if (!p.pressToMatch) return;

    p.navigation.navigate('MatchDetails', { idMatch: p.match.id });
  };

  render() {
    const p = this.props;
    const { match } = p;
    if (!match) return null;

    const normalTeams = p.store.teams.normal;
    const homeTeam = match.homeTeam || (normalTeams && normalTeams[match.idHomeTeam]);
    const visitorTeam = match.visitorTeam || (normalTeams && normalTeams[match.idVisitorTeam]);

    return (
      <ImageBackground source={p.clearBack ? null : Back} style={[p.style]}>
        <TouchableOpacity onPress={this.handlePress} activeOpacity={p.pressToMatch ? 0.2 : 1}>
          {p.title ? <Text style={[GS.font.title2, style.Title]}>{p.title}</Text> : null}
          <View style={style.View}>
            <TeamData data={homeTeam} style={style.TeamIcon} textStyle={style.TeamName} />
            <MatchStatus match={match} style={style.Status} />
            <TeamData data={visitorTeam} style={style.TeamIcon} textStyle={style.TeamName} />
          </View>
        </TouchableOpacity>
      </ImageBackground>
    );
  }
}

const style = StyleSheet.create({
  View: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 4,
  },
  TeamIcon: {
    flex: 1,
  },
  Status: {
    flex: 1,
  },
  TeamName: {
    fontSize: 12,
    fontWeight: '600',
    color: gColors.headText1,
    textAlign: 'center',
  },
  Title: {
    color: gColors.headText1,
    marginBottom: 7,
    textAlign: 'center',
  },
});

export default withNavigation(inject('store')(observer(MatchHeader)));
