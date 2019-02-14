import React, { Component } from "react";
import PropTypes from "prop-types";
import { withRouter } from "react-router-dom";
import axios from "axios";

import { connect } from "react-redux";

import PlacesAutocomplete from "reactjs-places-autocomplete";
import {
  geocodeByAddress,
  geocodeByPlaceId,
  getLatLng
} from "react-places-autocomplete";

import isEmpty from "../../validation/is-empty";

import categoryHelper from "../../config/categoryHelper";

// import { createAdvertisement } from "../../actions/advertisementActions";
// import { modifyAdvertisement } from "../../actions/advertisementActions";

import { createBusiness } from "../../actions/advertiseActions";
import { modifyBusiness } from "../../actions/advertiseActions";
import { getBusiness } from "../../actions/advertiseActions";
//import axios from "axios";
//import classnames from "classnames";

import TextFieldGroup from "../common/TextFieldGroup";

import SelectCategoryGroup from "../common/SelectCategoryGroup";
import ImageDisplay from "../common/ImageDisplay";
import MapLookup from "../common/MapLookup";

// const validate = values => {
//   const errors = {};
//   if (!values.name) {
//     errors.name = "Business Name is required";
//   } else if (values.name && values.name.trim().length == 0) {
//     errors.name = "Business Name is required";
//   }
//   if (!values.description) {
//     errors.description = "Business Description is required";
//   }
//   if (!values.phone) {
//     errors.phone = "Business Phone is required";
//   }
//   if (!values.email) {
//     errors.email = "Business Email is required";
//   }
//   if (!values.address) {
//     errors.address = "Business Address is required";
//   }
//   if (!values.city) {
//     errors.city = "Business City is required";
//   }
//   if (!values.state) {
//     errors.state = "Business State is required";
//   }
//   if (!values.zip) {
//     errors.zip = "Business Zip is required";
//   }
//   if (!values.latitude) {
//     errors.latitude = "Business Latitude is required";
//   }
//   if (!values.longitude) {
//     errors.longitude = "Business Longitude is required";
//   }
//   if (!values.file) {
//     errors.file = "Business Logo is required";
//   }
//   return errors;
// };

class Business extends Component {
  constructor(props) {
    super(props);
    // console.log("props in advertisement", props);
    // console.log("id is", this.props.match.params.id);

    this.state = {
      id: "",
      name: "",
      email: "",
      description: "",
      phone: "",
      category: "",
      address: "",
      city: "",
      state: "",
      zip: "",
      latitude: "",
      longitude: "",
      advertiserId: "",
      status: 0,
      errors: {},
      file: null,
      fname: null,
      statusmsg: null,
      imageBuffer: null,
      imageWidth: null,
      imageHeight: null,
      imageFilename: null,
      lookup: "",
      cat0_list: categoryHelper.getCat0()
    };

    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.onFileInputChange = this.onFileInputChange.bind(this);
    this.handleMapClick = this.handleMapClick.bind(this);
  }
  xxcomponentDidMount() {
    const id = this.props.match.params.id;
    console.log("here is the modigy business id", id);
    if (id) {
      this.props.getBusiness(id);
    }
  }
  componentDidMount() {
    // if (this.props.auth.isAuthenticated) {
    //   this.props.history.push("/dashboard");
    // }

    //5be5fecd99d2840d0a58ea75

    const id = this.props.match.params.id;
    // console.log("here is the modigy business id", id);
    if (id) {
      let link = `/api/business/find-business/${id}`;
      axios
        .get(link)
        //.then(res => this.setState(res.data))
        .then(res => {
          // console.log(res.data);
          //let obj = res.data[0],
          // this.setState({ name: res.data[0].name })
          let business = res.data[0];
          let image = res.data[1];
          this.setState({
            errors: {},
            id: id,
            name: business.name,
            email: business.email,
            description: business.description,
            phone: business.phone,
            category: business.category,
            address: business.address,
            city: business.city,
            state: business.state,
            zip: business.zip,
            latitude: business.latitude,
            longitude: business.longitude,
            imageBuffer: image.imageBuffer,
            imageWidth: image.width,
            imageHeight: image.height,
            imageFilename: image.imageFilename
          });
        })
        .catch(err => {
          let errors = {};
          errors.errormsg = "Problem Getting Businesses";
          this.setState({ errors: errors });
        }); // to get actual errors from backend
      //this.setState({ name: "yippee" });
    }
  }

  // if we have errors this will run
  componentWillReceiveProps(nextProps) {
    //console.log("register componentWillReceiveProps");
    if (nextProps.errors) {
      this.setState({ errors: nextProps.errors });
    }
  }

  onChange(e) {
    this.setState({ [e.target.name]: e.target.value });
  }
  handleMapClick(lat, lon) {
    let slat = lat.toString();
    let slon = lon.toString();
    this.setState({ latitude: lat, longitude: lon });
  }

  onFileInputChange(e) {
    // console.log(e.target.files[0]);
    if (e.target.files[0]) {
      //let fileurlobj = URL.createObjectURL(e.target.files[0]);
      this.setState({
        file: e.target.files[0],
        //fileurl: fileurlobj,
        statusmsg: ""
      });
    }
  }

