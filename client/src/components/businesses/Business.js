import React, { Component } from "react";
import PropTypes from "prop-types";
import { withRouter } from "react-router-dom";
import axios from "axios";

import { connect } from "react-redux";

// import { createAdvertisement } from "../../actions/advertisementActions";
// import { modifyAdvertisement } from "../../actions/advertisementActions";

import { createBusiness } from "../../actions/advertisementActions";
import { modifyBusiness } from "../../actions/advertisementActions";
//import axios from "axios";
//import classnames from "classnames";

import TextFieldGroup from "../common/TextFieldGroup";
import SelectListGroup from "../common/SelectListGroup";

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
      image: "",
      photo: "",
      category: "",
      telephone: "",
      address: "",
      city: "",
      state: "",
      zip: "",
      latitude: "",
      longitude: "",
      ownerid: "",
      status: 0,
      errors: {},
      file: null,
      fname: null,
      statusmsg: null,
      imageBuffer: null
    };

    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.onFileInputChange = this.onFileInputChange.bind(this);
  }

  componentDidMount() {
    // if (this.props.auth.isAuthenticated) {
    //   this.props.history.push("/dashboard");
    // }

    const id = this.props.match.params.id;
    if (id) {
      let link = `/api/business/find-business/${id}`;
      axios
        .get(link)
        //.then(res => this.setState(res.data))
        .then(res =>
          //console.log(res.data),
          //let obj = res.data[0],
          // this.setState({ name: res.data[0].name })
          this.setState({
            id: id,
            name: res.data[0].name,
            email: res.data[0].email,
            description: res.data[0].description,
            image: res.data[0].image,
            photo: res.data[0].photo,
            phone: res.data[0].phone,
            category: res.data[0].category,
            address: res.data[0].address,
            city: res.data[0].city,
            state: res.data[0].state,
            zip: res.data[0].zip,

            latitude: res.data[0].latitude,
            longitude: res.data[0].longitude
          })
        )
        .catch(err => console.log(err.response.data)); // to get actual errors from backend
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
    console.log(e.target.files[0]);
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

    const anAdvertisement = {
      id: this.state.id,
      name: this.state.name,
      email: this.state.email,
      description: this.state.description,
      image: this.state.image,
      photo: this.state.photo,
      category: this.state.category,
      phone: this.state.phone,
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
    const id = this.props.match.params.id;
    if (id) {
      this.props.modifyBusiness(anAdvertisement, this.props.history);
    } else {
      this.props.createBusiness(anAdvertisement, this.props.history);
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
                  <TextFieldGroup
                    type="text"
                    label="Image"
                    placeholder="Image"
                    name="image"
                    value={this.state.image}
                    onChange={this.onChange}
                    error={errors.image}
                  />
                </div>

                <div className="form-group">
                  <div className="row">
                    <div className="col-md-3">Image</div>
                    <div className="col-md-3">{this.state.image}</div>
                    <div className="col-md-6">
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
                    label="Photo"
                    placeholder="Photo"
                    name="photo"
                    value={this.state.photo}
                    onChange={this.onChange}
                    error={errors.photo}
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
  { createBusiness, modifyBusiness }
)(withRouter(Business));
// wrap the Register with withRouter so the authAction can use history to redirect
