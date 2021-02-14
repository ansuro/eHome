import { observable, makeObservable, action, computed } from 'mobx';

import client from './fapp';

export default class DevicesObserver {
    groups = [];
    devices = [];

    selectedGroupIndex = -1;
    isLoading = true;

    constructor() {
        makeObservable(this, {
            groups: observable,
            selectedGroupIndex: observable,
            isLoading: observable,
            init: action,
            setSelectedGroupIndex: action,
            devices: observable
        });

        // nur aktuelle Devices einer Gruppen überprüfen
        client.service('devices').on('patched', action(d => {
            console.log('device patched ' + JSON.stringify(d));
            this.devices.forEach((dx, i) => {
                if(dx._id === d._id) {
                    this.devices[i] = d;
                    console.log(JSON.stringify(d));
                }
            });
        }));

        this.init();
    }

    init() {
        client.service('groups').find({
            query: {
                $paginate: false
            }
        }).then(action("fetchSuccess", g => {
            this.groups = g;
            this.isLoading = false;
            console.log(g);
        })).catch(action("fetchError", e => {
            console.error(e);
            this.isLoading = false;
        }));

        // // nur aktuelle Devices einer Gruppen überprüfen
        // client.service('devices').on('patched', action(d => {
        //     console.log('device patched ' + JSON.stringify(d));
        //     this.devices.forEach((dx, i) => {
        //         if(dx._id === d._id) {
        //             this.devices[i] = d;
        //             console.log(JSON.stringify(d));
        //         }
        //     });
        // }));
    }

    // devices aus group holen und refreshen
    setSelectedGroupIndex(i) {
        this.selectedGroupIndex = i;
        console.log(i);
        this.devices = this.groups[this.selectedGroupIndex].devices;
        // TODO devices array neu laden
    }

    // get devices() {
    //     return this.groups[this.selectedGroupIndex].devices;
    // }
}