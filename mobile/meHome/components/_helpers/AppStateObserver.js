import { observable, makeObservable, action, computed } from 'mobx';

// TODO login logik
import client from './fapp';

class AppStateObserver {
    connected = false;
    loggedIn = null;

    constructor() {
        makeObservable(this, {
            connected: observable,
            loggedIn: observable,
            login: action,
            logout: action,
            setConnected: action
        });
    }

    setConnected(b) {
        this.connected = b;
    }

    logout() {
        this.loggedIn = false;
    }

    login() {
        this.loggedIn = true;
    }
}

export const appState = new AppStateObserver();