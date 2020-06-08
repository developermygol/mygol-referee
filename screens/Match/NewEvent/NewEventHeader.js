import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { GS } from '../../../GlobalStyles';
import Loc from '../../../components/locale/Loc';

export default NewEventHeader = ({ title, subTitle}) => {
    return (
        <View style={style.TitleWrapper}>
            <Text style={style.Title}><Loc>{title}</Loc></Text>
            {subTitle ? <Text style={style.SubTitle}><Loc>{subTitle}</Loc></Text> : null}
        </View>
    )
}


const style = StyleSheet.create({
    TitleWrapper: {
        flex: 1,
        justifyContent: 'space-around',
    },
    Title: {
        ...GS.font.headTitle1,
        textAlign: 'center',
        textAlignVertical: 'center',

        alignSelf: 'stretch'
    },
    SubTitle: {
    },
});