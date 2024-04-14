import { ThemeMode } from '@rneui/themed';
import { observable, makeObservable, action, computed } from 'mobx';
import { Appearance } from 'react-native';

// TODO login logik
// import client from './fapp';
import client from '../feathers-client';

class AppStateObserver {
    connected: boolean = false;
    loggedIn: boolean = false;
    isLoaded: boolean = false;
    colorMode: ThemeMode = 'light';

    constructor() {
        makeObservable(this, {
            connected: observable,
            loggedIn: observable,
            isLoaded: observable,
            colorMode: observable,
            login: action,
            logout: action,
            setConnected: action,
            setColorMode: action,
            setIsLoaded: action
        });
        this.init();
    }

    init() {
        console.log('init');
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

        // login, if jwt is present
        client.reAuthenticate(false, 'jwt').then(l => {
            console.log('reauth: ' + l);
            this.login();
        }).catch(e => {
            console.log('reauth failed: ' + e);
            this.logout();
        });

        setTimeout(() => {
            this.setIsLoaded(true);
        }, 500);
    }

    setConnected(b: boolean) {
        this.connected = b;
    }

    logout() {
        this.loggedIn = false;
    }

    login() {
        this.loggedIn = true;
    }

    setColorMode(mode: ThemeMode) {
        this.colorMode = mode;
        localStorage.setItem('colorMode', this.colorMode);
    }

    setIsLoaded(isLoaded: boolean) {
        this.isLoaded = isLoaded;
    }
}

export const appState = new AppStateObserver();