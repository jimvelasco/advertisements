import React, { Component } from "react";
import PropTypes from "prop-types";
import { withRouter } from "react-router-dom";

import { connect } from "react-redux";
import { registerAdvertiser } from "../../actions/authActions";

//import axios from "axios";
//import classnames from "classnames";

import TextFieldGroup from "../common/TextFieldGroup";

class Register extends Component {
  constructor() {
    super();
    this.state = {
      name: "",
      email: "",
      password: "",
      password2: "",
      company: "",
      companyId: "",
      role: "",
      status: 0,
      errors: {}
    };

    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  componentDidMount() {
    if (this.props.auth.isAuthenticated) {
      this.props.history.push("/dashboard");
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

  onSubmit(e) {
    e.preventDefault();

    const newAdvertiser = {
      name: this.state.name,
      email: this.state.email,
      password: this.state.password,
      password2: this.state.password2,
      company: this.state.company,
      companyId: this.state.companyId,
      role: this.state.role,
      status: this.state.status
    };

    // this is the redux way.
    // the register user is in authActions
    this.props.registerAdvertiser(newAdvertiser, this.props.history);
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
              <h1 className="display-4 text-center">Sign Up</h1>
              <p className="lead text-center">Create your Advertiser account</p>
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
                    placeholder="Company Name"
                    name="company"
                    value={this.state.company}
                    onChange={this.onChange}
                    error={errors.company}
                  />
                </div>
                <div className="form-group">
                  <TextFieldGroup
                    type="text"
                    placeholder="Company Id"
                    name="companyId"
                    value={this.state.companyId}
                    onChange={this.onChange}
                    error={errors.companyId}
                  />
                </div>
                <div className="form-group">
                  <TextFieldGroup
                    type="password"
                    placeholder="Password"
                    name="password"
                    value={this.state.password}
                    onChange={this.onChange}
                    error={errors.password}
                  />
                </div>
                <div className="form-group">
                  <TextFieldGroup
                    type="password"
                    placeholder="Confirm Password"
                    name="password2"
                    value={this.state.password2}
                    onChange={this.onChange}
                    error={errors.password2}
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
Register.propTypes = {
  registerUser: PropTypes.func.isRequired,
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
  { registerAdvertiser }
)(withRouter(Register));
// wrap the Register with withRouter so the authAction can use history to redirect
