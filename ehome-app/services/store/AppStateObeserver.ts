import { ThemeMode, useTheme } from '@rneui/themed';
import { observable, makeObservable, action, computed } from 'mobx';
import { Appearance } from 'react-native';
import { AuthenticationResult } from '@feathersjs/authentication';

// TODO login logik
// import client from './fapp';
import client from '../feathers-client';
import { User } from 'ehome-backend';
import { UserStateObserver } from './UserStateObserver';
import { GroupsObserver } from './GroupsObserver';

export class AppStateObserver {
    connected: boolean = false;
    loggedIn: boolean = false;
    isLoaded: boolean = false;
    colorMode: ThemeMode = 'light';
    user: User | undefined = undefined;

    /**
     * userStateObserver
     */
    userState: UserStateObserver = new UserStateObserver();
    groupsObserver: GroupsObserver;

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

        // TODO conditional admin only
        this.groupsObserver = new GroupsObserver();
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
        client.reAuthenticate(true, 'jwt').then(authResult => {
            console.log('reauth: ' + JSON.stringify(authResult));
            this.login(authResult);
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

    login(authResult: AuthenticationResult) {
        this.loggedIn = true;
        this.user = authResult.user;
    }

    logout() {
        this.loggedIn = false;
        this.user = undefined;
    }

    setColorMode(mode: ThemeMode) {
        this.colorMode = mode;
        client.authentication.storage.setItem?.('colorMode', this.colorMode);
    }

    setIsLoaded(isLoaded: boolean) {
        this.isLoaded = isLoaded;
    }
}

// export const appState = new AppStateObserver();