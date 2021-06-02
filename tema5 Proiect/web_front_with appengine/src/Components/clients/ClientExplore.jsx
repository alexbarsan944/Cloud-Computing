import React from "react";
import Store from "./Store"
import ls from 'local-storage'

class ClientExplore extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            stores: [],
            gotStores: false,
        };
        this.fetchStores();
    }
    fetchStores = () => {
        const requestOptions = {
            method: 'GET',
            mode: 'cors',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            }
        };
        fetch('https://cards-app-311715.ew.r.appspot.com/stores', requestOptions)
            .then(response => {
                if (response.status !== 200) {
                    this.setState({ error: "Could not get stores" })
                } else {
                    if (this.state.error !== "")
                        this.setState({
                            error: "",
                        })
                    let x = response.json()
                    return x
                }
            })
            .then(data => {
                if (this.state.error === "") {
                    this.setState({
                        gotStores: true,
                        stores: data
                    })
                }
            });
    }

    handleSubscribe = (key, isSubscribed, that) => {
        console.log(this.state.stores[key].store_name);
        if (!isSubscribed) {
            const requestOptions = {
                method: 'POST',
                mode: 'cors',
                credentials: "include",
                headers: {
                    'Content-Type': 'application/json'
                }
            };
            fetch('https://cards-app-311715.ew.r.appspot.com/users/' + this.state.stores[key].store_name, requestOptions)
                .then(response => response.json())
                .then(data => {
                    console.log(data);
                    if (data.length === 0)
                        alert("This store currently has no discounts. Check again later")
                    else {
                        that.setState({ isSubscribed: true })
                    }

                });

        } else {
            const requestOptions = {
                method: 'DELETE',
                mode: 'cors',
                credentials: "include",
                headers: {
                    'Content-Type': 'application/json'
                }
            };
            let user_id = ls.get("id")
            fetch("https://cards-app-311715.ew.r.appspot.com/users/" + user_id + "/stores/" + key, requestOptions)
                .then(response => response.json())
                .then(data => { that.setState({ isSubscribed: false }) });
        }
    }

    render() {
        let arr = [];
        let i = 0;
        let discounts = ls.get("discounts");
        Object.keys(this.state.stores).map(key => {
            let isSubscribed = false;
            discounts.map((discount) => {
                if (this.state.stores[key].store_name === discount.store_name) {
                    console.log(discount.store_name);
                    isSubscribed = true;
                }
            })
            arr[i] = isSubscribed;
            i++;
        }
        )
        i = 0;
        return (
            <div>
                <div className="title_container">Here you may choose to subscribe or unsubscribe from businesses</div>
                <div className="stores_container">
                    {(
                        Object.keys(this.state.stores).map(key =>
                            <Store
                                isSubscribed={arr[i++]}
                                handleSubscribe={this.handleSubscribe}
                                key={key}
                                storeName={this.state.stores[key].store_name}
                                email={this.state.stores[key].email}
                                code={key}
                            />
                        ))
                    }
                    {this.state.error}
                </div>
            </div>
        );
    }
}

export default ClientExplore;
