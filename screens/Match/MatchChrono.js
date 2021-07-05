import React from 'react';
import { StyleSheet, View, Text, ScrollView } from 'react-native';

import { useChrono, chronoStatusString } from '../../components/hooks/useChrono';
import { Localize, LocalizeI } from '../../components/locale/Loc';
import GlobalStyles, { gColors, gMetrics } from '../../GlobalStyles';

import Button from '../../components/common/Button';
import IconButton from '../../components/common/IconButton';
import { displayTimer, getMinuteFromTimer } from '../../utils/utils';

const MatchChrono = ({ match, navigation }) => {
  const { duration } = match;
  const [timer, status, type, resume, stop, reset, changeType] = useChrono(duration);
  const isTimerPlaying = status === 1;

  const handleNewEvent = () => {
    navigation.navigate('CreateEvent', { minutes: getMinuteFromTimer(timer) });
  };

  return (
    <View style={styles.View}>
      <ScrollView
        style={{ ...GlobalStyles.ScrollView, ...styles.View }}
        contentContainerStyle={styles.ScrollContainer}
      >
        <Text style={styles.Centered}>{LocalizeI('Chrono.MatchDuration', duration)}</Text>
        {/* CHRONO */}
        <View style={styles.TimerView} onStartShouldSetResponder={changeType}>
          {type === 'desc' && (
            <Text style={isTimerPlaying ? styles.TimerInfo : styles.TimerInfoPuased}>
              {LocalizeI('Chrono.Remaining')}
            </Text>
          )}
          <Text style={isTimerPlaying ? styles.Timer : styles.TimerPaused}>{displayTimer(timer)}</Text>
        </View>
        <Text style={styles.Centered}>{chronoStatusString(status)}</Text>
        {isTimerPlaying ? (
          <View style={styles.Buttons}>
            <IconButton icon="play" size={60} color={gColors.iconButtonBorder} onPress={null} noFrame />
            <IconButton icon="pause" size={60} color={gColors.text1} onPress={stop} noFrame />
            <IconButton icon="refresh" size={60} color={gColors.iconButtonBorder} onPress={null} noFrame />
          </View>
        ) : (
          <View style={styles.Buttons}>
            <IconButton icon="play" size={60} color={gColors.text1} onPress={resume} noFrame />
            <IconButton icon="pause" size={60} color={gColors.iconButtonBorder} onPress={null} noFrame />
            <IconButton icon="refresh" size={60} color={gColors.text1} onPress={reset} noFrame />
          </View>
        )}
      </ScrollView>
      <View style={styles.AddButton}>
        <Button title="Events.AddNew" onPress={handleNewEvent} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  View: {
    flex: 1,
    backgroundColor: gColors.iconButtonBackground,
  },
  TimerView: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  TimerInfo: {
    alignSelf: 'flex-start',
    marginVertical: 50,
    marginRight: 10,
    color: gColors.text1,
  },
  TimerInfoPuased: {
    alignSelf: 'flex-start',
    marginVertical: 50,
    marginRight: 10,
    color: gColors.iconButtonBorder,
  },
  Centered: {
    textAlign: 'center',
    color: gColors.text1,
  },
  Timer: {
    textAlign: 'center',
    fontSize: 100,
    color: gColors.text1,
    marginVertical: 20,
  },
  TimerPaused: {
    textAlign: 'center',
    fontSize: 100,
    color: gColors.iconButtonBorder,
    marginVertical: 20,
  },
  ScrollContainer: {
    paddingBottom: 80,
  },
  Buttons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 20,
  },
  AddButton: {
    padding: gMetrics.screenPadding,
  },
});

export default MatchChrono;
