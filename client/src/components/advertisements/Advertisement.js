import React, { Component } from "react";
import PropTypes from "prop-types";
import { withRouter } from "react-router-dom";

import { connect } from "react-redux";
import { createAdvertisement } from "../../actions/advertisementActions";

//import axios from "axios";
//import classnames from "classnames";

import TextFieldGroup from "../common/TextFieldGroup";

class Advertisement extends Component {
  constructor() {
    super();
    this.state = {
      name: "",
      email: "",
      description: "",
      image: "",
      telephone: "",
      address: "",
      city: "",
      state: "",
      zip: "",
      latitude: "",
      longitude: "",
      ownerid: "",
      status: 0,
      errors: {}
    };

    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  componentDidMount() {
    // if (this.props.auth.isAuthenticated) {
    //   this.props.history.push("/dashboard");
    // }
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

  onSubmit(e) {
    e.preventDefault();

    const newAdvertisement = {
      name: this.state.name,
      email: this.state.email,
      description: this.state.description,
      image: this.state.image,
      address: this.state.address,
      city: this.state.city,
      state: this.state.state,
      zip: this.state.zip,
      latitude: this.state.latitude,
      longitude: this.state.longitude,
      ownerid: this.props.auth.user.id,
      status: this.state.status
    };

    // this is the redux way.
    // the register user is in authActions
    this.props.createAdvertisement(newAdvertisement, this.props.history);
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

    return (
      <div className="register">
        <div className="container">
          <div className="row">
            <div className="col-md-8 m-auto">
              <h1 className="display-4 text-center">Advertisement</h1>
              <p className="lead text-center">Create an Advertisement</p>
              <form noValidate onSubmit={this.onSubmit}>
                <div className="form-group">
                  <TextFieldGroup
                    type="text"
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
                    placeholder="Image"
                    name="image"
                    value={this.state.image}
                    onChange={this.onChange}
                    error={errors.image}
                  />
                </div>

                <div className="form-group">
                  <TextFieldGroup
                    type="text"
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
                    placeholder="Longitude"
                    name="longitude"
                    value={this.state.longitude}
                    onChange={this.onChange}
                    error={errors.longitude}
                  />
                </div>
                <input type="submit" className="btn btn-info btn-block mt-4" />
              </form>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

// this is good practice because it will help debugging
// it is not checked when in production mode.
Advertisement.propTypes = {
  createAdvertisement: PropTypes.func.isRequired,
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
  { createAdvertisement }
)(withRouter(Advertisement));
// wrap the Register with withRouter so the authAction can use history to redirect
