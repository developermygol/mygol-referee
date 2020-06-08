import React, { Component } from 'react';
import {
  KeyboardAvoidingView,
  View,
  Keyboard,
  Animated,
  Text,
  StyleSheet,
  Image,
  ImageBackground,
  StatusBar,
} from 'react-native';
import GlobalStyles, { gColors, LoginFormStyleSheet } from '../../GlobalStyles';
import { Localize } from '../../components/locale/Loc';
import t from 'tcomb-form-native';
import { observable, decorate } from 'mobx';
import { observer, inject } from 'mobx-react/native';
import Logo from '../../assets/mygol-logo-white.png';
import SpinnerButton from '../../components/common/SpinnerButton';
import { toast } from '../../components/Utils';
import Background from '../../assets/backgrounds/1.jpg';
import { isIOS } from '../../utils/utils';

const LoginPasswordRequired = 1;
const LoginNoPasswordSet = 10;

var { Form } = t.form;

class Login extends Component {
  loading = false;
  data = null;

  static navigationOptions = {
    //title: Localize('LoginEmail'),
    header: null,
  };

  componentDidMount = () => {
    const input = this.form.getComponent('email').refs.input;
    //input.focus();
  };

  LoginForm = t.struct({
    email: t.String,
  });

  FormOptions = {
    fields: {
      email: {
        label: '  ', //Localize('LoginEmail'),
        error: Localize('LoginEmail.Validation'),
        placeholder: Localize('LoginEmail.PlaceHolder'),
        keyboardType: 'email-address',
        stylesheet: LoginFormStyleSheet,
        placeholderTextColor: '#BBB',
        autoCapitalize: 'none',
      },
    },
  };

  handleSubmit = async () => {
    const data = this.form.getValue();
    if (!data) {
      toast.error(Localize('Error.ValidationFailed'));
      return;
    }

    const result = await this.props.ui.auth.basicLogin(data);
    if (!result) return;

    const nav = this.props.navigation;

    switch (result.action) {
      case LoginPasswordRequired:
        nav.navigate('Password');
        break;
      case LoginNoPasswordSet:
        nav.navigate('RegistrationPin');
        break;
    }
  };

  render() {
    const { error, loading } = this.props.ui.auth;

    return (
      <KeyboardAvoidingView behavior={isIOS() ? 'padding' : 'height'}>
        <StatusBar barStyle="light-content" />
        <ImageBackground source={Background} style={[GlobalStyles.ScreenImageBackground, style.View]}>
          <Image style={style.Logo} source={Logo} ref={c => (this.logo = c)} />
          <Text style={style.IntroTitle}>{Localize('LoginWelcome')}</Text>
          <Text style={style.IntroText}>{Localize('LoginIntro')}</Text>
          <Form
            ref={c => (this.form = c)}
            type={this.LoginForm}
            options={this.FormOptions}
            value={this.data}
            onChange={raw => {
              this.data = raw;
            }}
          />
          {/* {error ? <ErrorMsg msg={error} /> : null} */}
          <SpinnerButton title="Next" onPress={this.handleSubmit} style={style.Button} loading={loading} />
        </ImageBackground>
      </KeyboardAvoidingView>
    );
  }
}

const style = StyleSheet.create({
  View: {
    //flex: 1,
    //alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    paddingTop: 70,
  },

  Logo: {
    flex: 1,
    alignSelf: 'center',
    resizeMode: 'contain',
    width: 200,
    height: 200,
  },
  IntroTitle: {
    margin: 10,
    textAlign: 'center',
    fontSize: 20,
    fontWeight: '600',
    color: gColors.loginText,
  },
  IntroText: {
    margin: 10,
    textAlign: 'center',
    color: gColors.loginText,
  },
  Button: {
    flex: 1,
    marginBottom: 30,
    justifyContent: 'center',
  },
});

export default inject('ui')(observer(Login));

decorate(Login, {
  loading: observable,
  data: observable,
});
