import React from "react";
import ls from 'local-storage'
import BussinessDiscount from "./BussinessDiscount"
import MakeSubscription from "./MakeSubscription"
import jwt_decode from "jwt-decode";
import Countdown from "react-countdown"

const renderer = ({ days, hours, minutes, seconds, completed }) => {
    if (completed) {
        return <p>Your subscription has expired</p>
    } else {
        return <div style={{ display: "flex", flexDirection: "column" }} ><span>Days: {days} , Hours: {hours}</span><span>Minutes: {minutes} , Seconds: {seconds}</span></div>;
    }
};

class BussinessDiscounts extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            gotDiscounts: false,
            email: this.props.email,
            storeName: this.props.storeName,
            jwt: this.props.jwt,
            id: this.props.id,
            discounts: [],
            gama_produs: "",
            procent: "",
            data_expirare: "",
            error: ""
        };
    }


    updateInfo = (event) => {
        let fieldName = event.target.name;
        let fieldValue = event.target.value;
        if (fieldName === 'password') {
            this.setState({ checkPassword: fieldValue });
        } else if (fieldName === 'newPassword2') {
            this.setState({ newPassword2: fieldValue });
        } else if (fieldName === 'newPassword1') {
            this.setState({ newPassword1: fieldValue });
        }
    };

    updateCount = (numberValue) => {
        this.setState({ count: this.state.count + numberValue })
    }

    getDiscounts = () => {
        const requestOptions = {
            method: 'GET',
            mode: 'cors',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            }
        };
        fetch('https://cards-app-311715.ew.r.appspot.com/stores/' + this.state.id + '/discounts', requestOptions)
            .then(response => response.json())
            .then(data => {
                this.setState({
                    gotDiscounts: true,
                    discounts: data,
                    count: this.state.discounts.length
                })

            });
    }

    addDiscount = (event) => {
        event.preventDefault();
        var d = this.state.data_expirare
        console.log(this.state.data_expirare)
        var formattedDate = d[8] + d[9] + "/" + d[5] + d[6] + "/" + d[0] + d[1] + d[2] + d[3]
        console.log(formattedDate);
        console.log(this.state.procent);
        console.log(this.state.gama_produs);
        const requestOptions = {
            method: 'POST',
            mode: 'cors',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            body: JSON.stringify({
                gama_produs: this.state.gama_produs,
                procent: this.state.procent,
                data_expirare: formattedDate
            })
        };
        console.log(requestOptions);
        let jwt = ls.get('jwt');
        fetch('https://cards-app-311715.ew.r.appspot.com/discounts?key=' + jwt, requestOptions)
            .then(response => {
                if (response.status !== 201) {
                    this.setState({ error: "Could not add" })
                } else {
                    if (this.state.error !== "")
                        this.setState({
                            error: "",
                        })
                    return response.json()
                }

            })
            .then(data => {
                if (this.state.error === "") {
                    this.state.discounts[data._id] = {
                        gama_produs: this.state.gama_produs,
                        procent: this.state.procent,
                        data_expirare: formattedDate
                    }
                    this.updateCount(1);
                }
            });
    }


    updateInfo = (event) => {
        let fieldName = event.target.name;
        let fieldValue = event.target.value;
        if (fieldName === 'category') {
            this.setState({ gama_produs: fieldValue });
        } else if (fieldName === 'percent') {
            this.setState({ procent: fieldValue });
        } else if (fieldName === 'expire') {
            this.setState({ data_expirare: fieldValue });
        }
    };

    handleRemove = (_id) => {
        delete this.state.discounts[_id];
    }

    setJwt = (stringValue) => {
        this.setState({ jwt: stringValue })
        this.props.setJwt(stringValue)
    }

    render() {
        console.log(this.state.minDate);
        if (!this.state.gotDiscounts) {
            this.getDiscounts();
            return (<div>Loading</div>);
        }
        let jwt = ls.get('jwt');
        if (jwt === 'undefined' || typeof jwt === 'undefined' || jwt === "None" || jwt === "" || jwt === null || !jwt) {
            return (<div className="trinity">
                <MakeSubscription setJwt={this.setJwt} />
            </div>)
        }
        var decoded = jwt_decode(jwt);
        if (decoded.exp < Date.now() / 1000) {
            return (<div className="trinity">
                <MakeSubscription setJwt={this.setJwt} />
            </div>)
        }
        var t = new Date();
        t.setMonth(t.getMonth() + 1);
        let minDate = (t.getFullYear()) + '-' + ('0' + t.getMonth()).slice(-2) + '-' + ('0' + t.getDate()).slice(-2);


        
        t = new Date(decoded.exp * 1000);
        t.setMonth(t.getMonth() + 1);
        let maxDate = (t.getFullYear()) + '-' + ('0' + t.getMonth()).slice(-2) + '-' + ('0' + t.getDate()).slice(-2);
        console.log(minDate)
        console.log(maxDate);
        let arr = []
        return (
            <div className="trinity">
                <div className="trinity_item">
                    <div className="discount_container">
                        {(
                            arr = Object.keys(this.state.discounts).map(key =>
                                <BussinessDiscount
                                    handleRemove={this.handleRemove}
                                    key={key}
                                    storeName={this.state.storeName}
                                    category={this.state.discounts[key].gama_produs}
                                    percent={this.state.discounts[key].procent + "%"}
                                    expire={this.state.discounts[key].data_expirare}
                                    code={key}
                                    jwt={this.state.jwt}
                                />
                            ))
                        }
                        {arr.length === 0 && (<div>Nothing here. Start creating discounts for your loyal customers</div>)}
                    </div>
                </div>
                <div className="trinity_item">
                    <form onSubmit={this.addDiscount}>
                        <p>You may add a new discount to your store</p>
                        <label htmlFor="category">Description: </label>
                        <input onChange={this.updateInfo} type="text" name="category" value={this.state.gama_produs} required />
                        <label htmlFor="percent">Percent: </label>
                        <input onChange={this.updateInfo} type="number" max="99" name="percent" value={this.state.procent} required />
                        <label htmlFor="expire">Expire date: </label>
                        <input onChange={this.updateInfo} type="date" min={minDate} max={maxDate} name="expire" value={this.state.data_expirare} required />
                        <input type="submit" className="btn" value="Add" />
                        {this.state.error}
                        Subscription time left:
                        <Countdown date={decoded.exp * 1000} renderer={renderer}>

                        </Countdown>
                    </form>
                </div>
            </div>
        );
    }
}

export default BussinessDiscounts;
