import React, { Component } from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import EventStatusBar from './EventStatusBar';
import { inject, observer } from 'mobx-react/native';
import { Localize } from '../../../components/locale/Loc';
import TeamButton from './TeamButton';
import InfoBox from '../../../components/common/InfoBox';
import { gColors, gMetrics } from '../../../GlobalStyles';
import NumericInput from './NumericInput';
import SpinnerButton from '../../../components/common/SpinnerButton';

class NewEventStep3 extends Component {
  state = {
    intData1: 0,
    intData2: 0,
  };

  handlePress = idTeam => {
    const p = this.props;
    const store = p.store.matches;

    store.currentEvent.idTeam = idTeam;

    p.navigateToPage(3);
  };

  handlePressNext = () => {
    this.props.navigateToPage(4);
  };

  changeHomeShootoutScore = points => {
    const parsedPoints = parseInt(points, 10);
    this.props.store.matches.currentEvent.IntData1 = parsedPoints;
    this.setState({ intData1: parsedPoints });
  };

  changeVisitorShootoutScore = points => {
    const parsedPoints = parseInt(points, 10);
    this.props.store.matches.currentEvent.IntData2 = parsedPoints;
    this.setState({ intData2: parsedPoints });
  };

  render() {
    const p = this.props;
    const store = p.store.matches;
    const match = store.current;

    if (!match) return <InfoBox lMsg="Events.NoMatch" />;

    const { homeTeam, visitorTeam } = match;

    const isShootout = store.currentEvent.type === 80;

    if (isShootout)
      return (
        <View style={style.View}>
          <EventStatusBar />
          <View style={style.View}>
            <InfoBox lMsg="PenaltyShootOut.Hint" />
            <View>
              <Text style={style.InputLabel}>{homeTeam.name}</Text>
            </View>
            <TextInput
              style={style.TextInput}
              keyboardType="numeric"
              onChangeText={text => this.changeHomeShootoutScore(text)}
              value={this.state.intData1}
              maxLength={10} //setting limit of input
            />
            <View>
              <Text style={style.InputLabel}>{visitorTeam.name}</Text>
            </View>
            <TextInput
              style={style.TextInput}
              keyboardType="numeric"
              onChangeText={text => this.changeVisitorShootoutScore(text)}
              value={this.state.intData2}
              maxLength={10} //setting limit of input
            />
            <View style={style.ButtonWrapper}>
              <SpinnerButton title="Next" onPress={this.handlePressNext} loading={false} />
            </View>
          </View>
        </View>
      );

    return (
      <View style={style.View}>
        <EventStatusBar />
        <View style={style.Teams}>
          <TeamButton team={homeTeam} onPress={this.handlePress} />
          <TeamButton team={visitorTeam} onPress={this.handlePress} />
        </View>
      </View>
    );
  }
}

const style = StyleSheet.create({
  View: {
    flex: 1,
    paddingHorizontal: gMetrics.screenPadding,
  },
  Teams: {
    flex: 4,
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    alignSelf: 'stretch',
  },
  TextInput: {
    height: 40,
    borderColor: gColors.iconButtonBorder,
    borderWidth: 1,
    marginVertical: 10,
    color: gColors.text1,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  InputLabel: { fontSize: 20, color: gColors.text1 },
  ButtonWrapper: {
    marginVertical: gMetrics.screenPadding,
  },
});

export default inject('store')(observer(NewEventStep3));
