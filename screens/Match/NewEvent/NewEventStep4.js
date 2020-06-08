import React, { Component } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import EventStatusBar from './EventStatusBar';
import { inject, observer } from 'mobx-react/native';
import { GS } from '../../../GlobalStyles';
import Loc from '../../../components/locale/Loc';
import PlayerList from './PlayerList';
import { toJS } from 'mobx';
import InfoBox from '../../../components/common/InfoBox';

class NewEventStep4 extends Component {
  handlePress = idPlayer => {
    const p = this.props;
    const store = p.store.matches;

    store.currentEvent.idPlayer = idPlayer;

    p.navigateToPage(4);
  };

  getPlayers = (idTeam, match) => {
    if (idTeam === match.idHomeTeam) return this.getPlayersThatAssist(match.homePlayers);
    if (idTeam === match.idVisitorTeam) return this.getPlayersThatAssist(match.visitorPlayers);

    return null;
  };

  getPlayersThatAssist = players => {
    if (!players) return null;

    return players.filter(player => player.matchData && player.matchData.status === 1);
  };

  render() {
    const p = this.props;
    const store = p.store.matches;
    const match = store.current;
    const ev = store.currentEvent;

    if (!ev) return <InfoBox lMsg="Events.NoEvent" />;

    const players = this.getPlayers(ev.idTeam, match);
    if (!players) return <InfoBox lMsg="Events.NoPlayers" />;

    return (
      <View style={style.View}>
        <EventStatusBar />
        <PlayerList data={players.slice()} onPlayerPressed={this.handlePress} />
      </View>
    );
  }
}

const style = StyleSheet.create({
  View: {},
});

export default inject('store')(observer(NewEventStep4));
