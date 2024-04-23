import { Map, Marker, GoogleApiWrapper } from 'google-maps-react';
import { Component } from 'react';

export class MapContainer extends Component {
  render() {
    return (

      <Map
        google={this.props.google}
        zoom={12}
        initialCenter={{
          lat: -3.71839,
          lng: -38.5434
        }}>
          {console.log(this.props.props)}
          <Marker
            title={this.props.props.time}
            name={this.props.props.time}
            position={{ lat: this.props.props.lat, lng: this.props.props.lng }} />
      </Map>

    );
  }
}

export default GoogleApiWrapper({
  apiKey: ("AIzaSyDqdW6bK270KIlO7mBee544JijS5CUXWg8"),
})(MapContainer)



