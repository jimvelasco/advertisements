import React, { Component } from "react";
import { connect } from "react-redux";
import { withGoogleMap, GoogleMap, Marker } from "react-google-maps";

// let posobj = { lat: 40.485, lng: -106.8317 };
// const GoogleMapExample = withGoogleMap(props => (
//   <GoogleMap defaultCenter={posobj} defaultZoom={15} onClick={props.onClick}>
//     <Marker position={posobj} />
//   </GoogleMap>
// ));

class MapLookup extends Component {
  constructor(props) {
    super(props);
    this.state = { lat: null, lon: null };
    //console.log(props);
    // console.log("Dashboard props", props);
    let lat = null;
    this.handleClick = this.handleClick.bind(this);
  }

  componentDidMount() {
    // console.log("maps cdm", this.props);
    this.setState({ lat: this.props.lat, lon: this.props.lon });
  }

  componentWillReceiveProps(nextProps) {
    //console.log("componentWillReceiveProps photos current props ", this.props);
    //console.log("manage photos nextProps ", nextProps);
    //console.log("maps next props cdm", nextProps);
    this.setState({ lat: nextProps.lat, lon: nextProps.lon });
  }

  handleClick(event) {
    //this.setState({ [e.target.name]: e.target.value });
    let lat = event.latLng.lat();
    let lng = event.latLng.lng();
    console.log(lat + " " + lng);
    this.props.handleMapClick(lat, lng);
  }
  render() {
    //console.log("maplookup props", this.props);
    let { lat } = this.state;
    let { lon } = this.state;
    let posobj = { lat: 40.485, lng: -106.8317 };
    let cposobj = { lat: 40.485, lng: -106.8317 };

    if (lat) {
      posobj = { lat: lat, lng: lon };
    }

    const GoogleMapExample = withGoogleMap(props => (
      <GoogleMap
        defaultCenter={cposobj}
        defaultZoom={15}
        onClick={this.handleClick}
      >
        <Marker position={posobj} />
      </GoogleMap>
    ));

    return (
      <div>
        <h4 style={{ textAlign: "center" }}>Location Lookup</h4>
        <h6 style={{ textAlign: "center" }}>
          (click on map to locate your business)
        </h6>
        <div className="row">
          <div className="col-md-10 offset-md-1 ">
            <GoogleMapExample
              containerElement={
                <div style={{ height: `500px`, width: "100%" }} />
              }
              mapElement={<div style={{ height: `100%` }} />}
              // onClick={this.handleClick}
            >
              onClick = (e) => this.handleClick(e)
            </GoogleMapExample>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  auth: state.auth,
  errors: state.errors,
  advertise: state.advertise
});
// the state.auth above comes from rootReducer in index.js in reducers.

export default connect(
  mapStateToProps,
  null
)(MapLookup);
// wrap the Register with withRouter so the authAction can use history to redirect

//export default Map;

//onClick={(e) => handleClick(e)}

//function handleClick(event) {var lat = event.latLng.lat(), lng = event.latLng.lng()}
