import React from "react";
import ls from 'local-storage';
import "./ClientStyle.css";

class ClientLogin extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isRegister: false,
            email: "",
            name: "",
            password1: "",
            password2: "",
            error: ""
        };
    }

    componentDidMount() {
        // for isRegister
        if (ls.get('isRegister') !== null)
            this.setState({ isRegister: ls.get('isRegister') });
        else
            ls.set('isRegister', false);
    }

    updateInfo = (event) => {
        let fieldName = event.target.name;
        let fieldValue = event.target.value;
        if (fieldName === 'name') {
            this.setState({ name: fieldValue });
        } else if (fieldName === 'email') {
            this.setState({ email: fieldValue });
        } else if (fieldName === 'password1') {
            this.setState({ password1: fieldValue });
        } else if (fieldName === 'password2') {
            this.setState({ password2: fieldValue });
        }
    };

    setIsRegister = (boolValue) => {
        this.setState({ isRegister: boolValue });
        ls.set('isRegister', boolValue);
    }
    goToRegister = () => {
        this.setIsRegister(true);
    };
    goToLogin = () => {
        this.setIsRegister(false);
    };
    switchModeToBusiness = () => {
        this.props.setIsClient(false);
    }

    loginRequest = (event) => {
        event.preventDefault();
        const requestOptions = {
            method: 'POST',
            mode: 'cors',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            body: JSON.stringify({
                email: this.state.email,
                password: this.state.password1
            })
        };
        fetch('https://cards-app-311715.ew.r.appspot.com/users/login', requestOptions)
            .then(response => response.json())
            .then(data => {
                if (data.success === true) {
                    this.props.login(data.name, this.state.email, this.state.password1, "", data.response, data.discounts);
                } else {
                    this.setState({ error: "Error: wrong username or password." })
                }
            });
    }

    registerRequest = (event) => {
        event.preventDefault();
        if (this.state.password1 === this.state.password2) {
            const requestOptions = {
                method: 'POST',
                mode: 'cors',
                credentials: "include",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    name: this.state.name,
                    email: this.state.email,
                    password: this.state.password1
                })
            };
            fetch('https://cards-app-311715.ew.r.appspot.com/users/register', requestOptions)
                .then(response => response.json())
                .then(data => {
                    if (data.id !== null) {
                        this.props.login(this.state.name, this.state.email, this.state.password1, data.jwt, data._id, data.discounts);
                    }
                });
        } else {
            this.setState({ error: "Error: Passwords don't match." });
        }
    }

    render() {
        return (
            <div className="sub_app">
                {this.major}
                <div className="trinity">
                    {this.state.isRegister && (
                        <form onSubmit={this.registerRequest}>
                            <label htmlFor="name">Name</label>
                            <input type="text" name="name" placeholder="Briose_Gustoase" onChange={this.updateInfo} value={this.state.name} required />

                            <label htmlFor="email">Email</label>
                            <input type="email" name="email" placeholder="brioseG@gmail.com" onChange={this.updateInfo} value={this.state.email} /*pattern="+@+.+"*/ required />


                            <label htmlFor="password">Password</label>
                            <input type="password" name="password1" onChange={this.updateInfo} value={this.state.password1} title="Password must contain at least 6 characters, including UPPER/lowercase and numbers" required /*pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}"*/ />

                            <label htmlFor="password2">Confirm Password</label>
                            <input type="password" name="password2" onChange={this.updateInfo} value={this.state.password2} title="Password must contain at least 6 characters, including UPPER/lowercase and numbers" required /*pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}"*/ />
                            <input type="submit" className="btn btn-client" value="Register" />
                            {this.state.error}
                            <a onClick={this.goToLogin} href="">Want to login?</a>
                            <a onClick={this.switchModeToBusiness} href="">Are you a business?</a>
                        </form>
                    )}

                    {!this.state.isRegister && (
                        <form onSubmit={this.loginRequest}>
                            <label htmlFor="email">Email</label>
                            <input type="text" name="email" placeholder="client.grozav@yahoo.com" onChange={this.updateInfo} value={this.state.email} />
                            <label htmlFor="password1">Password</label>
                            <input type="password" name="password1" onChange={this.updateInfo} value={this.state.password1} />
                            <input type="submit" className="btn btn-client" value="Login" />
                            {this.state.error}
                            <a onClick={this.goToRegister} href="">Want to register?</a>
                            <a onClick={this.switchModeToBusiness} href="">Are you a business?</a>

                        </form>
                    )}
                </div>
            </div>
        );
    }
}

export default ClientLogin;
