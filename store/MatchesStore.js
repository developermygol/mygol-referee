import { Alert } from 'react-native';
import { observable, action, flow, decorate } from 'mobx';
import { createCrudActions } from './CrudActions';
import axios from '../axios';
import { requestAsync, getDateOnlyString } from '../components/Utils';
import { findByIdInArray, removeByIdInArray, groupBy2 } from '../components/Data';
import { Localize } from '../components/locale/Loc';

export default class MatchesStore {
  current = null;
  all = null;
  loading = false;
  error = null;
  currentEvent = null;
  matchesByDays = null;

  rootStore = null;

  constructor(rootStore) {
    this.rootStore = rootStore;
    this.actions = createCrudActions(this, '/matches', null, null, null, {
      afterGet: response => {
        // Need to have matchdata set to null (so the propoerty exists in the object) for players without it.
        // Otherwise, attendance is not updated correctly when set in
        this.appendMatchDataToPlayers(response.homePlayers);
        this.appendMatchDataToPlayers(response.visitorPlayers);
        return response;
      },
    });
  }

  getForReferee = flow(function* () {
    this.all = null;

    const result = yield requestAsync(this, axios.get, null, '/matches/forreferee/');
    if (!result) return;

    this.setAllMatches(result);

    return result;
  });

  setAllMatches = matches => {
    this.all = matches;
    this.matchesByDays = groupBy2(this.all, m => getDateOnlyString(m.startTime));
  };

  appendMatchDataToPlayers = players => {
    players.map(pl => {
      if (pl.matchData) return;
      pl.matchData = { status: 0 };
    });
  };

  setPlayerApparelNumber = flow(function* (player, apparelNumber) {
    const idTeam = player.teamData.idTeam;
    const selectedApparelNumber = parseInt(apparelNumber);
    const payload = {
      idPlayer: player.id,
      idUser: player.idUser,
      idTeam: idTeam,
      apparelNumber: selectedApparelNumber,
      attended: player.matchData.status,
      idMatch: this.current.id,
      idDay: this.current.idDay,
    };

    // Send the details to the backend and update the player data
    const result = yield requestAsync(
      this,
      axios.post,
      null,
      '/matches/setplayermatchapparelnumber',
      payload
    );
    if (!result) return;

    if (!player.matchData) player.matchData = observable({ apparelNumber: selectedApparelNumber });

    player.matchData.apparelNumber = selectedApparelNumber;

    // Update player in the current match
    if (!this.current) return;
  });

  setPlayerAttendance = flow(function* (player, attended) {
    const idTeam = player.teamData.idTeam;

    const payload = {
      idPlayer: player.id,
      idUser: player.idUser,
      idTeam: idTeam,
      apparelNumber: player.teamData.apparelNumber,
      attended,

      idMatch: this.current.id,
      idDay: this.current.idDay,
    };

    // Send the details to the backend and update the player data
    const result = yield requestAsync(this, axios.post, null, '/matches/setplayerattendance', payload);
    if (!result) return;

    if (!player.matchData) player.matchData = observable({ status: 0 });
    player.matchData.status = attended ? 1 : 0;

    // Update player in the current match
    if (!this.current) return;

    const matchPlayer = findByIdInArray(
      idTeam === this.current.idHomeTeam ? this.current.homePlayers : this.current.visitorPlayers,
      player.id
    );
    if (matchPlayer) {
      const ssss = matchPlayer.matchData.status;
    }
  });

  createCurrentEvent = flow(function* () {
    if (!this.currentEvent) return;

    // Send new event to the backend
    const result = yield requestAsync(this, axios.post, null, '/matches/createevent', this.currentEvent);
    if (!result) return;

    // Update match and events
    this.updateCurrentMatch(result.match);

    const match = this.current;
    match.events.unshift(result.event);

    if (result.newEvents && result.newEvents.length > 0) {
      result.newEvents.map(e => match.events.unshift(e));
      Alert.alert(Localize('Attention'), Localize('Events.NewCardsFromEvents'), [
        { text: 'Ok', onPress: () => {} },
      ]);
    }
  });

  deleteEvent = flow(function* (event) {
    if (!event) return;

    const result = yield requestAsync(this, axios.post, null, '/matches/deleteevent', event);
    if (!result) return;

    // Update match and events
    this.updateCurrentMatch(result);

    removeByIdInArray(this.current.events, event.id);
  });

  saveRecordClose = flow(function* (data) {
    if (!data) return;

    var result = yield requestAsync(this, axios.post, null, '/matches/updatecloserecord', data);
    if (!result) return null;

    this.updateCurrentMatch(result.match);

    this.current.events.unshift(result.event);

    return result;
  });

  isRecordClosed = () => {
    if (!this.current || this.current.events.length === 0) return false;

    var rc = this.current.events.filter(ev => ev.type === 100);
    return rc.length === 1;
  };

  updateCurrentMatch = newMatchData => {
    if (!newMatchData) return;

    this.current.homeScore = newMatchData.homeScore;
    this.current.visitorScore = newMatchData.visitorScore;
    this.current.status = newMatchData.status;
  };
}

decorate(MatchesStore, {
  loading: observable,
  error: observable,
  all: observable,
  current: observable,
  currentEvent: observable,
  matchesByDays: observable,
});
