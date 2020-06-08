import { observable, decorate } from "mobx";
import OrganizationStore from './OrganizationStore';
import PlayersStore from "./PlayersStore";
import TeamsStore from "./TeamsStore";
import StagesStore from "./StagesStore";
import StageGroupsStore from "./StageGroupsStore";
import TeamGroupsStore from "./TeamGroupsStore";
import MatchesStore from "./MatchesStore";
import TournamentStore from "./TournamentsStore";
import FacilitiesStore from "./FacilitiesStore";
import RefereesStore from "./RefereesStore";

class Store {
    organization = new OrganizationStore(this);
    players = new PlayersStore(this);
    tournaments = new TournamentStore(this);
    facilities = new FacilitiesStore(this);

    // Tournament stores
    teams = new TeamsStore(this);
    stages = new StagesStore(this);
    groups = new StageGroupsStore(this);
    teamGroups = new TeamGroupsStore(this);
    players = new PlayersStore(this);
    matches = new MatchesStore(this);
    referees = new RefereesStore(this);
}

export default new Store();

decorate(Store, {
    organization: observable, 
    players: observable, 
    tournaments: observable, 
    facilities: observable, 

    teams: observable, 
    stages: observable, 
    groups: observable, 
    teamGroups: observable, 
    players: observable, 
    matches: observable, 
    referees: observable
});