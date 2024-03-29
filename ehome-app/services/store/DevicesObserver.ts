import { ThemeMode } from '@rneui/themed';
import { observable, makeObservable, action, computed } from 'mobx';
import { Appearance } from 'react-native';
import { IDevice } from '../../components/devices/DeviceTypes';

// TODO login logik
// import client from './fapp';

class DevicesObserver {
    isLoaded: boolean = false;
    devices: IDevice[] = [];

    constructor() {
        makeObservable(this, {
            devices: observable,
            updateDevice: action
        });
        this.init();
    }

    init() {
        console.log('init DevicesObserver');

    }

    // only called by feathers-clinet
    updateDevice(device: IDevice) {
      
    }

}

export const devicesObserver = new DevicesObserver();