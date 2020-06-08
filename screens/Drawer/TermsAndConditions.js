import React, { Component } from 'react';
import { View, Text, StyleSheet, ScrollView, StatusBar } from 'react-native';
import { Localize } from '../../components/locale/Loc';
import { termsText } from './Terms';
import GlobalStyles, { gMetrics } from '../../GlobalStyles';
import { inject, observer } from 'mobx-react/native';
import { headerNavigationOptions } from '../Home/Header';

class TermsAndConditions extends Component {

    static navigationOptions = (p) => {
        const headerOpts = headerNavigationOptions(p);
        return {
            ...headerOpts, 
            title: Localize('TermsScreenTitle')
        }
    }

    
    componentDidMount = () => {
        this.loadData();
    }

    loadData = () => {
        // Set org name
        const p = this.props;
        const org = p.store.organization.current;
        if (org) p.navigation.setParams({title: org.name});        
    }

    render() {
        return (
            <ScrollView style={style.View}>
                <StatusBar barStyle='light-content' />
                <View style={[style.ContentView]}>
                    <Text style={style.terms}>{termsText}</Text>
                </View>
                <View style={style.VersionView}>
                    <Text style={style.VersionText}>v{Expo.Constants.manifest.version}</Text>
                </View>
            </ScrollView>
        )
    }
}

const style = StyleSheet.create({
    View: {
        flex: 1, 
        padding: gMetrics.screenPadding
    },
    ContentView: {
        paddingBottom: 50
    },
    VersionView: {
        margin: 30,
    },
    VersionText: {
        color: '#AAA',
        fontSize: 10,
        textAlign: 'center'
    }
});

export default inject('store')(observer(TermsAndConditions));