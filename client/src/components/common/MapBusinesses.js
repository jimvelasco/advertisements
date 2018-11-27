import React, { Component } from "react";
import { connect } from "react-redux";
import axios from "axios";
import {
  withGoogleMap,
  GoogleMap,
  Marker,
  InfoWindow
} from "react-google-maps";
import { getBusinesses } from "../../actions/advertiseActions";

const posobj = { lat: 40.485, lng: -106.8317 };
const GoogleMapExample = withGoogleMap(props => (
  <GoogleMap defaultCenter={posobj} defaultZoom={15}>
    {props.markers.map((marker, index) => (
      <Marker
        key={index}
        position={{ lat: marker.lat, lng: marker.lng }}
        onClick={props.onMarkerClick.bind(this, marker.id)}
      >
        {marker.show && (
          <InfoWindow onCloseClick={props.onCloseClick.bind(this, marker.id)}>
            <div>
              <div className="marker-text">
                <b>{marker.name}</b>
              </div>
              <div className="marker-text">{marker.adname}</div>
              <div className="marker-text">{marker.addesc}</div>
              <div className="marker-text">{marker.addisc}</div>
            </div>
          </InfoWindow>
        )}
      </Marker>
    ))}
  </GoogleMap>
));

class MapLookup extends Component {
  constructor(props) {
    super(props);
    this.state = { curmarkerid: "", markers: [], lat: null, lon: null };
    //console.log(props);
    // console.log("Dashboard props", props);
    let lat = null;
    this.handleClick = this.handleClick.bind(this);
    this.handleMarkerClick = this.handleMarkerClick.bind(this);
    this.handleCloseClick = this.handleCloseClick.bind(this);
  }

  componentDidMount() {
    //let link = "/api/business/businesses";
    let link = "/api/business/business_map";
    axios
      .get(link)
      .then(res => {
        // dispatch({ type: SET_CURRENT_ADVERTISEMENT, payload: res.data });
        console.log(res.data);
        let bizes = res.data;
        let mary = [];
        bizes.map((biz, index) => {
          let ads = biz.ads[0];
          mary.push({
            lat: biz.latitude,
            lng: biz.longitude,
            name: biz.name,
            adname: ads.name,
            addesc: ads.description,
            addisc: ads.discount,
            id: biz._id,
            show: false
          });
          this.setState({ markers: mary });
        });
      })
      // thunk lets us do a dispatch
      // .then(res => console.log(res.data))
      .catch(err => {
        console.log("triggering error in actions", err.message);
      });
  }

  componentWillReceiveProps(nextProps) {
    //console.log("manage photos current props ", this.props);
    console.log("business map nextProps ", nextProps);
    // let bizes = nextProps.advertise.businesses;
    // let mary = [];
    // bizes.map((biz, index) => {
    //   mary.push({
    //     lat: biz.latitude,
    //     lng: biz.longitude,
    //     name: biz.name,
    //     id: biz._id,
    //     show: false
    //   });

    //   this.setState({ markers: mary });
    // });
    //console.log("maps next props cdm", nextProps);
    //this.setState({ lat: nextProps.lat, lon: nextProps.lon });
  }

  // handleClick(event) {
  //   //this.setState({ [e.target.name]: e.target.value });
  //   let lat = event.latLng.lat();
  //   let lng = event.latLng.lng();
  //   //console.log(lat + " " + lng);
  //   this.props.handleMapClick(lat, lng);
  // }

  handleClick(e) {
    console.log("hc e", e);
    e.preventDefault();
  }
  handleCloseClick(bizid) {
    console.log("handleCloseClick e", bizid);
    // e.preventDefault();
    let smarkers = this.state.markers;
    smarkers.map((marker, index) => {
      if (marker.id === bizid) {
        marker.show = false;
      }
    });

    this.setState({ markers: smarkers });
  }

  handleMarkerClick(bizid) {
    //console.log("hmc clicked ", e);
    // e.preventDefault();
    //this.setState({ [e.target.name]: e.target.value });
    // let lat = event.latLng.lat();
    // let lng = event.latLng.lng();
    let smarkers = this.state.markers;
    smarkers.map((marker, index) => {
      if (marker.id === bizid) {
        if (marker.show) {
          marker.show = false;
        } else {
          marker.show = true;
        }
      }
    });

    this.setState({ markers: smarkers });

    //console.log("marker clicked index ", bizid);
    // this.props.handleMapClick(lat, lng);
  }

  render() {
    //console.log("maplookup props", this.props);
    console.log("mapbusines render");
    let { lat } = this.state;
    let { lon } = this.state;
    let posobj = { lat: 40.485, lng: -106.8317 };
    let posobj2 = { lat: 40.485, lng: -106.8317 };
    let cposobj = { lat: 40.4863, lng: -106.8328 };
    console.log("render state is ", this.state);

    // const { businesses } = this.props.advertise;
    // let mary = [];
    // businesses.map((business, index) => {
    //   mary.push({
    //     lat: business.latitude,
    //     lng: business.longitude,
    //     name: business.name,
    //     id: business._id,
    //     show: false
    //   });
    //   console.log(business);
    // });

    if (lat) {
      posobj = { lat: lat, lng: lon };
    }

    let themarkers = this.state.markers;

    // const GoogleMapExample = withGoogleMap(props => (
    //   <GoogleMap defaultCenter={posobj} defaultZoom={15}>

    //     {props.markers.map((marker, index) => (
    //       <Marker
    //         key={index}
    //         position={{ lat: marker.lat, lng: marker.lng }}
    //         onClick={props.onMarkerClick.bind(this, marker.id)}
    //       >
    //         {marker.show && (
    //           <InfoWindow>
    //             <div className="marker-text">{marker.name}</div>
    //           </InfoWindow>
    //         )}
    //       </Marker>
    //     ))}

    //     {/* <Marker position={posobj} />; */}
    //     {/* <Marker position={cposobj} /> */}
    //   </GoogleMap>
    // ));
    // GoogleMapExample.addListener('click'), (evt) => {
    //   console.log('click');
    // })

    return (
      <div>
        <h4 style={{ textAlign: "center" }}>Business Locations</h4>

        <div className="row">
          <div className="col-md-10 offset-md-1 ">
            <GoogleMapExample
              containerElement={
                <div style={{ height: `500px`, width: "100%" }} />
              }
              mapElement={<div style={{ height: `100%` }} />}
              markers={themarkers}
              onMarkerClick={this.handleMarkerClick}
              onCloseClick={this.handleCloseClick}
            />
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
  { getBusinesses }
)(MapLookup);
