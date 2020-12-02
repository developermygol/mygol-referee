import { Localize, LocalizeOrDefault } from './locale/Loc';
import { flow } from 'mobx';
import { Alert, Share } from 'react-native';
import config from '../Config';
import { Platform } from 'react-native';
import { takeSnapshotAsync } from 'expo';
import dateFormat from 'dateformat';
import axios from '../axios';

// Replace later with the real implementation
export class toast {
  static success(msg) {
    //console.log('TOAST: Success ' + msg);
  }

  static error(msg) {
    Alert.alert(Localize('Error'), msg, [{ text: 'Ok', onPress: () => {} }]);
  }

  static confirm(title, msg) {
    return new Promise((resolve, reject) => {
      Alert.alert(title, msg, [
        {
          text: Localize('No'),
          onPress: () => {
            resolve('No');
          },
          style: 'cancel',
        },
        {
          text: Localize('Yes'),
          onPress: () => {
            resolve('Yes');
          },
        },
      ]);
    });
  }
}

export const getAge = dateString => {
  var today = new Date();
  var birthDate = new Date(dateString);
  var age = today.getFullYear() - birthDate.getFullYear();
  var m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }

  if (age > 125) return null;

  return age;
};

// __ API requests ____________________________________________________________

export const getOpErrorText = error => {
  if (!error) return Localize('Error.NoErrorCode');

  let msg = null;

  if (error.response) {
    // The request was made and the server returned an error
    const { status } = error.response;

    if (status >= 200 && status <= 400) msg = LocalizeOrDefault(error.response.data);
    else if (status > 400 && status < 500) msg = Localize('Error.404');
    else msg = Localize('Error.Generic');
  } else if (error.request) {
    // Request is made but there is no response
    msg = Localize('Error.NoResponse');
  } else {
    // This is an error setting up the request
    msg = error.message || LocalizeOrDefault(error);
  }

  return msg;
};

export const requestAsync = function (state, operation, okMessage, ...args) {
  return new Promise((resolve, reject) => {
    if (state) {
      state.loading = true;
      state.error = null;
    }

    //console.log(args[0]);
    // check connection here. If no connection, show a "no connection" warning in the headerBar and try
    // to get the content from the cache. If not there, return an error.

    operation(...args).then(
      res => {
        if (state) state.loading = false;
        if (okMessage) toast.success(Localize(okMessage));
        // Cache the content here.
        resolve(res.data);
      },
      err => {
        if (state) state.loading = false;
        const errorMsg = getOpErrorText(err);
        if (state) {
          state.error = errorMsg;
        }

        toast.error(errorMsg);

        //reject(errorMsg);
        resolve(null);
      }
    );
  });
};

export const request = flow(function* (state, operation, okMessage, ...args) {
  try {
    state.loading = true;
    const res = yield operation(...args);
    state.loading = false;
    if (okMessage) toast.success(Localize(okMessage));
    return res.data;
  } catch (err) {
    state.error = err;
    state.loading = false;
    toast.error(getOpErrorText(err));
    return null;
  }
});

// __ Image urls ______________________________________________________________

const defIcons = {
  team: 10,
  tournament: 3,
  user: 8,
  org: 1,
};

export const getUploadsIcon = (imgSrc, idObject, type = 'team') => {
  if (imgSrc && imgSrc !== 'undefined') return getUploadUrl(imgSrc);

  if (typeof idObject === 'undefined') idObject = 0;
  const i = (idObject % defIcons[type]) + 1;
  return getStaticRoot() + '/' + type + '/default' + i + '.png';
};

export const getUploadUrl = repoPath => {
  if (repoPath.startsWith('http')) return repoPath;
  return getUploadRoot() + '/' + repoPath;
};

export const getStaticRoot = () => {
  return config.reactAppStaticUrl;
};

export const getUploadRoot = () => {
  return config.reactAppStaticUploadsUrl;
};

// __ Upload image ____________________________________________________________

export const uploadImage = async (target, uri, idUser, uploadType, secure = false) => {
  let uriParts = uri.split('.');
  let fileType = uriParts[uriParts.length - 1];

  const f = new FormData();
  //f.append("file", uri);
  f.append('type', uploadType); // `image/${fileType}`
  f.append('idobject', idUser);
  f.append('createThumbnails', '1');

  f.append('photo', {
    uri,
    name: `photo.${fileType}`,
    type: `image/${fileType}`,
  });

  if (target) target.loading = true;

  try {
    const url = secure ? '/upload/secure' : '/upload';

    const res = await axios.post(url, f, {
      headers: { 'X-Requested-With': 'XMLHttpRequest' },
    });

    if (secure) return res.data;

    if (res.data && res.data.repositoryPath) return res.data.repositoryPath;

    return null;
  } catch (err) {
    if (err.response && err.response.status === 413) toast.error(Localize('Error.Upload.413'));
    else toast.error(Localize('Error.UploadingImage') + ' ' + err);

    return null;
  } finally {
    if (target) target.loading = false;
  }
};

