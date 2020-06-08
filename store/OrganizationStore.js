import axios from '../axios'
import { flow, decorate } from 'mobx';
import { observable } from 'mobx';
import { request } from '../components/Utils';
import UiStore from './UiStore';
import { createCrudActions } from './CrudActions';

export const setOrganizationHeader = (store, navigation) => {
    const org = store.organization.current;
    if (org) navigation.setParams({title: org.name});
}


export default class OrganizationStore {
    current = { name: ''};
    loading = false;
    error = null;
    tournamentModes = { all: null, loading: false, error: null };
    categories = { all: null, loading: false, error: null };
    seasons = { all: null, loading: false, error: null };

    rootStore = null;

    constructor(rootStore) {
        this.rootStore = rootStore;
        this.actions = createCrudActions(this, '/organization');
        this.seasons.actions = createCrudActions(this.seasons, '/seasons');
        this.tournamentModes.actions = createCrudActions(this.tournamentModes, '/tournamentmodes');
        this.categories.actions = createCrudActions(this.categories, '/categories');
    }

    fetch = flow( function *() {
        const res = yield request(this, axios.get, null, '/organization');
        if (!res) {
            // No org is available, can't do anything. Logout. 
            UiStore.auth.logout();
            return;
        }

        this.current = res;
        this.tournamentModes.all = res.modes;
        this.seasons.all = res.seasons;
        this.categories.all = res.categories;

        return res;
    })


    getCurrentSeasons = () => {
        const ss = this.seasons.all;
        if (!ss) return null;

        const now = new Date();
        return ss.filter(s => s.startDate <= now && now <= s.endDate);
    }
}



decorate(OrganizationStore, {
    current: observable,
    loading: observable, 
    error: observable, 
    tournamentModes: observable,
    categories: observable,
    seasons: observable,
});