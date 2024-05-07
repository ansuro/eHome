import client from "../feathers-client";
import { AppStateObserver } from "./AppStateObserver";
import { GroupsObserver } from "./GroupsObserver";
import { UserStateObserver } from "./UserStateObserver";
import { UsersObserver } from "./UsersObserver";


export class AppRootStore {
  appState: AppStateObserver;
  userState: UserStateObserver;

  usersObserver?: UsersObserver;
  groupsObserver?: GroupsObserver;

  constructor() {
    this.appState = new AppStateObserver(this);
    this.userState = new UserStateObserver(this);

    client.on('login', (authenticationResult, params, context) => {
      console.log('Logged in event');
      if (authenticationResult.user?.isAdmin) {
        this.usersObserver = new UsersObserver(this);
        console.log('usersObserver created');
        this.groupsObserver = new GroupsObserver(this);
        console.log('groupsObserver created');
      }
    });

    client.on('logout', (authenticationResult, params, context) => {
      console.log('Logged out event');
      delete this.usersObserver;
      delete this.groupsObserver;
    });

    client.io.on('connect', () => {
      this.appState.setConnected(true);
      console.log('socket.io connected');
      // login, if jwt is present
      client.reAuthenticate(true, 'jwt').then(authResult => {
        console.log('reauth: ' + JSON.stringify(authResult));
      }).catch(e => {
        console.log('reauth failed: ' + e);
        client.logout();
        console.log('after logout');
        this.userState.logout();
        // TODO delete jwt
      });
    });

    client.io.on('disconnect', (reason: any) => {
      this.appState.setConnected(false);
      console.log('socket.io disconnected');
    });
  }

}