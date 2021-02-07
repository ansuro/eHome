import React from 'react';
import { Layout, Spinner } from '@ui-kitten/components';

export const Loading = () => (
    <Layout level='1' style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
        <Spinner />
    </Layout>
);
