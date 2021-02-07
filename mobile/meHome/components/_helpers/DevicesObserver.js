import { observable, makeObservable, action } from 'mobx';

import client from './fapp';

export default class DevicesObserver {
    groups = [];
    selectedGroupIndex = 0;
    state = 'loading'; // loading v done

    constructor() {
        makeObservable(this, {
            groups: observable,
            selectedGroupIndex: observable,
            state: observable,
            init: action,
            setSelectedGroupIndex: action
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
            this.state = 'done';
            console.log(this.state);
        })).catch(action("fetchError", e => {
            console.error(e);
            this.state = 'done';
        }));
    }

    // get selectedGroupIndex() {
    //     return this.selectedGroupIndex;
    // }

    /**
     * @param {number} i
     */
    // set selectedGroupIndex(i) {
    //     this.selectedGroupIndex = i;
    // }

    setSelectedGroupIndex(i) {
        this.selectedGroupIndex = i;
        console.log(i);
    }
}