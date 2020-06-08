import { observable, decorate } from "mobx";
import { createCrudActions } from "./CrudActions";


export default class StagesStore {
    
    loading = false;
    error = null;
    all = null;

    rootStore = null;

    constructor(rootStore) {
        this.rootStore = rootStore;
        this.actions = createCrudActions(this, '/stages');
    }

    // setActive = asyncAction(function *(stage) {
        
    // })
}

decorate(StagesStore, {
    loading: observable, 
    error: observable, 
    all: observable, 
});