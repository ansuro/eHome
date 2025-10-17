import { observable, makeObservable, action, computed } from 'mobx';
import { DeviceState, IDevice, IState, IStateOnOff, IStateOnOffOptions, IStateValueOnly } from '../../components/devices/DeviceTypes';
import client from '../feathers-client';
import { Device, Group, State, User } from 'ehome-backend';
import { AppRootStore } from './AppRootStore';

export class UserStateObserver {
    appRootStore: AppRootStore;
    isLoaded: boolean = false;
    devices: IDevice[] = [];
    states: DeviceState[] = [];
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
            isAdmin: computed,
            states: observable,
            setStates: action
        });

        this.appRootStore = appRootStore;

        this.init();
    }

    private isIOnOffOptions(state: any): state is IStateOnOffOptions {
        return 'options' in state;
    }

    // Type-Guard für zusätzliche Sicherheit
    private isValidDeviceState(state: any): state is DeviceState {
        return (
            typeof state.name === 'string' &&
            typeof state.MAC === 'string' &&
            typeof state.type === 'number' &&
            'value' in state
        );
    }

    private mapDeviceStates(states: any[]): DeviceState[] {
        if (!states) return [];
        
        return states
            .filter(state => {
                if (!this.isValidDeviceState(state)) {
                    console.warn('Ungültiger State ignoriert:', state);
                    return false;
                }
                return true;
            })
            .map(state => {
                const baseState: IState = {
                    name: state.name,
                    MAC: state.MAC,
                    type: state.type,
                    value: state.value,
                    options: state.options
                };

                switch (state.type) {
                    case 0: // OnOff
                        return {
                            ...baseState,
                            value: typeof state.value === 'string' 
                                ? state.value === 'true'
                                : Boolean(state.value),
                            options: undefined
                        } as IStateOnOff;
                    
                    case 1: // OnOffOptions
                        return {
                            ...baseState,
                            value: String(state.value),
                            // TODO auf String prüfen und zum Array machen
                            options: Array.isArray(state.options) 
                                ? state.options 
                                : state.options ? [state.options] : []
                        } as IStateOnOffOptions;
                    
                    default: // ValueOnly
                        return {
                            ...baseState,
                            value: String(state.value),
                            options: undefined
                        } as IStateValueOnly;
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
            const mappedStates = this.mapDeviceStates(device.states || []);
            const newDevice: IDevice = {
                name: device.name,
                MAC: device.MAC,
                states: mappedStates,
                online: device.isOnline
            };
            const newDevices = [...this.devices, newDevice];
            this.setDevices(newDevices);
        }));

        // device updated event: name or isOnline changed
        client.service('devices').on('patched', action((device: Device) => {
            console.log('Device updated:', device);
            const updatedDevices = this.devices.map(d => 
                d.MAC === device.MAC 
                    ? { ...d, name: device.name, online: device.isOnline, states: this.mapDeviceStates(device.states || []) }
                    : d
            );
            // this.setStates(updatedDevices.flatMap(d => d.states? d.states : []));
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

    setStates(states: DeviceState[]) {
        this.states = states;
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
                states: this.mapDeviceStates(d.states || []),
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