  onSubmit(e) {
    e.preventDefault();
    // let err = validate(this.state);
    // console.log(err);
    // console.log("is empty", isEmpty(err));
    // if (!isEmpty(err)) {
    //   this.setState({ errors: err });
    //   console.log("we are returning");
    //   console.log("we are returning errors", this.state.errors);
    //   return;
    // }

    // console.log("we are not returning why");

    let formdata = new FormData();
    formdata.append("file", this.state.file);
    formdata.append("filename", "another");
    formdata.append("id", this.state.id);
    formdata.append("name", this.state.name);
    formdata.append("email", this.state.email);
    formdata.append("description", this.state.description);
    formdata.append("category", this.state.category);
    formdata.append("phone", this.state.phone);
    formdata.append("address", this.state.address);
    formdata.append("city", this.state.city);
    formdata.append("state", this.state.state);
    formdata.append("zip", this.state.zip);
    formdata.append("latitude", this.state.latitude);
    formdata.append("longitude", this.state.longitude);
    formdata.append("advertiserId", this.props.auth.user.id);
    formdata.append("owneremail", this.props.auth.user.email);
    formdata.append("status", this.state.status);

    const id = this.props.match.params.id;

    //let err = validate(this.state);
    // console.log(err);
    // console.log("is empty", isEmpty(err));
    // if (isEmpty(err)) {
    //console.log("we are submitting data");
    if (id) {
      this.props.modifyBusiness(formdata, this.props.history);
    } else {
      this.props.createBusiness(formdata, this.props.history);
    }
    // } else {
    //   //console.log("we are NOT submitting data");
    //   this.setState({ errors: err });
    // }
  }

  // autocomplete methods

  //40.488231319769206
  //-106.83197827918531

  handleChange = name => {
    this.setState({ name });
    console.log("handleChange", name);
  };

  handleSelect = name => {
    //console.log("handleSelect", lookup);
    let rary = name.split(",");
    let tname = rary[0];
    this.setState({
      name: tname
      // lookup: tname
    });

    geocodeByAddress(name)
      .then(results => {
        let r0 = results[0];
        console.log("geocode results", results[0]);
        let rary = r0.address_components;
        let address = rary[0].short_name + " " + rary[1].short_name;
        let city = rary[2].short_name;
        let state = rary[4].short_name;
        let zip = rary[6].short_name;
        this.setState({
          address: address,
          city: city,
          state: state,
          zip: zip
        });

        // let latlng = getLatLng(r0);
        let llpromise = getLatLng(r0);
        llpromise
          .then(latLng => {
            //console.log(latLng);
            this.setState({
              latitude: latLng["lat"],
              longitude: latLng["lng"]
            });
          })
          .catch(error => console.error("Error", error));
      })
      .catch(error => console.error("Error", error));
  };

