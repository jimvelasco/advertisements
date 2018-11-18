import React, { Component } from "react";
import PropTypes from "prop-types";
import { withRouter } from "react-router-dom";
import axios from "axios";

import { connect } from "react-redux";

// import { createAdvertisement } from "../../actions/advertisementActions";
// import { modifyAdvertisement } from "../../actions/advertisementActions";

import { createBusiness } from "../../actions/advertiseActions";
import { modifyBusiness } from "../../actions/advertiseActions";
import { getBusiness } from "../../actions/advertiseActions";
//import axios from "axios";
//import classnames from "classnames";

import TextFieldGroup from "../common/TextFieldGroup";
import SelectListGroup from "../common/SelectListGroup";
import ImageDisplay from "../common/ImageDisplay";

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
      imageFilename: null
    };

    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.onFileInputChange = this.onFileInputChange.bind(this);
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
      // setState triggers a render
    }
  }

  onChange(e) {
    this.setState({ [e.target.name]: e.target.value });
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

    // this is the redux way.
    // the register user is in authActions
    const id = this.props.match.params.id;
    if (id) {
      this.props.modifyBusiness(formdata, this.props.history);
    } else {
      this.props.createBusiness(formdata, this.props.history);
    }
    // we add this.props.history so the authActions will have it and be able to redirect

    // console.log(newUser);
    // axios
    //   .post("/api/users/register", newUser)
    //   .then(res => console.log(res.data))
    //   //.catch(err => console.log(err.response.data)); // to get actual errors from backend
    //   .catch(err => this.setState({ errors: err.response.data })); // to get actual errors from backend

    // this.props.registerUser(newUser, this.props.history);
  }

  render() {
    const { errors } = this.state;
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
            <div
              className="col-md-8 m-auto"
              style={{
                border: "0px solid black"
              }}
            >
              <h1 className="display-4 text-center">{title} Business</h1>
              <h3 />

              <form noValidate onSubmit={this.onSubmit}>
                <div className="form-group">
                  <TextFieldGroup
                    type="text"
                    label="Name"
                    placeholder="Name"
                    name="name"
                    value={this.state.name}
                    onChange={this.onChange}
                    error={errors.name}
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
                  <SelectListGroup
                    label="Category"
                    name="category"
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
                <input type="submit" className="btn btn-info btn-block mt-4" />
              </form>
              <div className="xinvalid-feedback">
                {this.state.errors.errormessage}
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
  errors: state.errors
});
// the state.auth above comes from rootReducer in index.js in reducers.

export default connect(
  mapStateToProps,
  { createBusiness, modifyBusiness, getBusiness }
)(withRouter(Business));
// wrap the Register with withRouter so the authAction can use history to redirect
