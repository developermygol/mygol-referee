import React, { Component } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { inject, observer } from 'mobx-react/native';
import { withNavigation } from 'react-navigation';
import Button from '../../components/common/Button';
import GlobalStyles, { gMetrics, GS } from '../../GlobalStyles';
import Loc, { Localize } from '../../components/locale/Loc';

class MatchMinutes extends Component {
  handleGoButton = () => {
    this.props.navigation.navigate('CloseRecord');
  };

  render() {
    const p = this.props;
    const store = p.store.matches;

    const canEdit = !store.isRecordClosed();
    const comments = store.current && store.current.comments;

    return (
      <View style={style.View}>
        <ScrollView style={GlobalStyles.ScrollView} contentContainerStyle={style.ScrollContainer}>
          <Text style={style.Title}>
            <Loc>Match.Comments</Loc>
          </Text>
          <Text style={style.Comments}>{comments || Localize('Match.NoComments')}</Text>
        </ScrollView>
        {canEdit ? (
          <View style={style.ActionButton}>
            <Button title="Match.GoToCloseRecord" onPress={this.handleGoButton} />
          </View>
        ) : null}
      </View>
    );
  }
}

const style = StyleSheet.create({
  View: {
    flex: 1,
  },
  ScrollContainer: {
    //padding: gMetrics.screenPadding
    paddingBottom: 80,
  },
  Title: {
    ...GS.font.title2,
    marginBottom: 5,
  },
  Comments: {},
  ActionButton: {
    padding: gMetrics.screenPadding,
  },
});

export default withNavigation(inject('store')(observer(MatchMinutes)));
