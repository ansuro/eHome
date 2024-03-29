import { ThemeMode } from '@rneui/themed';
import { observable, makeObservable, action, computed } from 'mobx';
import { Appearance } from 'react-native';

// TODO login logik
// import client from './fapp';

class AppStateObserver {
    connected: boolean = false;
    loggedIn: boolean = true;
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