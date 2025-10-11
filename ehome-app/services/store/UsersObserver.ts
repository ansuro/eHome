import { observable, makeObservable, action, computed } from 'mobx';

import client from '../feathers-client';
import { User } from 'ehome-backend';
import { AppRootStore } from './AppRootStore';

// Observer for all users (admin only)
export class UsersObserver {
    appRootStore: AppRootStore;
    isLoaded: boolean = false;
    users: User[] = [];

    constructor(appRootStore: AppRootStore) {
        makeObservable(this, {
            isLoaded: observable,
            users: observable,
            setIsLoaded: action,
            setUsers: action,
            addUser: action
        });

        this.appRootStore = appRootStore;

        this.init();
        this.reloadUsers();
    }

    init() {
        client.on('login', (authenticationResult, params, context) => {
            console.log('UserObserver: Logged in event');
            this.reloadUsers();
        });

        client.service('users').on('patched', action((user: User) => {
            console.log('user patched: ' + JSON.stringify(user));
            this.users.forEach((gx, i) => {
                if (gx.id === user.id) {
                    this.users[i] = user;
                    console.log('user patched: ' + JSON.stringify(user));
                }
            });
        }));

        client.service('users').on('created', action((user: User) => {
            console.log('user created: ' + JSON.stringify(user));
            this.users.push(user);
        }));

        setTimeout(() => {
            this.setIsLoaded(true);
        }, 500);
    }

    private reloadUsers() {
        console.log('init UsersObserver');
        client.service('users').find({
            paginate: false,
            query: {
                $withGroups: true,
                $paginate: false
            }
        }).then(u => this.setUsers(u))
        .catch(e => console.log(e));
    }

    setUsers(users: User[]) {
        this.users = users;
    }

    addUser(user: User) {
        this.users.push(user);
    }

    setIsLoaded(isLoaded: boolean) {
        this.isLoaded = isLoaded;
    }
}
