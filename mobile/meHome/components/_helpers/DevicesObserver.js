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
            setSelectedGroupIndex: action,
            devices: observable
        });

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
            // console.log(g);
        })).catch(action("fetchError", e => {
            console.error(e);
            this.isLoading = false;
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
        // console.log(i);
        // this.devices = this.groups[this.selectedGroupIndex].devices;
        // const ids = this.groups[this.selectedGroupIndex].devices.flatMap(s => s._id);
        // console.log(ids);
        // devices array neu laden
        // client.service('devices').find({
        //     query: {
        //         $paginate: false,
        //         _id: {
        //             $in: ids
        //         }
        //     }
        // }).then(action("fetchSuccess", d => {
        //     this.devices = d;
        // })).catch(action("fetchError",e => console.error(e)))
        // .finally(action(() => this.isLoading = false));
    }

    reloadDevices() {
        if (this.selectedGroupIndex < 0)
            return;

        const ids = this.groups[this.selectedGroupIndex].devices.flatMap(s => s._id);
        // console.log(ids);
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
}