  render() {
    const { errors } = this.state;
    const perrors = this.props.errors;
    const lat = this.state.latitude;
    const lon = this.state.longitude;

    // const searchOptions = {
    //   location: { lat: 40.488231319769206, lng: -106.83197827918531 },
    //   radius: 2000,
    //   types: ["address"]
    // };

    // const searchOptions = {
    //   location: new google.maps.LatLng(-34, 151),
    //   radius: 2000,
    //   types: ["address"]
    // };

    // const searchOptions = {
    //   types: ["food", "bar", "cafe", "restaurant", "bakery", "lodging"]
    // };

    //const searchOptions = { types: ["locality"] };
    const searchOptions = {};

    // same as const errors = this.state.errors

    // this was used to show user from props
    // const { user } = this.props.auth; // const user = this.props.auth.user
    // this shows user {user ? user.name : null}
    let title = "Create";
    const id = this.props.match.params.id;
    if (id) {
      title = "Modify";
    }

    let hasimage = false;
    if (this.state.imageBuffer) {
      hasimage = true;
    }

    return (
      <div className="register">
        <div className="container">
          <div className="row">
            <div className="col-md-8 m-auto shadow-lg p-4">
              <h2 className=" text-center">{title} Business</h2>

              <form noValidate onSubmit={this.onSubmit}>
                <div className="form-group">
                  <div className="row">
                    <div className="col-md-3">Name</div>
                    <div className="col-md-9">
                      <PlacesAutocomplete
                        value={this.state.name}
                        onChange={this.handleChange}
                        onSelect={this.handleSelect}
                        searchOptions={searchOptions}
                      >
                        {({
                          getInputProps,
                          suggestions,
                          getSuggestionItemProps,
                          loading
                        }) => (
                          <div>
                            <input
                              {...getInputProps({
                                placeholder: "Search Business Names ...",
                                className:
                                  "location-search-input form-control form-control-sm"
                              })}
                            />
                            <div className="autocomplete-dropdown-container">
                              {loading && <div>Loading...</div>}
                              {suggestions.map(suggestion => {
                                const className = suggestion.active
                                  ? "suggestion-item--active"
                                  : "suggestion-item";
                                // inline style for demonstration purpose
                                const style = suggestion.active
                                  ? {
                                      backgroundColor: "#c0c0c0",
                                      cursor: "pointer"
                                    }
                                  : {
                                      backgroundColor: "#ffffff",
                                      cursor: "pointer"
                                    };
                                return (
                                  <div
                                    {...getSuggestionItemProps(suggestion, {
                                      className,
                                      style
                                    })}
                                  >
                                    <span>{suggestion.description}</span>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        )}
                      </PlacesAutocomplete>
                      {errors.name && (
                        <div
                          className="xform-control xform-control-sm xinvalid-feedback  xis-invalid"
                          style={{
                            display: "block",
                            color: "#dc3545",
                            fontSize: "10pt"
                          }}
                        >
                          {errors.name}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="form-group">
                  <SelectCategoryGroup
                    label="Category"
                    name="category"
                    list={this.state.cat0_list}
                    value={this.state.category}
                    onChange={this.onChange}
                    error={errors.category}
                  />
                </div>

                <div className="form-group">
                  <TextFieldGroup
                    type="text"
                    label="Description"
                    placeholder="Description"
                    name="description"
                    value={this.state.description}
                    onChange={this.onChange}
                    error={errors.description}
                  />
                </div>

                <div className="form-group">
                  <TextFieldGroup
                    type="text"
                    label="Phone"
                    placeholder="Phone"
                    name="phone"
                    value={this.state.phone}
                    onChange={this.onChange}
                    error={errors.phone}
                  />
                </div>
                <div className="form-group">
                  <TextFieldGroup
                    type="email"
                    label="Email"
                    placeholder="Email Address"
                    name="email"
                    value={this.state.email}
                    onChange={this.onChange}
                    error={errors.email}
                  />
                </div>

                <div className="form-group">
                  <TextFieldGroup
                    type="text"
                    label="Address"
                    placeholder="Address"
                    name="address"
                    value={this.state.address}
                    onChange={this.onChange}
                    error={errors.address}
                  />
                </div>

                <div className="form-group">
                  <TextFieldGroup
                    type="text"
                    label="City"
                    placeholder="City"
                    name="city"
                    value={this.state.city}
                    onChange={this.onChange}
                    error={errors.city}
                  />
                </div>
                <div className="form-group">
                  <TextFieldGroup
                    type="text"
                    label="State"
                    placeholder="State"
                    name="state"
                    value={this.state.state}
                    onChange={this.onChange}
                    error={errors.state}
                  />
                </div>
                <div className="form-group">
                  <TextFieldGroup
                    type="text"
                    label="Zip"
                    placeholder="Zip"
                    name="zip"
                    value={this.state.zip}
                    onChange={this.onChange}
                    error={errors.zip}
                  />
                </div>
                <div className="form-group">
                  <TextFieldGroup
                    type="text"
                    label="Latitude"
                    placeholder="Latitude"
                    name="latitude"
                    value={this.state.latitude}
                    onChange={this.onChange}
                    error={errors.latitude}
                  />
                </div>
                <div className="form-group">
                  <TextFieldGroup
                    type="text"
                    label="Longitude"
                    placeholder="Longitude"
                    name="longitude"
                    value={this.state.longitude}
                    onChange={this.onChange}
                    error={errors.longitude}
                  />
                </div>
                <div className="form-group">
                  <div className="row">
                    <div className="col-md-3">Image</div>
                    <div className="col-md-4">
                      {this.state.image}
                      {hasimage ? (
                        <ImageDisplay
                          buf={this.state.imageBuffer}
                          width={this.state.imageWidth}
                          height={this.state.imageHeight}
                          filename={this.state.imageFilename}
                        />
                      ) : (
                        <div>No Logo</div>
                      )}
                      {errors.file && (
                        <div
                          style={{
                            display: "block",
                            color: "#dc3545",
                            fontSize: "10pt"
                          }}
                        >
                          {errors.file}
                        </div>
                      )}
                    </div>
                    <div className="col-md-5">
                      <input
                        type="file"
                        name="file"
                        onChange={this.onFileInputChange}
                      />
                    </div>
                  </div>
                </div>
                <input type="submit" className="btn btn-info btn-block mt-4" />
              </form>
              {perrors && (
                <div className="error-display">{perrors.message}</div>
              )}
              <div className="row" style={{ marginTop: "20px" }}>
                <div className="col-md-12">
                  <MapLookup
                    handleMapClick={this.handleMapClick}
                    lat={lat}
                    lon={lon}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

// this is good practice because it will help debugging
// it is not checked when in production mode.
Business.propTypes = {
  createBusiness: PropTypes.func.isRequired,
  modifyBusiness: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired
};

// map errors to this component
// then we can use this.props.auth.user etc
// since we mapped error, we can use componentWillReceiveProps method
const mapStateToProps = state => ({
  auth: state.auth,
  errors: state.errors,
  advertise: state.advertise
});
// the state.auth above comes from rootReducer in index.js in reducers.

export default connect(
  mapStateToProps,
  { createBusiness, modifyBusiness, getBusiness }
)(withRouter(Business));
// wrap the Register with withRouter so the authAction can use history to redirect
