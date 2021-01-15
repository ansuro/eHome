import React, { Component } from 'react';

import { TopNavigation } from '@ui-kitten/components';

import client from './_helpers/fapp';

export default class TopNav extends Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
// connect, Verbindungsstatus anzeigen
    }

    render() {
        return (
            <TopNavigation />
        );
    }
}