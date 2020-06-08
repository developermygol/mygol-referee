import React, { Component } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { observer } from 'mobx-react/native';
import { observable, action, decorate } from 'mobx';
import Loc, { Localize } from '../../../components/locale/Loc';
import { GS, gMetrics } from '../../../GlobalStyles';
import NewEventHeader from './NewEventHeader';
import { isSmallPhone } from '../../../utils/utils';

class KeyPadButton extends Component {
  handleTouch = () => {
    const p = this.props;

    if (p.onPress) p.onPress(p.value);
  };

  getCaption = value => {
    switch (value) {
      case 100:
        return Localize('KeyPad.Delete');
      case 13:
        return Localize('KeyPad.Enter');
      default:
        return value;
    }
  };

  render() {
    const { value, onPress } = this.props;

    return (
      <View style={keyStyle.View}>
        <TouchableOpacity onPress={this.handleTouch} style={keyStyle.Touchable}>
          <Text style={keyStyle.Caption}>{this.getCaption(value)}</Text>
        </TouchableOpacity>
      </View>
    );
  }
}

const keyStyle = {
  KeyPadRow: {
    flexDirection: 'row',
  },
  View: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  Touchable: {
    alignSelf: 'stretch',
    alignItems: 'center',
    padding: 10,
  },
  Caption: {
    fontSize: isSmallPhone() ? 30 : 38,
    fontWeight: '600',
  },
};

class KeyPad extends Component {
  buttons = [1, 2, 3, 4, 5, 6, 7, 8, 9, 100, 0, 13];

  getRow = (items, onPress) => {
    return (
      <View style={null} style={keyStyle.KeyPadRow} key={items}>
        {items.map(button => (
          <KeyPadButton key={button} value={button} onPress={onPress} />
        ))}
      </View>
    );
  };

  render() {
    const { onPress } = this.props;

    return [
      this.getRow([1, 2, 3], onPress),
      this.getRow([4, 5, 6], onPress),
      this.getRow([7, 8, 9], onPress),
      this.getRow([100, 0, 13], onPress),
    ];
  }
}

class NumericInput extends Component {
  value = this.props.value !== undefined ? this.props.value.toString() : '';

  onChange = () => {
    const p = this.props;

    if (p.onChange) p.onChange(this.value);
  };

  removeZeros = () => {
    var v = this.value;
    if (!v.startsWith('0')) return;
    if (v === '0') return;

    this.value = v.replace(/^0+/, '');
  };

  handlePress = number => {
    const p = this.props;
    const v = this.value;

    switch (number) {
      case 100: // delete
        if (v.length > 0) this.value = v.substring(0, v.length - 1);
        break;
      case 13: // Enter
        p.onEnter();
        break;
      default:
        // number
        if (p.maxLength > 0 && v.length >= p.maxLength) break;

        this.value = v + number;
        break;
    }

    this.removeZeros();

    this.onChange();
  };

  render() {
    const p = this.props;
    const { value, onChange, onEnter, title, subTitle } = p;

    return (
      <View style={style.View}>
        <NewEventHeader title={title} subTitle={subTitle} />
        <Text style={style.Input}>{this.value}</Text>
        <KeyPad onPress={this.handlePress} style={style.KeyPadWrapper} />
      </View>
    );
  }
}

const style = StyleSheet.create({
  View: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: gMetrics.screenPadding,
  },
  TitleWrapper: {
    flex: 1,
    justifyContent: 'space-around',
  },
  Title: {
    ...GS.font.headTitle1,
    textAlign: 'center',
    textAlignVertical: 'center',

    alignSelf: 'stretch',
  },
  SubTitle: {},
  Input: {
    flex: 2,
    fontSize: isSmallPhone() ? 100 : 150,
    fontWeight: '400',
  },

  KeyPadWrapper: {
    flex: 3,
  },
});

export default observer(NumericInput);

decorate(NumericInput, {
  value: observable,
  handlePress: action,
});
