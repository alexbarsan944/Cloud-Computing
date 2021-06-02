import React, { Component } from 'react';
import GoogleMapReact from 'google-map-react';
import marker from '../other/you_icon.png';


const YouMarker = () => <img src={marker} className="marker" />;

class YourMap extends Component {
  constructor(props) {
    super(props);
    this.state = {
      gotLocation: false,
      lat: 0,
      lng: 0,
      zoom: 14
    };
    this._isMounted = false;
  }
  componentDidMount() {
    this._isMounted = true;
    this._isMounted && this.getMyLocation();
  }
  componentWillUnmount() {
    this._isMounted = false;
  }
  getMyLocation = () => {
    const requestOptions = {
      method: 'POST',

      headers: {
        'Content-Type': 'application/json'
      },
    };
    fetch('https://www.googleapis.com/geolocation/v1/geolocate?key=AIzaSyA5Dffrqqj2a8TSdqQI_8-gX7MIh5zBq5E', requestOptions)
      .then(response => response.json())
      .then(data => {
        if (data.location !== null) {
          this._isMounted && this.setState({
            gotLocation: true,
            lat: data.location.lat,
            lng: data.location.lng
            // zoom: data.accuracy
          })
        }
      })
  }
  render() {
    return (
      <div style={{ height: '200px', width: '400px' }}>
        {this.state.gotLocation && (<GoogleMapReact
          bootstrapURLKeys={{ key: "AIzaSyA5Dffrqqj2a8TSdqQI_8-gX7MIh5zBq5E" }}
          defaultCenter={{
            lat: this.state.lat,
            lng: this.state.lng
          }}
          defaultZoom={this.state.zoom}
        >

          <YouMarker
            lat={this.state.lat}
            lng={this.state.lng}
          />
        </GoogleMapReact>)}
      </div>
    );
  }
}

export default YourMap;