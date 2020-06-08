import { observable, decorate } from "mobx";
import { createCrudActions } from "./CrudActions";


export default class FacilitiesStore {
    
    loading = false;
    error = null;
    all = null;
    current = null;

    rootStore = null;

    constructor(rootStore) {
        this.rootStore = rootStore;
        this.actions = createCrudActions(this, '/fields');
    }
}


decorate(FacilitiesStore, {
    loading: observable, 
    error: observable, 
    all: observable, 
    current: observable
});