import { observable, decorate } from "mobx";

import AuthStore from "./AuthStore";


class UiStore {
    auth = new AuthStore();
}

export default new UiStore();

decorate(UiStore, {
    auth: observable
});