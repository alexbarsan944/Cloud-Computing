import React from "react";
import './App.scss';
import ClientApp from "./Components/clients/ClientApp";
import BussinessApp from "./Components/businesses/BussinessApp";
import ClientLogin from "./Components/clients/ClientLogin";
import BussinessLogin from "./Components/businesses/BussinessLogin";
import ls from 'local-storage'
import './discount.css';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isClient: true,
      isLoggedIn: false,
      name: "",
      password1: "",
      email: "",
      jwt: "",
      id: "",
      discounts: []
    };
  }

  componentDidMount() {
    if (ls.get('isClient') !== null)
      this.setState({ isClient: ls.get('isClient') });
    else
      ls.set('isClient', true);

    if (ls.get('isLoggedIn') !== null)
      this.setState({ isLoggedIn: ls.get('isLoggedIn') });
    else
      ls.set('isLoggedIn', false);

    // for name
    if (ls.get('name') !== null)
      this.setState({ name: ls.get('name') });
    else
      ls.set('name', "");

    // for pass
    if (ls.get('password1') !== null)
      this.setState({ password1: ls.get('password1') });
    else
      ls.set('password1', "");

    // for jwt
    if (ls.get('jwt') !== null)
      this.setState({ jwt: ls.get('jwt') });
    else
      ls.set('jwt', "");

    // for email
    if (ls.get('email') !== null)
      this.setState({ email: ls.get('email') });
    else
      ls.set('email', "");

    // for id
    if (ls.get('id') !== null)
      this.setState({ id: ls.get('id') });
    else
      ls.set('id', "");

    // for discounts
    if (ls.get('discounts') !== null)
      this.setState({ discounts: ls.get('discounts') });
    else
      ls.set('discounts', []);
  }

  // setters /////////////////////////////////////////////////
  setIsClient = (boolValue) => {
    ls.set('isClient', boolValue)
    this.setState({ isClient: boolValue });
  }
  setIsLoggedIn = (boolValue) => {
    ls.set('isLoggedIn', boolValue)
    this.setState({ isLoggedIn: boolValue });
  }
  setName = (stringValue) => {
    this.setState({ name: stringValue });
    ls.set('name', stringValue);
  }
  setPassword = (stringValue) => {
    this.setState({ password1: stringValue });
    ls.set('password1', stringValue);
  }
  setEmail = (stringValue) => {
    this.setState({ email: stringValue });
    ls.set('email', stringValue);
  }
  setJwt = (stringValue) => {
    this.setState({ jwt: stringValue });
    ls.set('jwt', stringValue);
  }
  setId = (stringValue) => {
    this.setState({ id: stringValue });
    ls.set('id', stringValue);
  }
  setDiscounts = (discountArray) => {
    this.setState({ discounts: discountArray });
    ls.set('discounts', discountArray);
  }
  /////////////////////////////////////////////////////////////

  ////// authentication  //////////////////////////////////////
  login = (name, email, password, jwt, id, discounts) => {
    this.setName(name);
    this.setEmail(email);
    this.setPassword(password);
    this.setJwt(jwt);
    this.setId(id);
    this.setDiscounts(discounts);
    this.setIsLoggedIn(true);
  }

  logout = () => {
    this.setEmail("");
    this.setPassword("");
    this.setName("");
    this.setJwt("");
    this.setId("");
    this.setDiscounts([]);
    this.setIsLoggedIn(false);
    ls.set("displayTab", 0);
  }
  ////////////////////////////////////////////////////////////////

  render() {
    return (
      <div>
        {this.state.isClient && (<div className="app app-client">
          {this.state.isLoggedIn && (
            (this.state.isClient && (<ClientApp setIsClient={this.setIsClient} logout={this.logout} email={this.state.email} name={this.state.name} password={this.state.password} discounts={this.state.discounts} />)) ||
            (!this.state.isClient && (<BussinessApp setIsClient={this.setIsClient} logout={this.logout} email={this.state.email} name={this.state.name} password={this.state.password} id={this.state.id} setJwt={this.setJwt} />))
          )}

          {!this.state.isLoggedIn && (
            (this.state.isClient && (<ClientLogin setIsClient={this.setIsClient} login={this.login} />)) ||
            (!this.state.isClient && (<BussinessLogin setIsClient={this.setIsClient} login={this.login} />))
          )}
        </div>)}

        {!this.state.isClient && (<div className="app">
          {this.state.isLoggedIn && (
            (this.state.isClient && (<ClientApp setIsClient={this.setIsClient} logout={this.logout} email={this.state.email} name={this.state.name} password={this.state.password} discounts={this.state.discounts} />)) ||
            (!this.state.isClient && (<BussinessApp setIsClient={this.setIsClient} logout={this.logout} email={this.state.email} name={this.state.name} password={this.state.password} id={this.state.id} setJwt={this.setJwt} />))
          )}

          {!this.state.isLoggedIn && (
            (this.state.isClient && (<ClientLogin setIsClient={this.setIsClient} login={this.login} setDiscounts={this.setDiscounts} />)) ||
            (!this.state.isClient && (<BussinessLogin setIsClient={this.setIsClient} login={this.login} />))
          )}
        </div>)}





        {this.state.isClient && (<footer className="footer-client">
          <p className="copyright">Barsan Alexandru, Stafie Stefan © 2021 CC</p>
          <p className="app_name">Promo App</p>
          <p>Call center support: 0765 432 100</p>
        </footer>)}

        {!this.state.isClient && (<footer>
          <p className="copyright">Barsan Alexandru, Stafie Stefan © 2021 CC</p>
          <p className="app_name">Promo App</p>
          <p>Call center support: 0765 432 100</p>
        </footer>)}

      </div>
    );
  }
}
export default App;
