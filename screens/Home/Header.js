import React from 'react';
import { TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { getIconPrefix } from '../../components/Utils';
import { gColors } from '../../GlobalStyles';

export const headerNavigationOptions = ({ navigation, navigationOptions, screenProps }) => {
    return {
        headerLeft: (
            <TouchableOpacity onPress={() => navigation.toggleDrawer() }>
                <Ionicons name={getIconPrefix() + 'menu'} size={25} color={gColors.headerTint} style={{marginLeft: 10}} />
            </TouchableOpacity>
        )
    }
};