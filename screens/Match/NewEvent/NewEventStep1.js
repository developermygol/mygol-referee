import React, { Component } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import { observer, inject } from 'mobx-react/native';
import InfoBox from '../../../components/common/InfoBox';
import NumericInput from './NumericInput';

class NewEventStep1 extends Component {
  handleSubmit = () => {
    this.props.navigateToPage(1);
  };

  handleTextChanged = text => {
    this.props.store.matches.currentEvent.matchMinute = text;
  };

  render() {
    const p = this.props;
    const ev = p.store.matches.currentEvent;

    if (p.crhonoMinutes) this.handleTextChanged(crhonoMinutes);

    if (!ev) return <InfoBox lMsg="Events.NoEvent" />;

    return (
      <View style={style.View}>
        <NumericInput
          value={this.props.chronoMinutes || 0}
          onChange={this.handleTextChanged}
          onEnter={this.handleSubmit}
          title="Events.Minute"
          subTitle="Events.Minute.Hint"
          maxLength={3}
        />
      </View>
    );
  }
}

const style = StyleSheet.create({
  View: {
    flex: 1,
  },
});

export default inject('store')(observer(NewEventStep1));
