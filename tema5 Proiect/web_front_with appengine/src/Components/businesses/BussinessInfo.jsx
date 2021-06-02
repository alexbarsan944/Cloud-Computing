import React from "react";
import ls from 'local-storage'

class BussinessInfo extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            email: this.props.email,
            name: ls.get("name"),
            password: this.props.password,
            checkPassword: "",
            newPassword1: "",
            newPassword2: ""
        };
    }

    updateInfo = (event) => {
        let fieldName = event.target.name;
        let fieldValue = event.target.value;
        if (fieldName === 'checkPassword') {
            this.setState({ checkPassword: fieldValue });
        } else if (fieldName === 'newPassword2') {
            this.setState({ newPassword2: fieldValue });
        } else if (fieldName === 'newPassword1') {
            this.setState({ newPassword1: fieldValue });
        }
    };

    render() {
        return (
            <div className="trinity">
                <div className="trinity_item">
                    <div className="vertical-flex">
                        <p>This is you</p>
                        <p>Your email is: {this.state.email}</p>
                        <p>And your store name is: {this.state.name}</p>
                        <br />
                        <p>You may choose to follow us on social media</p>
                    </div>
                </div>
                <div className="trinity_item">
                    <div className="vertical-flex">
                        <a href="https://www.facebook.com"><p>Facebook: </p> <img className="icon" src="https://upload.wikimedia.org/wikipedia/commons/thumb/f/ff/Facebook_logo_36x36.svg/768px-Facebook_logo_36x36.svg.png" /></a>
                        <a href="https://www.instagram.com"><p>Instagram: </p><img className="icon" src="http://assets.stickpng.com/images/580b57fcd9996e24bc43c521.png" /></a>
                        <a href="https://www.twitter.com"><p>Twitter: </p><img className="icon" src="https://i.pinimg.com/236x/b7/91/26/b79126d537c628d7ac5429f7f84ffc8e--twitter-logo-twitter-icon.jpg" /></a>
                    </div>
                </div>
                <div className="trinity_item">
                    {/* <form>
                        <p>You may change your password</p>
                        <label htmlFor="checkPassword">Current Password:</label>
                        <input onChange={this.updateInfo} type="password" name="checkPassword"
                            value={this.state.checkPassword} />
                        <label htmlFor="newPassword1">New Password</label>
                        <input onChange={this.updateInfo} type="password" name="newPassword1"
                            value={this.state.newPassword1} title="Password must contain at least 6 characters, including UPPER/lowercase and numbers" required pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}" />
                        <label htmlFor="newPassword2">Confirm New Password</label>
                        <input onChange={this.updateInfo} type="password" name="newPassword2"
                            value={this.state.newPassword2} title="Password must contain at least 6 characters, including UPPER/lowercase and numbers" required pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}" />
                        <button onClick={this.changePassword} className="btn">Change Now</button>
                    </form> */}
                </div>
            </div>
        );
    }
}

export default BussinessInfo;
