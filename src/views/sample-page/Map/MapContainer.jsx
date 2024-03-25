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
        {this.props.props.map((item) => {
          return (
            <Marker
              title={item.time}
              name={item.time}
              position={{ lat: item.coords.lat, lng: item.coords.lng }} />
          )
        })}
      </Map>

    );
  }
}

export default GoogleApiWrapper({
  apiKey: ("AIzaSyDqdW6bK270KIlO7mBee544JijS5CUXWg8"),
})(MapContainer)



