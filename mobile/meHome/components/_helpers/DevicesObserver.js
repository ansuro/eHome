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
            if(g.length > 0) {
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
        this.isLoading = true;
        this.selectedGroupIndex = i;
        this.reloadDevices();
    }

    reloadDevices() {
        if (this.selectedGroupIndex < 0)
            return;

        const ids = this.groups[this.selectedGroupIndex].devices.flatMap(s => s._id);
        // devices array neu laden
        client.service('devices').find({
            query: {
                $paginate: false,
                _id: {
                    $in: ids
                }
            }
        }).then(action("fetchSuccess", d => {
            this.devices = d;
        })).catch(action("fetchError", e => console.error(e)))
            .finally(action(() => this.isLoading = false));
    }

    get noGroups() {
        return this.groups.length === 0;
    }
}

export const devicesObserver = new DevicesObserver();