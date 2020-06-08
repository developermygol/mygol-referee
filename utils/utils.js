import { Platform, Dimensions } from 'react-native';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

export const isAndroid = () => Platform.OS === 'android';
export const isIOS = () => Platform.OS === 'ios';
export const isRippleEffectAndriodVersion = () => Platform.OS === 'android' && Platform.Version >= 21;

// WARN aprox. look for Documetation
export const isSmallPhone = () => windowHeight <= 800 || windowWidth <= 350;
