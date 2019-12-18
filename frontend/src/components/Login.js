import React from 'react';
import { Panel } from 'primereact/panel';
import { InputText } from 'primereact/inputtext';
import { Password } from 'primereact/password';
import { Button } from 'primereact/button';
import client from '../_helpers/fclient';
import { AppSpinnerSmall } from './AppSpinner';

class LoginForm extends React.Component {

    constructor(props) {
        super(props);
        this.state = {username: '', password: ''};
        this.login = this.login.bind(this);
    }

    login(e) {
        e.preventDefault();
        const {username, password} = this.state;
        this.props.login(username, password);
    }

    render() {
        let e = '';
        if(this.props.err) {
            e = <div className="p-col">login failed</div>;
        }
        return (
            <Panel header="Login" className="centeritem">
                <form onSubmit={this.login}>
                    <div className="p-grid p-dir-col">
                        <div className="p-col" style={{ marginTop: '10px' }}>
                            <span className="p-float-label">
                                <InputText id="u" size="30" required value={this.state.username} onChange={(e) => this.setState({username: e.target.value})} />
                                <label htmlFor="u">Username</label>
                            </span>
                        </div>
                        <div className="p-col" style={{ marginTop: '10px' }}>
                            <span className="p-float-label">
                                <Password id="p" size="30" required value={this.state.password} onChange={(e) => this.setState({password: e.target.value})} feedback={false} />
                                <label htmlFor="p">Password</label>
                            </span>
                        </div>
                        <div className="p-col">
                            <Button label="login" style={{ width: '100%' }} />
                        </div>
                        {e}
                    </div>
                </form>
            </Panel>
        );
    }
}

class Login extends React.Component {

    constructor(props) {
        super(props);

        this.state = {loading: false, error: false};
        this.login = this.login.bind(this);
    }

    login(username, password) {
        this.setState({loading: true});
        client.authenticate({
            strategy: 'local',
            username, password
        }).then((s) => {
            console.log('auth success: ', JSON.stringify(s));
        })
        .catch((e) => {
            this.setState({error: true, loading: false});
            console.log('err', e);
        });

    }

    render() {
        const loading = this.state.loading;
        const err = this.state.error;
        let content;

        if (!loading) {
            content = <LoginForm login={this.login} err={err} />
        } else {
            content = <div className="centeritem"><AppSpinnerSmall /></div>
        }

        return(
        <div className="centercontainer">
            {content}
        </div>
        );
    }
}

export default Login;