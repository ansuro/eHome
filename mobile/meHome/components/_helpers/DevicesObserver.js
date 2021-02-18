import { observable, makeObservable, action, computed } from 'mobx';

import client from './fapp';

class DevicesObserver {
    groups = [];
    devices = [];

    selectedGroupIndex = -1;
    isLoading = true;
    isInit = true;

    constructor() {
        makeObservable(this, {
            groups: observable,
            selectedGroupIndex: observable,
            isLoading: observable,
            isInit: observable,
            setSelectedGroupIndex: action,
            devices: observable,
            noGroups: computed
        });
    }

    init() {
        client.service('groups').find({
            query: {
                $paginate: false
            }
        }).then(action("fetchSuccess", g => {
            this.groups = g;
            if (g.length > 0) {
                this.setSelectedGroupIndex(0);
            }
            this.isInit = false;
        })).catch(action("fetchError", e => {
            console.error(e);
            this.isInit = false;
        }));

        // nur aktuelle Devices einer Gruppen überprüfen
        client.service('devices').on('patched', action(d => {
            console.log('device patched ' + JSON.stringify(d));
            this.devices.forEach((dx, i) => {
                if (dx._id === d._id) {
                    this.devices[i] = d;
                    console.log(JSON.stringify(d));
                }
            });
        }));

        client.io.on('connect', () => {
            this.reloadDevices();
        });
    }

    // devices aus group holen und refreshen
    setSelectedGroupIndex(i) {
        this.selectedGroupIndex = i;
        this.reloadDevices();
    }

    reloadDevices() {
        console.log(this.selectedGroupIndex);
        if (this.selectedGroupIndex < 0)
            return;

        action(() => this.isLoading = true);

        const gid = this.groups[this.selectedGroupIndex]._id;
        // console.log(gid);
        client.service('groups').get(gid, {
            query: {
                $select: ['devices']
            }
        }).then(action("fetchSuccess", g => {
            console.log(g);
            this.devices = g.devices;
        })).catch(action("fetchError", e => console.error(e)))
            .finally(action(() => this.isLoading = false));
    }

    get noGroups() {
        return this.groups.length === 0;
    }
}

export const devicesObserver = new DevicesObserver();