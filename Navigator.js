import React from 'react';
import { Platform } from 'react-native';
import {
  createAppContainer,
  createDrawerNavigator,
  createSwitchNavigator,
  createStackNavigator,
  createBottomTabNavigator,
} from 'react-navigation';
import { gColors } from './GlobalStyles';
import { Localize, setDeviceLangAsync, initLangAndWait } from './components/locale/Loc';

import Drawer from './components/Drawer';

import Login from './screens/Login/Login';
import Password from './screens/Login/Password';

import First from './screens/First';
import TermsAndConditions from './screens/Drawer/TermsAndConditions';
import RegistrationPin from './screens/Login/RegistrationPin';
import RefereeHome from './screens/Home/RefereeHome';
import MatchDetails from './screens/Match/MatchDetails';
import FieldDetails from './screens/Field/FieldDetails';
import EventDetailsPage from './screens/Match/EventDetailsPage';
import CreateEvent from './screens/Match/CreateEvent';
import PlayerFicha from './screens/Match/PlayerFicha';
import CloseRecord from './screens/Match/CloseRecord';
import EditApparelNumber from './screens/Match/EditApparelNumber';
import PersonalData from './screens/Drawer/PersonalData';
import Terms from './screens/Drawer/Terms';

setDeviceLangAsync();

const stackNavigatorOptions = ({ navigation }) => ({
  headerStyle: { backgroundColor: gColors.headerBack, borderBottomWidth: 0 },
  headerTintColor: gColors.headerTint,
  title: navigation.getParam('title', ''),
  gesturesEnabled: false,
  headerBackTitle: Localize('Back'),
});

const MainNavigator = createStackNavigator(
  {
    RefereeHome,
    MatchDetails: MatchDetails,
    FieldDetails: FieldDetails,
    EventDetailsPage: EventDetailsPage,
    PlayerFicha: PlayerFicha,
    CreateEvent: CreateEvent,
    CloseRecord: CloseRecord,
    EditApparelNumber,
  },
  {
    defaultNavigationOptions: stackNavigatorOptions,
  }
);

const TermsNavigator = createStackNavigator(
  {
    TermsAndConditions,
    AcceptTerms: Terms,
  },
  {
    defaultNavigationOptions: stackNavigatorOptions,
  }
);

const PersonalDataNavigator = createStackNavigator(
  {
    PersonalDataScreen: PersonalData,
  },
  {
    defaultNavigationOptions: stackNavigatorOptions,
  }
);

const DrawerNavigator = createDrawerNavigator(
  {
    DrawerHome: MainNavigator,
    PersonalData: PersonalDataNavigator,
    Terms: TermsNavigator,
  },
  {
    contentComponent: Drawer,
  }
);

const LoginNavigator = createStackNavigator(
  {
    Login: Login,
    Password: Password,
    RegistrationPin: RegistrationPin,
  },
  {
    headerMode: 'none',
  }
);

const RootNavigator = createSwitchNavigator(
  {
    First: First,
    Auth: LoginNavigator,
    App: DrawerNavigator,
  },
  {
    initialRouteName: 'First',
  }
);

const App = createAppContainer(RootNavigator);

export default App;
