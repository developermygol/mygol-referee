import React, { Component } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, StatusBar, TouchableOpacity } from 'react-native';
import { observable, flow, decorate } from 'mobx';
import { inject, observer } from 'mobx-react/native';
import { gColors, gMetrics } from '../../GlobalStyles';
import { Localize } from '../../components/locale/Loc';
import { getUploadsIcon, getFormattedDate } from '../../components/Utils';
import { requestAsync } from '../../components/Utils';
import axios from '../../axios';
import InfoBox from '../../components/common/InfoBox';
import ErrorBox from '../../components/common/ErrorBox';
import PlayerAttendanceSwitch from './PlayerAttendanceSwitch';

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

class PlayerFicha extends Component {
  static navigationOptions = p => {
    //const headerOpts = headerNavigationOptions(p);

    return {
      //...headerOpts,
      title: Localize('Ficha'),
    };
  };

  picture = null;
  loading = false;
  error = null;

  componentDidMount = () => {
    this.loadData();
  };

  handleAttendanceChange = async value => {
    const { store } = this.props;
    const player = store.players.current;

    await store.matches.setPlayerAttendance(player, value);

    //this.props.navigation.goBack();
  };

  handleChangeApparelNumber = async value => {
    const { store } = this.props;
    const player = store.players.current;

    await store.matches.setPlayerApparelNumber(player, value);
    this.props.navigation.navigate('MatchDetails', { idMatch: player.matchData.idMatch });
  };

  loadData = flow(function* () {
    const player = this.props.store.players.current;
  });

  render() {
    const p = this.props;

    if (this.error) return <ErrorBox msg={this.error} />;

    const pl = p.store.players.current;
    if (!pl) return <InfoBox lMsg="Error.NoPlayer" />;

    const t = p.navigation.getParam('team');
    if (!t) return <InfoBox lMsg="Error.Ficha.NoTeam" />;

    const playerAttendance = pl.matchData && pl.matchData.status === 1;
    const imageUrl = getUploadsIcon(pl.idPhotoImgUrl, pl.id, 'user');
    const playerHasMatchApparealNumber = pl.matchData.apparelNumber > 0;

    return (
      <View style={style.View}>
        <StatusBar barStyle="light-content" />
        <ScrollView contentContainerStyle={style.ContainerView} ref={c => (this.fichaView = c)}>
          <View style={[style.Horizontal, { marginBottom: 20, justifyContent: 'space-around' }]}>
            <View style={[style.Half, style.PictureWrapper]}>
              <Image style={style.Picture} source={{ uri: imageUrl }} />
            </View>
            <View style={[style.Half, { alignItems: 'center' }]}>
              <FichaField
                title="Ficha.Apparel"
                value={playerHasMatchApparealNumber ? pl.matchData.apparelNumber : pl.teamData.apparelNumber}
                style={style.ApparelField}
                valueStyle={style.ApparelFieldValue}
                onPressApparelNumber={this.handleChangeApparelNumber}
                navigation={p.navigation}
              />
            </View>
          </View>

          <View style={style.Horizontal}>
            <FichaField style={{ flex: 1 }} title="Ficha.Number" value={pl.idUser} />
            <FichaField style={{ flex: 1 }} title="Ficha.BirthDate" value={getFormattedDate(pl.birthDate)} />
          </View>
          <View style={style.Horizontal}>
            <FichaField style={{ flex: 1 }} title="Ficha.Name" value={pl.name} />
            <FichaField style={{ flex: 1 }} title="Ficha.Surname" value={pl.surname} />
          </View>
          <View style={style.Horizontal}>
            <FichaField style={{ flex: 1 }} title="Ficha.IdCard" value={pl.idCardNumber} />
          </View>
          <View style={style.Horizontal}>
            <View style={{ flex: 1, marginRight: 10 }}>
              <Image style={style.TeamLogo} source={{ uri: getUploadsIcon(t.logoImgUrl, t.id, 'team') }} />
            </View>
            <View style={{ flex: 3 }}>
              <FichaField title="Ficha.Team" value={t.name} />
              {/* <FichaField title="Ficha.Apparel" value={pl.teamData.apparelNumber} /> */}
            </View>
          </View>
        </ScrollView>
        <PlayerAttendanceSwitch
          value={playerAttendance}
          onChange={this.handleAttendanceChange}
          loading={p.store.matches.loading}
        />
      </View>
    );
  }
}

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
});

export default inject('store')(observer(PlayerFicha));

decorate(PlayerFicha, {
  loading: observable,
  error: observable,
});
