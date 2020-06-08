import React, { Component } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import SectionHead from '../../components/common/SectionHead';
import { headerNavigationOptions } from './Headers';

class News extends Component {
    
    static navigationOptions = headerNavigationOptions;

    render() {
        return (
            <View style={style.View}>
                <SectionHead title='News' />
            </View>
        )
    }
}

const style = StyleSheet.create({
    View: {
        flex: 1
    }
});

export default News;