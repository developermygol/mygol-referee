import { observable, flow, decorate } from 'mobx';
import { requestAsync, toast } from '../components/Utils';
import { uploadImage } from '../components/Utils';
import axios from '../axios';


const PlayerAvatarType = 200;


class RefereesStore {
    owner = null;
    loading = false;
    error = null;

    rootStore = null;

    constructor(rootStore) {
        this.rootStore = rootStore;
    }

    setOwner = (referee) => {
        this.owner = referee;
    }

    get = flow ( function *(idUser) {
        const result = yield requestAsync(this, axios.get, null, '/referees/' + idUser);
        if (!result) return null;

        this.owner = result;
    })

    getDetails = flow( function *() {
        const result = yield requestAsync(this, axios.get, null, '/referees/details');
        if (!result) return;

        //console.log(result);

        this.owner = result.referee;
        this.rootStore.matches.setAllMatches(result.matches);
    })    

    updatePersonalData = flow( function *(data, image) {
        let res1 = null;
        if (!this.owner) {
            toast.error("Error.NoOwnerData");
            return;
        }

        const idUser = this.owner.id;

        if (image) {
            res1 = yield uploadImage(this, image, idUser, PlayerAvatarType, false);
            if (!res1) return null;

            this.owner.avatarImgUrl = res1;
        }

        userData = { ...data, avatarImgUrl: res1 };
        const result = yield requestAsync(this, axios.put, null, '/referees', userData);

        return result;
    })




}

export default RefereesStore;

decorate(RefereesStore, {
    owner: observable,
    loading: observable, 
    error: observable, 
});