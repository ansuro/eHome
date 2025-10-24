import { observable, makeObservable, action, computed } from 'mobx';

import client from '../feathers-client';
import { Device } from 'ehome-backend';
import { AppRootStore } from './AppRootStore';

// Observer for all devices (admin only)
export class DevicesObserver {
    appRootStore: AppRootStore;
    isLoaded: boolean = false;
    devices: Device[] = [];

    constructor(appRootStore: AppRootStore) {
        makeObservable(this, {
            isLoaded: observable,
            devices: observable,
            setIsLoaded: action,
            setDevices: action,
            addDevice: action
        });

        this.appRootStore = appRootStore;

        this.init();
        this.reloadDevices();
    }

    init() {
        client.on('login', (authenticationResult, params, context) => {
            console.log('DevicesObserver: Logged in event');
            this.reloadDevices();
        });

        client.service('devices').on('patched', action((device: Device) => {
            console.log('device patched: ' + JSON.stringify(device));
            this.devices.forEach((gx, i) => {
                if (gx.id === device.id) {
                    this.devices[i] = device;
                    console.log('devices patched: ' + JSON.stringify(device));
                }
            });
        }));

        client.service('devices').on('created', action((device: Device) => {
            console.log('device created: ' + JSON.stringify(device));
            this.devices.push(device);
        }));

        setTimeout(() => {
            this.setIsLoaded(true);
        }, 500);
    }

    private reloadDevices() {
        console.log('init DevicesObserver');
        client.service('devices').find({
            paginate: false,
            query: {
                $paginate: false
            }
        }).then(u => this.setDevices(u))
        .catch(e => console.log(e));
    }

    setDevices(device: Device[]) {
        this.devices = device;
    }

    addDevice(device: Device) {
        this.devices.push(device);
    }

    setIsLoaded(isLoaded: boolean) {
        this.isLoaded = isLoaded;
    }
}
