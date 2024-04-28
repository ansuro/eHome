import { ThemeMode } from '@rneui/themed';
import { observable, makeObservable, action, computed } from 'mobx';
import { Appearance } from 'react-native';
import { IDevice } from '../../components/devices/DeviceTypes';
import { IGroup } from '../../components/groups/GroupTypes';
import client from '../feathers-client';
import { Group } from 'ehome-backend';

export class UserStateObserver {
    isLoaded: boolean = false;
    devices: IDevice[] = [];
    groups: IGroup[] = [];
    selectedGroup: IGroup | undefined; 

    constructor() {
        makeObservable(this, {
            isLoaded: observable,
            setIsLoaded: action,
            devices: observable,
            setGroups: action,
            groups: observable,
            updateDevice: action,
            setSelectedGroup: action,
            currentUser: computed
        });
        this.init();
    }

    init() {
        console.log('init UserStateObserver');

        client.service('groups').find({
            query: {
                findAll: true
            }
        }).then(action('fetchSuccess', g => {
            this.setGroups(g.data);
            this.setIsLoaded(true);

        })).catch(action('fetchError', e => {
            console.log(e);

        }));
    }

    setSelectedGroup(group: IGroup) {
        this.selectedGroup = group;
    }

    setGroups(groups: Group[]) {
        this.groups = groups;
    }

    setIsLoaded(isLoaded: boolean) {
        this.isLoaded = isLoaded;
    }

    // only called by feathers-clinet
    updateDevice(device: IDevice) {

    }

    get currentUser() {
        return client.app.get('authentication').user;
    }

}

// export const userState = new UserStateObserver();