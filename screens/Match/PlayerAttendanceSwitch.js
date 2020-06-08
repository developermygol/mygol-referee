import React, { Component } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import SpinnerButton from '../../components/common/SpinnerButton';
import Loc from '../../components/locale/Loc';
import { gColors } from '../../GlobalStyles';
import { observer } from 'mobx-react/native';

class PlayerAttendanceSwitch extends Component {

    render() {
        const p = this.props;

        return (
            <View style={[style.View, p.style]}>
                <Text style={style.Title}><Loc>Player.Attendance</Loc></Text>
                {p.value ? 
                    <Text style={[style.Value, style.True]}><Loc>Player.Attends.True</Loc></Text>
                    :
                    <Text style={[style.Value, style.False]}><Loc>Player.Attends.False</Loc></Text>
                }
                <SpinnerButton style={style.Button} loading={p.loading} onPress={() => p.onChange(!p.value)} title={'Player.Attendance.Change'} />
            </View>
        )
    }
}

const style = StyleSheet.create({
    View: {
        padding: 20,
        borderTopWidth: 1,
        borderTopColor: gColors.text2
    },
    Title: {
        textAlign: 'center', 
        color: gColors.text2, 
        marginBottom: 5
    }, 
    Value: {
        textAlign: 'center', 
        color: gColors.text1, 
        fontSize: 20
    },
    True: {
        color: gColors.green
    },
    False: {
        color: gColors.red
    }
});

export default observer(PlayerAttendanceSwitch);