import React from "react";
import ls from 'local-storage'

class BussinessDiscount extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            category: this.props.category,
            percent: this.props.percent,
            expire: this.props.expire,
            code: this.props.code,
            jwt: this.props.jwt,
            deleted: false,
            error: ""
        };
    }

    deleteDiscount = () => {
        const requestOptions = {
            method: 'DELETE',
            mode: "cors",
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            }
        };
        let jwt = ls.get('jwt');

        fetch('https://cards-app-311715.ew.r.appspot.com/discounts/' + this.state.code + '?key=' + jwt, requestOptions)
            .then(response => {
                if (response.status !== 200) {
                    this.setState({ error: "Could not delete" })
                } else {
                    this.setState({
                        deleted: true,
                    })
                    this.props.handleRemove(this.state.code);
                }
            })


    }

    render() {
        if (this.state.deleted) {
            return (<div></div>);
        }
        return (
            <div className="discount discount-bussiness">
                <div className="discount_second">
                    <div className="category">{this.state.category}</div>
                    <div className="percent percent-bussiness">{this.state.percent}</div>
                </div>
                <div className="discount_third">
                    <div className="code">Code: {this.state.code}</div>
                    <div className="expire">Expires: {this.state.expire}</div>
                </div>
                <div className="fourth">
                    <button type="button" onClick={this.deleteDiscount} className="fourth-btn-bussiness">Delete</button>
                    {this.state.error}
                </div>
            </div>
        );
    }
}

export default BussinessDiscount;
