import { Platform, Dimensions } from 'react-native';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

export const isAndroid = () => Platform.OS === 'android';
export const isIOS = () => Platform.OS === 'ios';
export const isRippleEffectAndriodVersion = () => Platform.OS === 'android' && Platform.Version >= 21;

// WARN aprox. look for Documetation
export const isSmallPhone = () => windowHeight <= 800 || windowWidth <= 350;

export const displayTimer = timer => {
  const minutes = Math.floor(timer / 60);
  const seconds = timer - minutes * 60;
  return `${minutes}:${seconds < 10 ? '0' + seconds : seconds}`;
};

export const getMinuteFromTimer = timer => Math.floor(timer / 60);
