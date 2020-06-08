import axios, { setAxiosEndPoints, directoryEndPoint } from "../axios";
import { flow, observable, action, decorate } from "mobx";
import { AsyncStorage } from "react-native";
import { requestAsync } from "../components/Utils";

const initAxios = (token) => {
  //const authToken = await AsyncStorage.getItem('auth.token');
  //if (!authToken) return;

  axios.defaults.headers.common["Authorization"] = "Bearer " + token;
};

const clearAxios = () => {
  axios.defaults.headers.common["Authorization"] = null;
};

const saveAuthData = async (authData) => {
  await AsyncStorage.setItem("auth.token", authData.token);
  await AsyncStorage.setItem("auth.name", authData.name);
  await AsyncStorage.setItem("auth.email", authData.email);
  await AsyncStorage.setItem("auth.id", authData.id.toString());
  await AsyncStorage.setItem("auth.level", authData.level.toString());
  await AsyncStorage.setItem("auth.avatarImgUrl", authData.avatarImgUrl || "");

  initAxios(authData.token);
};

const clearAuthData = async () => {
  await AsyncStorage.removeItem("auth.token");
  await AsyncStorage.removeItem("auth.name");
  await AsyncStorage.removeItem("auth.email");
  await AsyncStorage.removeItem("auth.level");
  await AsyncStorage.removeItem("auth.id");
  await AsyncStorage.removeItem("auth.avatarImgUrl");

  await AsyncStorage.removeItem("endpoint.api");
  await AsyncStorage.removeItem("endpoint.prStatic");
  await AsyncStorage.removeItem("endpoint.uploads");

  clearAxios();
};

const saveEndPoints = async (endPoints) => {
  if (!endPoints) throw "No endpoints";

  await AsyncStorage.setItem("endpoint.api", endPoints.api);
  await AsyncStorage.setItem("endpoint.prStatic", endPoints.prStatic);
  await AsyncStorage.setItem("endpoint.uploads", endPoints.uploads);

  setAxiosEndPoints(endPoints);
};

class AuthStore {
  token = null;
  email = null;
  name = null;
  idUser = null;
  level = null;
  avatarImgUrl = null;

  returnUrl = null;
  error = null;
  loading = false;

  hydrate = flow(function* () {
    this.token = yield AsyncStorage.getItem("auth.token");
    this.email = yield AsyncStorage.getItem("auth.email");
    this.name = yield AsyncStorage.getItem("auth.name");
    this.idUser = parseInt(yield AsyncStorage.getItem("auth.id"), 10);
    this.level = parseInt(yield AsyncStorage.getItem("auth.level"), 10);
    this.avatarImgUrl = yield AsyncStorage.getItem("auth.avatarImgUrl");

    const endPoints = {
      api: yield AsyncStorage.getItem("endpoint.api"),
      prStatic: yield AsyncStorage.getItem("endpoint.prStatic"),
      uploads: yield AsyncStorage.getItem("endpoint.uploads"),
    };

    if (!endPoints.api) {
      yield clearAuthData(); // No endpoints, get to login
      return;
    }

    initAxios(this.token);

    setAxiosEndPoints(endPoints);
  });

  basicLogin = flow(function* (formLoginDetails) {
    try {
      this.loading = true;
      const result = yield requestAsync(
        this,
        directoryEndPoint.post,
        null,
        "/users/basiclogin",
        formLoginDetails
      );
      yield AsyncStorage.setItem("auth.email", formLoginDetails.email);

      if (result) {
        yield saveEndPoints(result.endPoints);
        yield AsyncStorage.setItem("auth.id", result.idUser.toString());
        this.idUser = result.idUser;
      }

      this.loading = false;

      return result;
    } catch (err) {
      this.error = err;
      this.loading = false;
      return null;
    }
  });

  login = flow(function* (formLoginDetails) {
    try {
      this.loading = true;
      const res = yield axios.post("/users/login", formLoginDetails);
      const authData = res.data;

      if (authData.level !== 2) throw "Error.Login.NotReferee";

      yield saveAuthData(authData);

      this.token = authData.token;
      this.email = authData.email;
      this.name = authData.name;
      this.level = authData.level;
      this.avatarImgUrl = authData.avatarImgUrl;
      this.idUser = authData.id;
      this.returnUrl = null;
      this.error = null;
      this.loading = false;

      return authData;
    } catch (err) {
      this.error = err;
      this.loading = false;
      return null;
    }
  });

  loginPin = flow(function* (formLoginDetails) {
    try {
      this.loading = true;
      const res = yield axios.post("/users/pinlogin", formLoginDetails);
      const authData = res.data;

      if (authData.level !== 2) throw "Error.Login.NotReferee";

      yield saveAuthData(authData);

      this.token = authData.token;
      this.email = authData.email;
      this.name = authData.name;
      this.level = authData.level;
      this.avatarImgUrl = authData.avatarImgUrl;
      this.idUser = authData.id;
      this.returnUrl = null;
      this.error = null;
      this.loading = false;

      return authData;
    } catch (err) {
      this.error = err;
      this.loading = false;
    }
  });

  logout = flow(function* () {
    this.token = null;
    this.email = null;
    this.name = null;
    this.level = null;
    this.avatarImgUrl = null;
    this.returnUrl = null;
    this.error = null;

    yield clearAuthData();
  });
}

export default AuthStore;

decorate(AuthStore, {
  token: observable,
  email: observable,
  name: observable,
  idUser: observable,
  level: observable,
  avatarImgUrl: observable,
  returnUrl: observable,
  error: observable,
  loading: observable,
});
