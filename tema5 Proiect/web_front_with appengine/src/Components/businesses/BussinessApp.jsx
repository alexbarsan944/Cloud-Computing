import React from "react";
import BussinessInfo from "./BussinessInfo";
import BussinessDiscounts from "./BussinessDiscounts";
import ls from 'local-storage'

class BussinessApp extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            name: this.props.name,
            password: this.props.password,
            email: this.props.email,
            jwt: this.props.jwt,
            id: this.props.id,
            displayTab: 0 // 0 for profile, 1 admin discounts
        };
    }

    componentDidMount() {
        // for displayTab
        if (ls.get('displayTab') !== null)
            this.setState({ displayTab: ls.get('displayTab') });
        else
            ls.set('displayTab', 0);
    }

    switchModeToClient = () => {
        if (window.confirm('This will log you out. Are you sure?')) {
            this.props.logout();
            this.props.setIsClient(true);
        }
    }

    setDisplayTabZero = () => {
        ls.set('displayTab', 0);
        this.setState({ displayTab: 0 });
    }

    setDisplayTabOne = () => {
        ls.set('displayTab', 1);
        this.setState({ displayTab: 1 });
    }

    setDisplayTabTwo = () => {
        ls.set('displayTab', 2);
        this.setState({ displayTab: 2 });
    }

    logout = () => {
        this.props.logout();
    }

    render() {
        var display0 = (this.state.displayTab === 0)
        var display1 = (this.state.displayTab === 1)
        //var display2 = (this.state.displayTab === 2)
        return (
            <div>
                <header>
                    <div>
                        <button type="button" onClick={this.switchModeToClient} className="header_btn">go to Client app</button>
                    </div>
                    <div>
                        <button type="button" onClick={this.setDisplayTabOne} className="header_btn">Discounts</button>
                        <button type="button" onClick={this.setDisplayTabZero} className="header_btn">Profile</button>
                        <button type="button" onClick={this.logout} className="header_btn">LogOut</button>
                    </div>
                </header>
                <div className="sub_app">
                    {display0 && (<BussinessInfo email={this.state.email} storeName={this.state.storeName} password={this.state.password} />)}
                    {display1 && (<BussinessDiscounts email={this.state.email} storeName={this.state.storeName} jwt={this.state.jwt} id={this.state.id} setJwt={this.props.setJwt}/>)}
                </div>
            </div >
        );
    }
}
export default BussinessApp;

