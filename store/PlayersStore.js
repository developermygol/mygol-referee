import { observable, flow, action, toJS, decorate } from 'mobx';
import { requestAsync, toast } from '../components/Utils';
import { updateByIdInArray, updateOrInsertInArray, findByIdInArray } from '../components/Data';
import axios from '../axios';
import { Localize } from '../components/locale/Loc';


class PlayersStore {
    current = null;
    all = null;
    loading = false;
    error = null;

    rootStore = null;

    constructor(rootStore) {
        this.rootStore = rootStore;
    }

    setCurrent = (player) => {
        this.current = player;
    }
}

export default PlayersStore;

decorate(PlayersStore, {
    current: observable,
    all: observable, 
    loading: observable, 
    error: observable, 
});