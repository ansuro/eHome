import { observable, makeObservable, action, computed } from 'mobx';
import { IDevice } from '../../components/devices/DeviceTypes';
import client from '../feathers-client';
import { DeviceData, Group, User } from 'ehome-backend';
import { AppRootStore } from './AppRootStore';

export class UserStateObserver {
    appRootStore: AppRootStore;
    isLoaded: boolean = false;
    devices: IDevice[] = [];
    groups: Group[] = [];
    selectedGroup?: Group;
    user?: User;
    isLoggedIn: boolean = false;

    constructor(appRootStore: AppRootStore) {
        makeObservable(this, {
            isLoaded: observable,
            setIsLoaded: action,
            devices: observable,
            setGroups: action,
            groups: observable,
            setSelectedGroup: action,
            user: observable,
            login: action,
            logout: action,
            isLoggedIn: observable,
            isAdmin: computed
        });

        this.appRootStore = appRootStore;

        this.init();
    }

    private init() {
        console.log('init UserStateObserver');

        client.on('login', (authenticationResult, params, context) => {
            console.log('Logged in event');
            this.login(authenticationResult.user);
            this.reloadGroups();
        });
        
        client.on('logout', (authenticationResult, params, context) => {
            console.log('Logged out event');
            this.logout();
        });
    }

    private reloadGroups() {
        this.setIsLoaded(false);
        client.service('groups').find({
            paginate: false,
            query: {
                $paginate: false,
                findAll: true
            }
        }).then(action('fetchSuccess', g => {
            // this.setGroups(g);
            // this.setIsLoaded(true);
            this.groups = g;
            this.isLoaded = true;
            this.setIsLoaded(true);
        })).catch(action('fetchError', e => {
            console.log(e);
        }));
        
        client.service('devices').find({
            paginate: false
        }).then(action('fetchSuccess', devices => {
            // this.setGroups(g);
            // this.setIsLoaded(true);
            this.devices = devices.map((d: DeviceData) => {
                return {
                    name: d.name,
                    MAC: d.MAC,
                    states: [],
                    online: d.isOnline
                } as IDevice;
            });
            this.isLoaded = true;
        })).catch(action('fetchError', e => {
            console.log(e);
        }));
    }

    setSelectedGroup(group?: Group) {
        this.selectedGroup = group;
    }

    setGroups(groups: Group[]) {
        this.groups = groups;
    }

    setIsLoaded(isLoaded: boolean) {
        this.isLoaded = isLoaded;
    }

    login(user: User) {
        this.user = user;
        this.isLoggedIn = true;
    }

    logout() {
        delete this.user;
        this.isLoggedIn = false;
    }

    get isAdmin() {
        return this.user?.isAdmin;
    }
}
