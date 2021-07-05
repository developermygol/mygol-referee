import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
// import { AppLoading /*ScreenOrientation*/ } from 'expo';
import AppLoading from 'expo-app-loading'; // SDK 40 expo install expo-app-loading
import * as ScreenOrientation from 'expo-screen-orientation'; // SDK37
import { Provider } from 'mobx-react/native';
import { Provider as ProvaiderRedux } from 'react-redux';
import Store from './store/Store';
import store from './store-redux/store';
import UiStore from './store/UiStore';
import { setupPushNotifications } from './components/PushNotifications';
import RootNavigator from './Navigator';

Text.allowFontScaling = false;

export default class App extends React.Component {
  state = {
    isReady: false,
  };

  loadAsync = async () => {
    try {
      // await Expo.ScreenOrientation.allowAsync(
      //   Expo.ScreenOrientation.Orientation.PORTRAIT
      // );
      await ScreenOrientation.lockAsync(ScreenOrientation.Orientation.PORTRAIT); // SDK 34
      await setupPushNotifications();
      await UiStore.auth.hydrate();
    } catch (e) {
      console.log(e);
    }
  };

  render() {
    if (!this.state.isReady)
      return (
        <AppLoading
          startAsync={this.loadAsync}
          onFinish={() => this.setState({ isReady: true })}
          onError={console.warn}
        />
      );

    return (
      <ProvaiderRedux store={store}>
        <Provider store={Store} ui={UiStore}>
          <RootNavigator />
        </Provider>
      </ProvaiderRedux>
    );
  }
}
