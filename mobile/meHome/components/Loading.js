import React from 'react';
import { View } from 'react-native';
import { Spinner } from '@ui-kitten/components';

export const Loading = () => (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Spinner />
    </View>
);
