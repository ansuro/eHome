import { observable, makeObservable, action, computed } from 'mobx';
import { IDevice } from '../../components/devices/DeviceTypes';
import client from '../feathers-client';
import { Device, Group, User } from 'ehome-backend';
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
            setDevices: action,
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

    private mapDeviceStates(states: any[] | undefined) {
        return states?.map(state => {
            const options = state.options ? JSON.parse(state.options) : undefined;
            return {
                ...state,
                options: options
            }
        });
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

        // === Device Events ===
        // TODO new device event
        client.service('devices').on('created', action((device: Device) => {
            console.log('Device created:', device);
            const newDevices = [...this.devices, {
                name: device.name,
                MAC: device.MAC,
                states: this.mapDeviceStates(device.states),
                online: device.isOnline
            }];
            this.setDevices(newDevices);
        }));

        // device updated event: name or isOnline changed
        client.service('devices').on('patched', action((device: Device) => {
            console.log('Device updated:', device);
            const updatedDevices = this.devices.map(d => 
                d.MAC === device.MAC 
                    ? { ...d, name: device.name, online: device.isOnline }
                    : d
            );
            this.setDevices(updatedDevices);
        }));

        // device removed event
        client.service('devices').on('removed', action((device: Device) => {
            console.log('Device removed:', device);
            const filteredDevices = this.devices.filter(d => d.MAC !== device.MAC);
            this.setDevices(filteredDevices);
        }));
    }

    setDevices(devices: IDevice[]) {
        this.devices = devices;
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
            this.setGroups(g);
            this.setIsLoaded(true);
        })).catch(action('fetchError', e => {
            console.log(e);
        }));
        
        client.service('devices').find({
            paginate: false,
            query: {
                $paginate: false
            }
        }).then(action('fetchSuccess', devices => {
            console.log("Devices from backend: %o", devices);
            const mappedDevices = devices.map((d: Device) => ({
                name: d.name,
                MAC: d.MAC,
                states: this.mapDeviceStates(d.states),
                online: d.isOnline
            }));
            this.setDevices(mappedDevices);
            this.setIsLoaded(true);
        })).catch(action('fetchError', e => {
            console.log(e);
        }));
        // console.log('reloadGroups called: ' + this.devices.length);
        console.log('reloadGroups called: ' + this.devices);
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
