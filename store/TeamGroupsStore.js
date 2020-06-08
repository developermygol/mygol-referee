import { observable, decorate } from "mobx";
import { createCrudActions } from "./CrudActions";


export default class TeamGroupsStore {
    
    loading = false;
    error = null;
    all = null;

    rootStore = null;

    constructor(rootStore) {
        this.rootStore = rootStore;
        this.actions = createCrudActions(this, '/teamgroups');
    }
}

decorate(TeamGroupsStore, {
    loading: observable, 
    error: observable, 
    all: observable, 
});