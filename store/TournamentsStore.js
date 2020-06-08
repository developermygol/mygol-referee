import axios from '../axios'
import { observable, flow, action, decorate } from 'mobx';
import { createCrudActions } from './CrudActions';
import { getOpErrorText } from '../components/Utils';
import { normalize } from '../components/Data';
import { requestAsync } from '../components/Utils';

export default class TournamentStore {
    current = null;
    all = null;
    loading = false;
    error = null;
    calendar = null;

    rootStore = null;

    constructor(rootStore) {
        this.rootStore = rootStore;
        this.actions = createCrudActions(this, '/tournaments');
    }

    reset = () => {
        this.current = null;

        const rs = this.rootStore;
        rs.teams.all = null;
        rs.teams.normal = null;
        rs.stages.all = null;
        rs.groups.all = null;
        rs.teamGroups.all= null;
    }

    setCurrent = flow( function *(id) {
        try {
            const rs = this.rootStore;
            
            this.reset();
            const result = yield this.getSingle(id);
            this.current = result;
            
            // set tournament related stores to new
            
            rs.teams.all = result.teams;
            rs.teams.normal = normalize(result.teams);
            rs.stages.all = result.stages;
            rs.groups.all = result.groups;
            rs.teamGroups.all= result.teamGroups;

            // Clear the rest
            rs.players.all = null;
            rs.matches.all = null;
        
        } catch (err) {
            
        }
    })

    getSingle = flow( function *(id) {
        return yield requestAsync(this, axios.get, null, '/tournaments/' + id);
    })

    getCalendar = flow( function *(id) {
        try 
        {
            this.loading = true;
            const result = yield axios.get('/matches/fortournament/' + id);
            this.loading = false;
            return result;
        } catch (err) {
            toast.error(getOpErrorText(err));
            this.loading = false;
            return null;
        }
    })
}


decorate(TournamentStore, {
    current: observable, 
    all: observable, 
    loading: observable, 
    error: observable, 
    calendar: observable, 
    reset: action
});