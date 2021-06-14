import React, { Component } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, StatusBar, TouchableOpacity, Alert } from 'react-native';
import { gColors, gMetrics } from '../../GlobalStyles';
import { Localize } from '../../components/locale/Loc';
import { getUploadsIcon, getFormattedDate } from '../../components/Utils';
import axios from '../../axios';
import InfoBox from '../../components/common/InfoBox';
import PlayerAttendanceSwitch from './PlayerAttendanceSwitch';
import { playerNotAcceptedNotices } from '../../helpers/helpers';
import CheckBox from '@react-native-community/checkbox';
import { useDispatch } from 'react-redux';
import {
  updateMatchPlayerAttendance,
  updateMatchPlayerCaptain,
  updateMatchPlayerTitular,
} from '../../store-redux/actions/matches';
import { useState } from 'react';
import { useSelector } from 'react-redux';

class FichaField extends Component {
  render() {
    const p = this.props;

    return (
      <View style={[style.Field, p.style]}>
        <Text style={style.FieldTitle}>{Localize(p.title)}</Text>
        {p.onPressApparelNumber ? (
          <TouchableOpacity
            onPress={() => {
              p.navigation.navigate('EditApparelNumber', { onSubmitApparelNumber: p.onPressApparelNumber });
            }}
          >
            <Text style={[style.FieldValue, p.valueStyle]}>{p.value}</Text>
          </TouchableOpacity>
        ) : (
          <Text style={[style.FieldValue, p.valueStyle]}>{p.value}</Text>
        )}
      </View>
    );
  }
}