// __ Platform ________________________________________________________________

export const getIconPrefix = () => {
  if (Platform.OS === 'ios') return 'ios-';
  if (Platform.OS === 'android') return 'md-';

  return null;
};

export const getOutlineSuffix = focused => {
  if (Platform.OS === 'ios' && !focused) return '-outline';
  return '';
};

export const getClipEllipsis = () => {
  if (Platform.OS === 'ios') return 'clip';

  return 'tail';
};

// __ Date format _____________________________________________________________

function twoDigits(val) {
  if (val < 10) return '0' + val;

  return val.toString();
}

export const getShortMatchDate = dateString => {
  if (!dateString) return '--';

  date = new Date(dateString);

  // We use the UTC versions because the runtime VM in prodcution needs this.
  // In debug, the VM used is Chrome's, so this behaves different. See DYQ-204.
  // https://github.com/expo/expo/issues/782
  const day = date.getUTCDate();
  const month = date.getUTCMonth() + 1;
  const year = date.getUTCFullYear();

  const hours = date.getUTCHours();
  const minutes = date.getUTCMinutes();

  return twoDigits(day) + '.' + twoDigits(month) + ' ' + twoDigits(hours) + ':' + twoDigits(minutes);
};

export const getShortMatchTime = dateString => {
  if (!dateString) return '--';

  date = new Date(dateString);

  // We use the UTC versions because the runtime VM in prodcution needs this.
  // In debug, the VM used is Chrome's, so this behaves different. See DYQ-204.
  // https://github.com/expo/expo/issues/782
  const hours = date.getUTCHours();
  const minutes = date.getUTCMinutes();
  return twoDigits(hours) + ':' + twoDigits(minutes);
};

export const getDateOnlyString = dateString => {
  if (!dateString) return '--';

  date = new Date(dateString);

  return getDateOnlyStringFromDate(date);
};

export const getDateOnlyStringFromDate = date => {
  // We use the UTC versions because the runtime VM in prodcution needs this.
  // In debug, the VM used is Chrome's, so this behaves different. See DYQ-204.
  // https://github.com/expo/expo/issues/782
  const day = date.getUTCDate();
  const month = date.getUTCMonth() + 1;
  const year = date.getUTCFullYear();

  return twoDigits(day) + '.' + twoDigits(month) + '.' + twoDigits(year).slice(-2);
};

export const parseShortDateString = dateString => {
  if (!dateString) return null;

  var ss = dateString.split('.');
  if (ss.length !== 3) return null;

  var day = parseInt(ss[0]);
  var month = parseInt(ss[1]) - 1;
  var year = parseInt(ss[2]);

  return { year, month, day };
};

// __ Awards __________________________________________________________________

const typeImages = {
  1: 'mvp.png',
  2: 'maxscorer.png',
  3: 'dreamteam.png',
};

export const getAwardUri = awardType => {
  return config.reactAppStaticUrl + '/awards/' + typeImages[awardType];
};

// __ Share & snapshots _______________________________________________________

export const getViewSnapshotAsBase64Async = async snapshotRef => {
  if (!snapshotRef) return null;

  const result = await takeSnapshotAsync(snapshotRef, {
    result: 'data-uri',
    quality: 1,
    format: 'png',
  });

  return result;
};

export const shareUriDialog = (uri, title, dialogTitle) => {
  if (!uri) return;

  Share.share(
    {
      type: 'image/png',
      url: uri,
      title: Localize(title),
    },
    {
      dialogTitle: Localize(dialogTitle),
    }
  );
};

// __ Date & Time _____________________________________________________________

export const getFormattedDate = date => {
  return dateFormat(date, Localize('shortDateFormat'));
};

export const getFormattedDateTime = dateTime => {
  return dateFormat(dateTime, Localize('dateTimeFormat'));
};

export const getFormattedTime = time => {
  return dateFormat(time, Localize('timeFormat'));
};

// Loc

export const interpolateString = (str, ...args) => {
  let result = str;
  debugger;
  for (let i = 0; i < args.length; ++i) result = result.replace('{' + i + '}', args[i]);

  return result;
};

export const interpolateStringMultiple = (str, ...args) => {
  let result = str;
  for (let i = 0; i < args.length; ++i) result = result.replaceAll('{' + i + '}', args[i]);

  return result;
};
