import { ThemeMode, useThemeMode } from '@rneui/themed';
import { observable, makeObservable, action, computed } from 'mobx';
import { Appearance } from 'react-native';

import client from '../feathers-client';
import { AppRootStore } from './AppRootStore';

export class AppStateObserver {
    appRootStore: AppRootStore;
    isConnected: boolean = false;
    isLoaded: boolean = false;
    colorMode: ThemeMode = 'light';

    constructor(appRootStore: AppRootStore) {
        makeObservable(this, {
            isLoaded: observable,
            setIsLoaded: action,
            isConnected: observable,
            setConnected: action,
            colorMode: observable,
            setColorMode: action
        });

        this.appRootStore = appRootStore;

        this.init();
    }

    init() {
        console.log('init AppStateObserver');
        // determine color mode
        const mode = localStorage.getItem('colorMode');
        if (mode !== null) {
            this.setColorMode(mode as ThemeMode);
        } else {
            const colorMode = Appearance.getColorScheme();
            if (colorMode === 'dark') {
                this.setColorMode('dark');
            } else if (colorMode === 'light') {
                this.setColorMode('light');
            } else {
                this.setColorMode('dark');
            }
        }

        setTimeout(() => {
            this.setIsLoaded(true);
        }, 500);
    }

    setConnected(b: boolean) {
        this.isConnected = b;
    }

    setColorMode(mode: ThemeMode) {
        this.colorMode = mode;
        client.authentication.storage.setItem?.('colorMode', this.colorMode);
    }

    setIsLoaded(isLoaded: boolean) {
        this.isLoaded = isLoaded;
    }
}
