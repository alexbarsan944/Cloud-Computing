import React from "react";
import "./ClientStyle.css"

class Store extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isSubscribed: this.props.isSubscribed,
        };
    }

    subscribe = () => {
        this.props.handleSubscribe(this.props.code, this.state.isSubscribed, this);
    }

    render() {
        return (
            <div className="store">
                <div>
                    <h1>{this.props.storeName}</h1>
                    <h3>{this.props.email}</h3>
                </div>
                <div>
                    {!this.state.isSubscribed &&
                        (<button className="btn btn-client" onClick={this.subscribe} style={{ backgroundColor: "green" }}>
                            subscribe
                        </button>)}

                    {this.state.isSubscribed &&
                        (<button className="btn btn-client" onClick={this.subscribe} style={{ backgroundColor: "red" }}>
                            unsubscribe
                        </button>)}
                </div>
            </div>
        );
    }
}

export default Store;
