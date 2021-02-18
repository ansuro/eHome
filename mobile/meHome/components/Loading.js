import React from 'react';
import { View } from 'react-native';
import { Spinner, Text } from '@ui-kitten/components';

export const Loading = (props) => (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: 'transparent' }}>
        {props.msg ? <Text>{props.msg}</Text> : null}
        <Spinner />
    </View>
);
