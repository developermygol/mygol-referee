import React, { Component } from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { getUploadsIcon } from '../../components/Utils';
import GlobalStyles, { gColors, GS } from '../../GlobalStyles';

class PlayerAndTeam extends Component {

    render() {
        const p = this.props;

        const {team, player} = p;
        const playerImg = player && getUploadsIcon(player.idPhotoImgUrl, player.id, 'user');
        const teamImg = team && getUploadsIcon(team.logoImgUrl, team.id, 'team');

        return (
            <View style={[style.View, p.style]}>
                <View style={style.Logos}>
                    {player && (
                        <View style={style.TeamPlayerImages}>
                            <View style={style.TeamWrapper}>
                                {team && <Image source={{uri: teamImg}} style={style.TeamImg} />}
                            </View>
                            <View style={style.PlayerWrapper}>
                                <Image source={{uri: playerImg}} style={style.PlayerImg} />
                            </View>
                            <View style={[GlobalStyles.ApparelNumberWrapper, style.ApparelNumber]}>
                                <Text style={GlobalStyles.ApparelNumber}>{player.teamData && player.teamData.apparelNumber}</Text>
                            </View>
                        </View>
                    )}
                </View>
                <View style={style.Details}>
                    {player && <Text style={style.PlayerName}>{player.name + ' ' + player.surname}</Text>}
                    {team && <Text style={style.TeamName}>{team.name}</Text>}
                </View>
            </View>
        )
    }
}

const style = StyleSheet.create({
    View: {
        alignItems: 'stretch'
    }, 
    Logos: {
        flexDirection: 'row', 
        justifyContent: 'space-around'
    },
    PlayerWrapper: {
        width: 160, 
        height: 160,
        overflow: 'hidden', 
        borderRadius: 80,
        borderColor: gColors.logoBorder,
        backgroundColor: gColors.logoBackground,
        borderWidth: 2, 
    },
    PlayerImg: {
        flex: 1,
        resizeMode: 'contain',
    }, 
    TeamWrapper: {
        position: 'absolute',
        width: 120, 
        height: 120, 
        left: -80, 
        top: 40
    },
    TeamImg: {
        flex: 1,
        resizeMode: 'contain'
    }, 
    ApparelNumber: {
        position: 'absolute',
        left: 130, 
        top: 110,
        width: 50, 
        height: 50, 
        fontSize: 22, 
        borderRadius: 25
    },
    Details: {
        marginTop: 10
    },
    PlayerName: {
        textAlign: 'center',
        ...GS.font.title2,
        marginBottom: 7
    },
    TeamName: {
        textAlign: 'center',
        ...GS.font.touchable
    }
});

export default PlayerAndTeam;