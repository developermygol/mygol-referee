import { observable, decorate } from "mobx";
import { createCrudActions } from "./CrudActions";


export default class StageGroupsStore {
    
    loading = false;
    error = null;
    all = null;

    rootStore = null;

    constructor(rootStore) {
        this.rootStore = rootStore;
        this.actions = createCrudActions(this, '/groups');
    }

    forStage = (idStage) => {
        return this.all.filter(g => g.idStage === idStage);
    }
}

decorate(StageGroupsStore, {
    loading: observable, 
    error: observable, 
    all: observable, 
});