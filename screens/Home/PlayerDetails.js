import React, { Component } from 'react';
import { ScrollView, View, Text, StyleSheet, StatusBar } from 'react-native';
import GlobalStyles, { GS, gColors } from '../../GlobalStyles';
import PlayerData from './PlayerData';
import Awards from './Awards';
import PlayerStats from './PlayerStats';
import PlayerActions from './PlayerActions';
import { inject, observer } from 'mobx-react/native';
import FsSpinner from '../../components/common/FsSpinner';
import { setOrganizationHeader } from '../../store/OrganizationStore';
import TeamDataDetailed from './TeamDataDetailed';
import { headerNavigationOptions } from './Header';



class PlayerDetails extends Component {

    static navigationOptions = headerNavigationOptions;

    componentDidMount = () => {
        this.loadData();

        setOrganizationHeader(this.props.store, this.props.navigation);
    }

    componentDidUpdate = () => {
        this.loadData();
    }


    loadData = async () => {
        const p = this.props;

        let idUser = p.navigation.getParam('idUser');

        if (!idUser) {
            return;    // Render the owner that is already loaded.
        }

        // if (!idUser) {
        //     idUser = await AsyncStorage.getItem('auth.id');
        //     navigationOptions = null;
        // }

        const { current } = p.store.players;
        if (current && current.idUser === idUser) return;

        if (this.idUser === idUser) return;
        
        this.idUser = idUser;
        await p.store.players.getUser(idUser);
    }
    

    render() {
        const p = this.props;
        
        const player = (!p.navigation.getParam('idUser')) ? p.store.players.owner : p.store.players.current;
    
        if (!player) return <FsSpinner lMsg='Loading player data' />

        const isOwner = (p.ui.auth.idUser === player.idUser);

        return (
            <ScrollView style={{backgroundColor: gColors.headerBack}}>
                <StatusBar barStyle='light-content' />
                <View style={GlobalStyles.MainViewCenter}>
                    <PlayerData style={style.PlayerData} data={player} age motto />
                    <View style={style.TeamData}>
                        <TeamDataDetailed data={player.teamData} />
                    </View>
                    <Awards data={player} />
                    <PlayerStats data={player} />
                    <PlayerActions data={player} navigation={p.navigation} isOwner={isOwner} />
                    {/* {isOwner ? <News /> : null } */}
                </View>
            </ScrollView>
        )
    }
}

const style = StyleSheet.create({
    View: {
        
    },
    TeamData: {
        marginVertical: 20,
    },
    PlayerData: {
        paddingTop: 10,
        paddingBottom: 0
    }
});

export default inject('store', 'ui')(observer(PlayerDetails));