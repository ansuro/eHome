import { observable, makeObservable, action, computed } from 'mobx';

import client from '../feathers-client';
import { Group } from 'ehome-backend';
import { AppRootStore } from './AppRootStore';

// Observer for all groups (admin only)
export class GroupsObserver {
    appRootStore: AppRootStore;
    isLoaded: boolean = false;
    groups: Group[] = [];

    constructor(appRootStore: AppRootStore) {
        makeObservable(this, {
            isLoaded: observable,
            groups: observable,
            setIsLoaded: action,
            setGroups: action,
            addGroup: action
        });

        this.appRootStore = appRootStore;

        this.init();
    }

    async init() {
        console.log('init GroupsObserver');

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

        client.service('groups').on('patched', action((group: Group) => {
            console.log('group patched: ' + JSON.stringify(group));
            this.groups.forEach((gx, i) => {
                if (gx.id === group.id) {
                    this.groups[i] = group;
                    console.log('group patched: ' + JSON.stringify(group));
                }
            });
        }));

        client.service('groups').on('created', action((group: Group) => {
            console.log('group created: ' + JSON.stringify(group));
            // const g = [
            //     ...this.groups,
            //     group
            // ]
            // this.setGroups(g);
            this.groups.push(group);
            // this.addGroup(group);
            // let g = this.groups;
            // g.push(group);
            // this.setGroups(g);
        }));

        setTimeout(() => {
            this.setIsLoaded(true);
        }, 500);
    }

    setGroups(groups: Group[]) {
        this.groups = groups;
    }

    addGroup(group: Group) {
        this.groups.push(group);
    }

    setIsLoaded(isLoaded: boolean) {
        this.isLoaded = isLoaded;
    }
}
