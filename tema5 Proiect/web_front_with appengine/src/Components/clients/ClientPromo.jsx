import React from "react";
import ClientDiscount from "./ClientDiscount"
import ShopAndYouMap from "../other/ShopAndYouMap"
import QrCode from "./QrCode"
import ls from 'local-storage'

class ClientPromos extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            discounts: [],
            selected: -1,
            address: ""
        };
        this.mapRef = React.createRef();
    }

    selectDiscount = (key) => {
        this.setState({ selected: key })
        this.mapRef.current.changeName(this.state.discounts[key].store_name);
    }
    setAddress = (stringValue) => {
        this.setState({ address: stringValue })
    }

    getDiscounts = () => {
        let email = ls.get("email")
        let password = ls.get("password1")
        const requestOptions = {
            method: 'POST',
            mode: 'cors',
            credentials: "include",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email: email,
                password: password
            })
        };
        fetch('https://cards-app-311715.ew.r.appspot.com/users/login', requestOptions)
            .then(response => response.json())
            .then(data => {
                if (data.success === true) {
                    this.setState({ discounts: data.discounts });
                    ls.set("discounts", data.discounts)
                    ls.set("gotDiscounts", true);
                }
            });
    }

    render() {
        let gotDiscounts = ls.get("gotDiscounts")
        if (!gotDiscounts) {
            this.getDiscounts();
            return (<span style={{ fontSize: "170px", fontWeight: "700", color: "blue" }}>LOADING</span>);
        }
        let i = 0;
        let discounts = ls.get("discounts")
        console.log(discounts.length);
        return (
            <div className="trinity">
                <div className="trinity_item trinity_first">
                    {discounts.length > 0 && (<div className="discount_container">
                        {discounts.map((discount) =>
                            <ClientDiscount
                                order={i}
                                key={i++}
                                storeName={discount.store_name}
                                category={discount.gama_produs}
                                percent={discount.procent}
                                expire={discount.data_expirare}
                                code={discount.discount_id}
                                selectDiscount={this.selectDiscount}
                            />)
                        }
                    </div>)}
                </div>
                <div className="trinity_item">
                    <div className="shop-map">
                        {discounts.length <= 0 && (<p>Go to explore to add some shops</p>)}
                        {/* {discounts.length > 0 && (<ShopAndYouMap ref={this.mapRef} name={this.state.name} setAddress={this.setAddress} />)} */}
                        <p>{this.state.address}</p>
                    </div>
                </div>
                <div className="trinity_item">
                    <div className="qr-code">
                        {(this.state.selected !== -1)
                            && (<QrCode code={this.state.discounts[this.state.selected].discount_id} />)}
                        {(this.state.selected !== -1)
                            && (<div>Click the QR code to download the image.</div>)}
                        <br />
                        {(this.state.selected !== -1)
                            && (<div>You may also choose to copy the code as text to clipboard</div>)}
                        {(this.state.selected !== -1)
                            && (<button className="btn btn-client" onClick={() => { navigator.clipboard.writeText(this.state.discounts[this.state.selected].discount_id); alert("copied") }}>copy code</button>)}

                    </div>
                </div>
            </div>
        );
    }
}

export default ClientPromos;
