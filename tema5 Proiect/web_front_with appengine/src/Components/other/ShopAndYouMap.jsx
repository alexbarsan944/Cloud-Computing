import React, { Component } from 'react';
import GoogleMapReact from 'google-map-react';
import youIcon from '../other/you_icon.png';
import shopIcon from '../other/shop_icon.png';


const ShopMarker = () => <img src={shopIcon} className="marker" />;
const YouMarker = () => <img src={youIcon} className="marker" />;

class ShopAndYouMap extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "",
      gotLocation: false,
      error: ""
    };
    this.you = {
      lat: 0,
      lng: 0,
    };
    this.address = "";
    this.shop = {
      lat: 0,
      lng: 0,
    };
  }

  changeName = (stringValue) => {
    this.setState({ gotLocation: false, name: stringValue });
  }

  getMyLocation = () => {
    const requestOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
    };
    // first fetch for user locations
    fetch('https://www.googleapis.com/geolocation/v1/geolocate?key=AIzaSyA5Dffrqqj2a8TSdqQI_8-gX7MIh5zBq5E', requestOptions)
      .then(response => {
        if (response.status !== 200) {
          this.setState({ error: "Map could not load: Too many requests" })
        }
        return response.json();
      })
      .then(data => {
        if (data.location !== null) {
          this.you = {
            lat: data.location.lat,
            lng: data.location.lng
          }


          const requestOptions2 = {
            method: 'GET',
            mode: 'cors',
            headers: {
              'Content-Type': 'application/json'
            },
          };
          fetch('https://europe-central2-web-front-314907.cloudfunctions.net/function-1?lat=' + this.you.lng + '&lng=' + this.you.lat + '&name=' + this.state.name + '', requestOptions)
            .then(response2 => {
              if (response2.status !== 200) {
                this.setState({ error: "Map could not load: Too many requests" })
              }
              return response2.json();
            })
            .then(data2 => {
              if (data2.candidates[0]) {
                console.log(data2)
                this.setState({
                  gotLocation: true,
                });
                this.shop = {
                  lat: data2.candidates[0].geometry.location.lat,
                  lng: data2.candidates[0].geometry.location.lng
                };
                this.props.setAddress(data2.candidates[0].formatted_address)
              } else {
                this.setState({ error: "Map could not load" })
              }
            })

        } else {
          this.setState({ error: "Map could not load" })
        }
      })
  }


  render() {
    if (this.state.name === "") {
      return <div>Please select a discount</div>
    }

    if (!this.state.gotLocation) {
      this.getMyLocation();
      return <div style={{ height: '400px', width: '400px' }}>Map loading</div>
    }

    return (
      <div className="shop-map" style={{ height: '400px', width: '400px' }}>
        {this.state.gotLocation && (
          <GoogleMapReact
            bootstrapURLKeys={{ key: "AIzaSyA5Dffrqqj2a8TSdqQI_8-gX7MIh5zBq5E" }}
            defaultCenter={{
              lat: this.shop.lat,
              lng: this.shop.lng
            }}
            zoom={14}
          >

            <YouMarker
              lat={this.you.lat}
              lng={this.you.lng}
            />

            <ShopMarker
              lat={this.shop.lat}
              lng={this.shop.lng}
            />
          </GoogleMapReact>
        )}
      </div>
    );
  }
}

export default ShopAndYouMap;