const PlayerFicha = ({ navigation }) => {
  const dispatch = useDispatch();
  const { tournamentModes } = useSelector(state => state.tournamentModes);
  const { activeTournament } = useSelector(state => state.tournaments);
  const { activeMatch } = useSelector(state => state.matches);
  const [loading, setLoading] = useState(false);

  const { homePlayers, visitorPlayers } = activeMatch;

  const navPlayer = navigation.getParam('player');
  const team = navigation.getParam('team');
  const match = navigation.getParam('match');

  if (!navPlayer) return <InfoBox lMsg="Error.NoPlayer" />;
  if (!team) return <InfoBox lMsg="Error.NoTeam" />;
  if (!match) return <InfoBox lMsg="Error.NoMatch" />;

  let player = false;
  let isHomeTeamPlayer = false;
  let isVisitorTeamPlayer = false;

  player = homePlayers.find(
    player => player.id === navPlayer.id && player.teamData.idTeam === navPlayer.teamData.idTeam
  );

  if (player) isHomeTeamPlayer = true;
  else
    player = visitorPlayers.find(
      player => player.id === navPlayer.id && player.teamData.idTeam === navPlayer.teamData.idTeam
    );

  if (player) isVisitorTeamPlayer = true;
  else return <InfoBox lMsg="Error.NoPlayer" />;

  const { id, idUser, name, surname, birthDate, idCardNumber, idPhotoImgUrl, matchData, teamData } = player;
  const { id: teamId, name: teamName, logoImgUrl: teamLogo } = team;

  const playerAttendance = matchData && matchData.status === 1;
  const isStarter = matchData && matchData.titular;
  const isCaptain = matchData && matchData.captain;
  const imageUrl = getUploadsIcon(idPhotoImgUrl, id, 'user');
  const playerHasMatchApparealNumber = matchData && matchData.apparelNumber > 0;

  const maxStarters = () => {
    const max = tournamentModes.find(t => t.id === activeTournament.idTournamentMode).numPlayers;

    if (isHomeTeamPlayer)
      return (
        activeMatch.homePlayers.filter(player => player.matchData && player.matchData.captain).length >= max
      );
    if (isVisitorTeamPlayer)
      return (
        activeMatch.visitorPlayers.filter(player => player.matchData && player.matchData.captain).length >=
        max
      );
  };

  const maxCaptains = () => {
    if (isHomeTeamPlayer)
      return (
        activeMatch.homePlayers.filter(player => player.matchData && player.matchData.captain).length >= 1
      );
    if (isVisitorTeamPlayer)
      return (
        activeMatch.visitorPlayers.filter(player => player.matchData && player.matchData.captain).length >= 1
      );
  };

  const maxCaptainsReached = maxCaptains();
  const maxStartersReached = maxStarters();

  const handleAttendanceChange = async value => {
    setLoading(true);

    // 🚧 Validate player notices playerteamacceptednotices/{idPlayer}/{idTeam}/{idTournament}
    const { data: palyerNotices } = await axios.get(
      `matches/playermatchnotices/${player.id}/${player.teamData.idTeam}/${match.id}/${match.idTournament}`
    ); // 🚧🚧🚧 Use redux notices in future *

    const hasAcceptedAllRelevantNotices = handleValidatePlayerNotices(palyerNotices, match.startTime);

    if (hasAcceptedAllRelevantNotices) {
      const req = {
        idMatch: match.id,
        idTeam: player.teamData.idTeam,
        idPlayer: player.id,
        idDay: match.idDay,
        apparelNumber: player.matchData ? player.matchData.apparelNumber : 0,
        attended: value,
      };
      await dispatch(updateMatchPlayerAttendance(req));
    }

    setLoading(false);
  };

  const handleChangeApparelNumber = async value => {
    const req = {
      idMatch: match.id,
      idTeam: player.teamData.idTeam,
      idPlayer: player.id,
      idDay: match.idDay,
      apparelNumber: value,
      attended: player.matchData && player.matchData.status,
    };

    await dispatch(updateMatchPlayerAttendance(req));
    navigation.navigate('MatchDetails', { idMatch: match.id });
  };

  const handleStarter = async value => {
    const req = {
      idMatch: match.id,
      idTeam: player.teamData.idTeam,
      idPlayer: player.id,
      idUser: player.idUser,
      idDay: match.idDay,
      titular: value,
    };

    await dispatch(updateMatchPlayerTitular(req));
  };

  const handleCaptain = async value => {
    const req = {
      idMatch: match.id,
      idTeam: player.teamData.idTeam,
      idPlayer: player.id,
      idUser: player.idUser,
      idDay: match.idDay,
      captain: value,
    };

    await dispatch(updateMatchPlayerCaptain(req));
  };

  const handleValidatePlayerNotices = (playerNotices, startTime) => {
    if (playerNotices.length === 0) return true;

    const relevantNotAcceptedNotices = playerNotAcceptedNotices(playerNotices, startTime);

    if (relevantNotAcceptedNotices.length === 0) return true;

    const alertMessage = `${Localize('Notices.Alert.Title')}\n\n${relevantNotAcceptedNotices
      .map(n => `${n.notice.name}\n\n`)
      .join('')}${Localize('Notices.Alert.Info')}`;

    Alert.alert('', alertMessage);
    setLoading(false);
    return false;
  };

  return (
    <View style={style.View}>
      <StatusBar barStyle="light-content" />
      {/* <ScrollView contentContainerStyle={style.ContainerView} ref={c => (this.fichaView = c)}> */}
      <ScrollView contentContainerStyle={style.ContainerView}>
        <View style={[style.Horizontal, { marginBottom: 20, justifyContent: 'space-around' }]}>
          <View style={[style.Half, style.PictureWrapper]}>
            <Image style={style.Picture} source={{ uri: imageUrl }} />
          </View>
          <View style={[style.Half, { alignItems: 'center' }]}>
            <FichaField
              title="Ficha.Apparel"
              value={playerHasMatchApparealNumber ? matchData.apparelNumber : teamData.apparelNumber}
              style={style.ApparelField}
              valueStyle={style.ApparelFieldValue}
              onPressApparelNumber={handleChangeApparelNumber}
              navigation={navigation}
            />
          </View>
        </View>

        <View style={style.Horizontal}>
          <FichaField style={{ flex: 1 }} title="Ficha.Number" value={idUser} />
          <FichaField style={{ flex: 1 }} title="Ficha.BirthDate" value={getFormattedDate(birthDate)} />
        </View>
        <View style={style.Horizontal}>
          <FichaField style={{ flex: 1 }} title="Ficha.Name" value={name} />
          <FichaField style={{ flex: 1 }} title="Ficha.Surname" value={surname} />
        </View>
        <View style={style.Horizontal}>
          <FichaField style={{ flex: 1 }} title="Ficha.IdCard" value={idCardNumber} />
        </View>
        <View style={style.Horizontal}>
          <View style={{ flex: 1, marginRight: 10 }}>
            <Image style={style.TeamLogo} source={{ uri: getUploadsIcon(teamLogo, teamId, 'team') }} />
          </View>
          <View style={{ flex: 3 }}>
            <FichaField title="Ficha.Team" value={teamName} />
            {/* <FichaField title="Ficha.Apparel" value={pl.teamData.apparelNumber} /> */}
          </View>
        </View>
      </ScrollView>
      {playerAttendance && (
        <React.Fragment>
          <View style={style.CheckContainer}>
            <CheckBox
              tintColors={{ true: gColors.buttonBorder, false: gColors.buttonBorder }}
              tintColor={gColors.buttonBorder}
              onFillColor={gColors.buttonBorder}
              onTintColor={gColors.buttonBorder}
              value={isStarter}
              onValueChange={handleStarter}
              disabled={maxStartersReached}
            />
            <Text style={{ textDecorationLine: maxStartersReached ? 'line-through' : 'none' }}>
              {Localize('Match.Starter')}
            </Text>
          </View>
          <View style={style.CheckContainer}>
            <CheckBox
              tintColors={{ true: gColors.buttonBorder, false: gColors.buttonBorder }}
              tintColor={gColors.buttonBorder}
              onFillColor={gColors.buttonBorder}
              onTintColor={gColors.buttonBorder}
              value={isCaptain}
              onValueChange={handleCaptain}
              disabled={maxCaptainsReached}
            />
            <Text style={{ textDecorationLine: maxCaptainsReached ? 'line-through' : 'none' }}>
              {Localize('Match.Captain')}
            </Text>
          </View>
        </React.Fragment>
      )}
      <PlayerAttendanceSwitch value={playerAttendance} onChange={handleAttendanceChange} loading={loading} />
    </View>
  );
};

