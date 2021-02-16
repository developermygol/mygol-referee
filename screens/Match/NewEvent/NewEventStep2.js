import React, { Component } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import EventStatusBar from './EventStatusBar';
import { withNavigation } from 'react-navigation';
import EventButton from './EventButton';
import { inject, observer } from 'mobx-react/native';
import { isSimpleEvent } from '../EventDetails';
import { gMetrics } from '../../../GlobalStyles';

const matchEventTypes = [
  1,
  10,
  11,
  12,
  15,
  16,
  17,
  18,
  13,
  30,
  31,
  32,
  33,
  34,
  40,
  41,
  42,
  50,
  61,
  62,
  63,
  64,
  65,
  70,
  80,
  100,
];

class NewEventStep2 extends Component {
  handleEventPressed = type => {
    const p = this.props;
    p.store.matches.currentEvent.type = type;

    // To do: depends on the event type
    const nextPage = isSimpleEvent(type) ? 4 : 2;
    p.navigateToPage(nextPage);
  };

  render() {
    const p = this.props;

    return (
      <ScrollView style={style.View} contentContainerStyle={style.ContentContainer}>
        <EventStatusBar />
        <View style={style.ButtonRow}>
          <EventButton type={1} size={1} onPress={this.handleEventPressed} />
          <EventButton type={31} size={1} onPress={this.handleEventPressed} />
          <EventButton type={61} size={1} onPress={this.handleEventPressed} />
        </View>
        <View style={style.ButtonRow}>
          <EventButton type={34} size={2} onPress={this.handleEventPressed} />
          <EventButton type={33} size={2} onPress={this.handleEventPressed} />
          <EventButton type={32} size={2} onPress={this.handleEventPressed} />
        </View>
        <View style={style.ButtonRow}>
          <EventButton type={40} size={3} onPress={this.handleEventPressed} />
          <EventButton type={42} size={3} onPress={this.handleEventPressed} />
          <EventButton type={41} size={3} onPress={this.handleEventPressed} />
        </View>

        <View style={style.ButtonRow}>
          <EventButton type={62} size={4} onPress={this.handleEventPressed} />
          <EventButton type={63} size={4} onPress={this.handleEventPressed} />
          <EventButton type={64} size={4} onPress={this.handleEventPressed} />
        </View>
        <View style={style.ButtonRow}>
          <EventButton type={65} size={4} onPress={this.handleEventPressed} />
          <EventButton type={30} size={4} onPress={this.handleEventPressed} />
          <EventButton type={70} size={4} onPress={this.handleEventPressed} />
        </View>

        <View style={style.ButtonRow}>
          <EventButton type={13} size={4} onPress={this.handleEventPressed} />
          <EventButton type={10} size={4} onPress={this.handleEventPressed} />
          <EventButton type={11} size={4} onPress={this.handleEventPressed} />
        </View>

        <View style={style.ButtonRow}>
          <EventButton type={12} size={4} onPress={this.handleEventPressed} />
          <EventButton type={15} size={4} onPress={this.handleEventPressed} />
          <EventButton type={16} size={4} onPress={this.handleEventPressed} />
        </View>

        <View style={style.ButtonRow}>
          <EventButton type={17} size={4} onPress={this.handleEventPressed} />
          <EventButton type={18} size={4} onPress={this.handleEventPressed} />
          <EventButton type={50} size={4} onPress={this.handleEventPressed} />
          {/* <EventButton type={100} size={4} onPress={this.handleEventPressed} /> */}
        </View>

        <View style={style.ButtonRow}>
          {/*MatchEventType80*/}
          <EventButton type={80} size={4} onPress={this.handleEventPressed} />
        </View>
      </ScrollView>
    );
  }
}

const style = StyleSheet.create({
  View: {
    flex: 1,
  },
  ContentContainer: {
    marginHorizontal: gMetrics.screenPadding,
  },
  ButtonRow: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'stretch',
  },
});

export default withNavigation(inject('store')(observer(NewEventStep2)));
