import React, { Component } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { Localize, setLang } from './locale/Loc';
import { inject, observer } from 'mobx-react/native';
import { gColors } from '../GlobalStyles';
import { toast } from './Utils';
import { withNavigation } from 'react-navigation';

class DrawerItem extends Component {
  handlePress = () => {
    const p = this.props;

    if (p.onPress) {
      p.onPress();
      return;
    }

    if (p.navigate && p.navigation) p.navigation.navigate(p.navigate, p.params);
  };

  render() {
    const p = this.props;

    return (
      <TouchableOpacity style={style.Item} onPress={this.handlePress} activeOpacity={0.2}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          {p.icon ? (
            <FontAwesome name={p.icon} size={22} style={style.ItemIcon} color={gColors.text1} />
          ) : null}
          <Text style={style.ItemText}>{Localize(p.title)}</Text>
        </View>
      </TouchableOpacity>
    );
  }
}

class Drawer extends Component {
  handleLogout = () => {
    toast.confirm(Localize('Confirm'), Localize('Logout?')).then(res => {
      if (res !== 'Yes') return;
      const p = this.props;
      p.ui.auth.logout().then(res => {
        p.navigation.navigate('First');
      });
    });
  };

  componentDidMount = () => {};

  render() {
    const p = this.props;

    return (
      <View style={style.View}>
        <View style={style.Top}></View>
        <DrawerItem title="Home" navigate="RefereeHome" icon="user-circle" navigation={p.navigation} />
        {/* <DrawerItem title='Tournaments' navigate='TournamentsList' icon='trophy' navigation={p.navigation} /> */}
        {/* <DrawerItem title='News' navigate='News' icon='newspaper-o' navigation={p.navigation} /> */}
        <DrawerItem
          title="PersonalDataScreenTitle"
          navigate="PersonalDataScreen"
          icon="id-card"
          navigation={p.navigation}
          params={{ needsPassword: false }}
        />
        <DrawerItem
          title="TermsAndConditions"
          navigate="TermsAndConditions"
          icon="file"
          navigation={p.navigation}
        />
        {/* <DrawerItem title='Configuration' navigate='Configuration' icon='gear' navigation={p.navigation} /> */}
        <DrawerItem title="Logout" onPress={this.handleLogout} icon="sign-out" />
      </View>
    );
  }
}

const style = StyleSheet.create({
  View: {
    flex: 1,
    backgroundColor: gColors.background,
  },
  Item: {
    padding: 15,
  },
  ItemText: {
    fontWeight: '600',
    color: gColors.text1,
  },
  ItemIcon: {
    marginLeft: 5,
    marginRight: 15,
    width: 30,
  },
  Top: {
    height: 80,
    backgroundColor: '#EEE',
    alignItems: 'center',
  },
});

export default withNavigation(inject('store', 'ui')(observer(Drawer)));
