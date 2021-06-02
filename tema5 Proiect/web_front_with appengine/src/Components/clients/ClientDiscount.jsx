import React from "react";
import "./ClientStyle.css"

class ClientDiscount extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            storeName: this.props.storeName,
            category: this.props.category,
            percent: this.props.percent,
            expire: this.props.expire,
            code: this.props.code,
        };
    }
    selectDiscount = () => {
        this.props.selectDiscount(this.props.order);
    }

    render() {
        return (
            <div className="discount-client">
                <div className="discount_first">
                    <div className="discount_store">{this.state.storeName}</div>
                </div>
                <div className="discount_second">
                    <div className="category">{this.state.category}</div>
                    <div className="percent">{this.state.percent} %</div>
                </div>
                <div className="discount_third">
                    <div className="code">Code: {this.state.code}</div>
                    <div className="expire">Expires: {this.state.expire}</div>
                </div>
                <div className="fourth">
                    <button type="button" onClick={this.selectDiscount} className="fourth-btn">select</button>
                </div>
            </div>
        );
    }
}

export default ClientDiscount;
