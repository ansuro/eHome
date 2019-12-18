import React from 'react';
import { ProgressSpinner } from 'primereact/progressspinner';
import './Spinner.css';

export function AppSpinnerSmall() {
    return (
        <ProgressSpinner />
    );
}

export function AppSpinnerCenter() {
    return (
        <div style={{'display': 'flex', 'margin': 'auto', 'alignItems': 'center', 'justifyContent': 'center'}}>
            <ProgressSpinner style={{'maxWidth': '50%'}} />
        </div>
    );
}

export function AppSpinner() {
    return (
        <div className="centercontainer">
            <div className="centeritem">
                <ProgressSpinner />
            </div>
        </div>
    );
}