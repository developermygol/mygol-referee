import React, { Component } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import ScrollableTabView from 'react-native-scrollable-tab-view';
import { ScrollableTabViewProps } from '../../GlobalStyles';
import NewEventStep1 from './NewEvent/NewEventStep1';
import { inject, observer } from 'mobx-react/native';
import { Localize } from '../../components/locale/Loc';
import NewEventStep2 from './NewEvent/NewEventStep2';
import NewEventStep3 from './NewEvent/NewEventStep3';
import NewEventStep4 from './NewEvent/NewEventStep4';
import NewEventStep5 from './NewEvent/NewEventStep5';
import { observable } from 'mobx';

class CreateEvent extends Component {
  static navigationOptions = {
    title: Localize('Events.AddNew'),
  };

  getMinuteOfLastEvent = events => {
    if (!events || events.length === 0) return 0;

    let max = 0;
    for (let i = 0; i < events.length; ++i) {
      const e = events[i];
      if (!e) continue;

      if (e.matchMinute > max) max = e.matchMinute;
    }

    return max;
  };

  getEmptyEvent = () => {
    const store = this.props.store.matches;
    const match = store.current;

    return observable({
      matchMinute: match ? this.getMinuteOfLastEvent(match.events) : 0,
      idMatch: match && match.id,
      type: -1,
      idTeam: -1,
      idPlayer: -1,
    });
  };

  componentDidMount = () => {
    this.dfd = this.props.navigation.addListener('didFocus', this.componentDidFocus);
  };

  componentWillUnmount = () => {
    if (this.dfd) this.dfd.remove();
  };

  componentDidFocus = () => {
    this.props.store.matches.currentEvent = this.getEmptyEvent();
  };

  navigateToPage = pageIndex => {
    if (!this.scrollView) return;

    this.scrollView.goToPage(pageIndex);
  };

  render() {
    const chronoMinutes = this.props.navigation.getParam('minutes');

    return (
      <View style={style.View}>
        <ScrollableTabView {...ScrollableTabViewProps} initialPage={0} ref={c => (this.scrollView = c)}>
          <NewEventStep1
            key={1}
            tabLabel={Localize('Events.Minute')}
            navigateToPage={this.navigateToPage}
            chronoMinutes={chronoMinutes}
          />
          <NewEventStep2 key={2} tabLabel={Localize('Events.Type')} navigateToPage={this.navigateToPage} />
          <NewEventStep3 key={3} tabLabel={Localize('Events.Team')} navigateToPage={this.navigateToPage} />
          <NewEventStep4 key={4} tabLabel={Localize('Events.Player')} navigateToPage={this.navigateToPage} />
          <NewEventStep5 key={5} tabLabel={Localize('Events.Summary')} navigateToPage={this.navigateToPage} />
        </ScrollableTabView>
      </View>
    );
  }
}

const style = StyleSheet.create({
  View: {
    flex: 1,
  },
});

export default inject('store')(observer(CreateEvent));
