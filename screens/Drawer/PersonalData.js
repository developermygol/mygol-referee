import React, { Component } from 'react';
import { View, Text, StyleSheet, ScrollView, KeyboardAvoidingView, TouchableOpacity } from 'react-native';
import { inject, observer } from 'mobx-react/native';
import Loc, { Localize } from '../../components/locale/Loc';
import gStyles, { gMetrics } from '../../GlobalStyles';
import t from 'tcomb-form-native';
import SpinnerButton from '../../components/common/SpinnerButton';
import GlobalStyles from '../../GlobalStyles';
import { observable, decorate } from '../../node_modules/mobx';
import { headerNavigationOptions } from '../Home/Header';
import AttachImage from '../../components/common/AttachImage';
import { getUploadsIcon, toast } from '../../components/Utils';

var { Form } = t.form;

class PersonalData extends Component {
  static navigationOptions = p => {
    const headerOpts = headerNavigationOptions(p);
    return {
      ...headerOpts,
      title: Localize('PersonalDataScreenTitle'),
    };
  };

  componentDidMount = () => {
    this.dfd = this.props.navigation.addListener('didFocus', this.componentDidFocus);
  };

  componentWillUnmount = () => {
    if (this.dfd) this.dfd.remove();
  };

  componentDidFocus = () => {
    this.data = this.adaptStoreToForm();

    const input = this.form.getComponent('name').refs.input;
    input.focus();
  };

  needsPassword = () => {
    return this.props.navigation.getParam('needsPassword', false);
  };

  handleNextButton = async () => {
    const data = this.adaptFormToStore();
    if (!data) {
      toast.error(Localize('Error.ValidationFailed'));
      return;
    }

    if (this.needsPassword()) {
      if (!data.password || data.password.length < 8) {
        toast.error(Localize('Error.PasswordRequired'));
        return;
      }
    }

    const image1 = this.capture.getImage();
    const st = this.props.store.referees;
    const result = await st.updatePersonalData(data, image1);

    if (result) {
      this.props.navigation.navigate('RefereeHome');
    }
  };

  LoginForm = t.struct({
    name: t.String,
    mobile: t.maybe(t.String),
    email: t.maybe(t.String),
    // surname: t.String,
    // address1: t.String,
    // address2: t.maybe(t.String),
    // city: t.String,
    // state: t.String,
    // cp: t.String,
    // country: t.String,
    // idCardNumber: t.String,
    // birthDate: t.Date,
    password: t.maybe(t.String),
  });

  getForm = () => {
    return this.LoginForm;
  };

  getFormOptions = () => {
    const editable = true;

    return {
      fields: {
        name: {
          label: Localize('EnName'),
          error: Localize('EnName.Validation'),
          placeholder: Localize('EnName.PlaceHolder'),
          editable,
        },
        mobile: {
          label: Localize('EnMobile'),
          error: Localize('EnMobile.Validation'),
          placeholder: Localize('EnMobile.PlaceHolder'),
          editable,
        },
        email: {
          label: Localize('EnEmail'),
          error: Localize('EnEmail.Validation'),
          placeholder: Localize('EnEmail.PlaceHolder'),
          editable,
        },
        // surname: { label: Localize('EnSurname'), error: Localize('EnSurname.Validation'), placeholder: Localize('EnSurname.PlaceHolder'), editable },
        // address1: { label: Localize('EnAddress1'), error: Localize('EnAddress1.Validation'), placeholder: Localize('EnAddress1.PlaceHolder'), editable },
        // address2: { label: Localize('EnAddress2'), error: Localize('EnAddress2.Validation'), placeholder: Localize('EnAddress2.PlaceHolder'), editable },
        // city: { label: Localize('EnCity'), error: Localize('EnCity.Validation'), placeholder: Localize('EnCity.PlaceHolder'), editable },
        // state: { label: Localize('EnState'), error: Localize('EnState.Validation'), placeholder: Localize('EnState.PlaceHolder'), editable },
        // cp: { label: Localize('EnCp'), error: Localize('EnCp.Validation'), placeholder: Localize('EnCp.PlaceHolder'), editable },
        // country: { label: Localize('EnCountry'), error: Localize('EnCountry.Validation'), placeholder: Localize('EnCountry.PlaceHolder'), editable },
        // idCardNumber: { label: Localize('EnIdCardNumber'), error: Localize('EnIdCardNumber.Validation'), placeholder: Localize('EnIdCardNumber.PlaceHolder'), editable },
        // birthDate: { label: Localize('EnBirthDate'), error: Localize('EnBirthDate.Validation'), placeholder: Localize('EnBirthDate.PlaceHolder'), mode: 'date', config: { format: getFormattedDate }, editable },
        password: {
          label: Localize('EnPassword'),
          error: Localize('EnPassword.Validation'),
          placeholder: Localize('EnPassword.PlaceHolder'),
          autoCapitalize: 'none',
          autoCorrect: false,
          keyboardType: 'visible-password',
        },
      },
    };
  };

  adaptStoreToForm = () => {
    const referee = this.props.store.referees.owner;
    return { ...referee };
  };

  adaptFormToStore = () => {
    // Should this go on the store?
    const form = this.form.getValue();
    if (!form) return null; // Validation error

    const result = { ...this.props.store.referees.owner, ...form };

    return result;
  };

  data = this.adaptStoreToForm();

  render() {
    const p = this.props;
    const store = p.store.referees;

    const image = this.data ? getUploadsIcon(this.data.avatarImgUrl, this.data.id, 'user') : null;

    return (
      <KeyboardAvoidingView behavior="padding" style={style.View}>
        <ScrollView style={GlobalStyles.MainView} contentContainerStyle={style.ScrollView}>
          <View style={style.FormView}>
            {this.needsPassword() ? (
              <Text style={style.Intro}>
                <Loc>PersonalData.Intro</Loc>
              </Text>
            ) : null}
            <AttachImage
              style={style.ProfilePicture}
              image={image}
              label="SoProfilePicture"
              aspect={[1, 1]}
              imageSize={{ width: 160, height: 160 }}
              ref={c => (this.capture = c)}
            />
            <Form
              ref={c => (this.form = c)}
              type={this.getForm()}
              options={this.getFormOptions()}
              value={this.data}
              onChange={raw => {
                this.data = raw;
              }}
            />
            <SpinnerButton
              title="Save"
              onPress={this.handleNextButton}
              style={gStyles.NextButton}
              loading={store.loading}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    );
  }
}

const style = StyleSheet.create({
  View: {
    flex: 1,
  },
  ScrollView: {
    padding: gMetrics.screenPadding,
    paddingBottom: 80,
  },
  FormView: {
    padding: 0,
  },
  Intro: {
    marginBottom: 20,
  },
  ProfilePicture: {
    marginBottom: 20,
  },
});

export default inject('store')(observer(PersonalData));

decorate(PersonalData, {
  data: observable,
});
