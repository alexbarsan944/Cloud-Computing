import React from "react";
import ClientInfo from "./ClientInfo";
import ClientPromos from "./ClientPromo";
import ClientExplore from "./ClientExplore"

import ls from 'local-storage'

class ClientApp extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            name: this.props.name,
            email: this.props.email,
            password: this.props.password,
            discounts: this.props.discounts,
            displayTab: 0 // 0 for profile, 1 for cards
        };
    }
    componentDidMount() {
        // for displayTab
        if (ls.get('displayTab') !== null)
            this.setState({ displayTab: ls.get('displayTab') });
        else
            ls.set('displayTab', 0);
    }

    switchModeToBussiness = () => {
        if (window.confirm('This will log you out. Are you sure?')) {
            this.props.logout();
            this.props.setIsClient(false);
        }
    }

    setDisplayTabZero = () => {
        ls.set('displayTab', 0);
        this.setState({ displayTab: 0 });
    }

    setDisplayTabOne = () => {
        ls.set('displayTab', 1);
        ls.set('gotDiscounts', false);
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
        var display2 = (this.state.displayTab === 2)
        return (
            <div>
                <header className="header-client">
                    <div>
                        <button type="button" onClick={this.switchModeToBussiness} className="header_btn header_btn-client">go to Bussiness app</button>
                    </div>
                    <div>
                        <button type="button" onClick={this.setDisplayTabTwo} className="header_btn header_btn-client">Explore</button>
                        <button type="button" onClick={this.setDisplayTabOne} className="header_btn header_btn-client">Promotions</button>
                        <button type="button" onClick={this.setDisplayTabZero} className="header_btn header_btn-client">Profile</button>
                        <button type="button" onClick={this.logout} className="header_btn header_btn-client">LogOut</button>
                    </div>
                </header>
                <div className="sub_app">
                    {display0 && (<ClientInfo email={this.state.email} name={this.state.name} password={this.state.password} />)}
                    {display1 && (<ClientPromos discounts={this.state.discounts}  />)}
                    {display2 && (<ClientExplore discounts={this.state.discounts}  />)}
                </div>
            </div >
        );
    }
}
export default ClientApp;