const style = StyleSheet.create({
  View: {
    backgroundColor: gColors.background,
    flex: 1,
    justifyContent: 'center',
  },
  ContainerView: {
    padding: gMetrics.screenPadding,
  },
  Head: {
    justifyContent: 'space-around',
    flexDirection: 'row',
  },
  Org: {
    alignSelf: 'stretch',
  },
  Tournament: {
    textAlign: 'center',
    marginBottom: 10,
    fontSize: 25,
    fontWeight: '600',
  },
  PictureWrapper: {},
  Picture: {
    resizeMode: 'contain',
    aspectRatio: 1,
    height: 150,
    flex: 1,
    borderWidth: 1,
    borderColor: 'black',
  },
  Horizontal: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  Half: {
    flex: 1,
  },
  Field: {
    marginBottom: 10,
  },
  FieldTitle: {
    color: gColors.text2,
  },
  FieldValue: {
    fontSize: 24,
    color: gColors.text1,
  },
  TeamLogo: {
    flex: 1,
    height: 100,
    resizeMode: 'contain',
  },
  ApparelField: {
    flex: 1,
  },
  ApparelFieldValue: {
    fontSize: 120,
    fontWeight: '600',
  },
  CheckContainer: {
    flexDirection: 'row',
    backgroundColor: gColors.iconButtonBackground,
    borderTopWidth: 1,
    borderTopColor: gColors.text2,
    alignItems: 'center',
    paddingHorizontal: 10,
  },
});

export default PlayerFicha;
