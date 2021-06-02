import React from "react";
import ls from 'local-storage';

class MakeSubscription extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            days: 1,
            error: ""
        };
    }



    requestSubscription = (event) => {
        event.preventDefault();
        const requestOptions = {
            method: 'POST',
            mode: 'cors',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            },
            body: '{"days": ' + this.state.days + '}'
        };
        fetch('https://cards-app-311715.ew.r.appspot.com/stores/subscribe', requestOptions)
            .then(response => {
                if (response.status !== 200) {
                    this.setState({ error: "Could not create" })
                } else {
                    if (this.state.error !== "")
                        this.setState({
                            error: "",
                        })
                    let x = response.text()
                    return x
                }
            })
            .then(data => {
                if (this.state.error === "") {
                    this.props.setJwt(data);
                    window.location.href = "https://europe-central2-web-front-314907.cloudfunctions.net/PAY?amount=" + this.state.days*3;
                }
            });
    }

    updateInfo = (event) => {
        let fieldName = event.target.name;
        let fieldValue = event.target.value;
        if (fieldName === 'days') {
            this.setState({ days: fieldValue });
        }
    };

    render() {
        return (
            <form onSubmit={this.requestSubscription}>
                <h1> NO SUBSCRIPTION FOUND</h1>
                <p>You may request a new subscription.</p>
                <p>Pick a validity period for your subscription.</p>
                <label htmlFor="days">Days:</label>
                <input onChange={this.updateInfo} type="number" name="days" min="1" max="200" value={this.state.days} required />
                <p>Cost: {this.state.days*3} lei</p>
                <input type="submit" className="btn btn-client" value="Create Subscription" />
                {this.state.error}
            </form>
        );
    }
}

export default MakeSubscription;
