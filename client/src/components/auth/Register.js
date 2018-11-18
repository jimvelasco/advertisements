import React, { Component } from "react";
import PropTypes from "prop-types";
import { withRouter } from "react-router-dom";
import axios from "axios";
import ImageDisplay from "../common/ImageDisplay";

import { connect } from "react-redux";
import { registerAdvertiser } from "../../actions/authActions";
import { modifyAdvertiser } from "../../actions/authActions";

//import axios from "axios";
//import classnames from "classnames";

import TextFieldGroup from "../common/TextFieldGroup";

class Register extends Component {
  constructor(props) {
    super(props);
    this.state = {
      id: "",
      name: "",
      email: "",
      password: "",
      password2: "",
      company: "",
      role: "",
      status: 0,
      changePassword: false,
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
    this.onFileInputChange = this.onFileInputChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  componentDidMount() {
    // if (this.props.auth.isAuthenticated) {
    //   this.props.history.push("/dashboard");
    // }

    const id = this.props.auth.user.id; //this.props.match.params.id;

    console.log("Register cdm id ", id);
    if (id) {
      let link = `/api/users/find-user/${id}`;
      // console.log("component did mount", link);
      axios
        .get(link)
        .then(res => {
          // console.log("cdm data", res);
          // console.log("returned inamge name ", res.data.imageFilename);
          let resdata = res.data[0];
          let img = res.data[1];
          this.setState({
            id: id,
            name: resdata.name,
            email: resdata.email,
            company: resdata.company,
            imageBuffer: img.imageBuffer,
            imageWidth: img.width,
            imageHeight: img.height,
            imageFilename: img.imageFilename
          });
        })
        // .catch(err => console.log(err.res.data));
        .catch(err => console.log(err));
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

  onChange(event) {
    const target = event.target;
    const value = target.type === "checkbox" ? target.checked : target.value;
    const name = target.name;
    // console.log(name + " " + value);

    // this.setState({ [e.target.name]: e.target.value });
    this.setState({ [name]: value });
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

  // const anAdvertiser = {
  //   id: this.state.id,
  //   name: this.state.name,
  //   email: this.state.email,
  //   password: this.state.password,
  //   password2: this.state.password2,
  //   company: this.state.company,
  //   companyId: this.state.companyId,
  //   role: this.state.role,
  //   status: this.state.status,
  //   changePassword: this.state.changePassword
  // };

  // const id = this.props.match.params.id;
  // if (id) {
  //   this.props.modifyAdvertiser(anAdvertiser, this.props.history);
  // } else {
  //   this.props.registerAdvertiser(formdata, this.props.history);
  // }

  // };

  onSubmit = e => {
    e.preventDefault();
    let cpr = "No";
    if (this.state.changePassword) {
      cpr = "Yes";
    }
    let formdata = new FormData();
    formdata.append("file", this.state.file);
    formdata.append("filename", "another");
    formdata.append("id", this.state.id);
    formdata.append("name", this.state.name);
    formdata.append("email", this.state.email);
    formdata.append("password", this.state.password);
    formdata.append("password2", this.state.password2);
    formdata.append("company", this.state.company);
    formdata.append("role", this.state.role);
    formdata.append("status", this.state.status);
    formdata.append("changePassword", this.state.changePassword);
    formdata.append("changePasswordRequest", cpr);

    // for (var key of formdata.entries()) {
    //   console.log(key[0] + ", " + key[1]);
    // }

    // const anAdvertiser = {
    //   id: this.state.id,
    //   name: this.state.name,
    //   email: this.state.email,
    //   password: this.state.password,
    //   password2: this.state.password2,
    //   company: this.state.company,
    //   companyId: this.state.companyId,
    //   role: this.state.role,
    //   status: this.state.status,
    //   changePassword: this.state.changePassword
    // };

    // console.log(anAdvertiser);

    const id = this.props.match.params.id;
    if (id) {
      this.props.modifyAdvertiser(formdata, this.props.history);
    } else {
      this.props.registerAdvertiser(formdata, this.props.history);
    }
  }; // end submit

  render() {
    const { errors } = this.state;
    const perrors = this.props.errors;
    // same as const errors = this.state.errors

    // this was used to show user from props
    // const { user } = this.props.auth; // const user = this.props.auth.user
    // this shows user {user ? user.name : null}

    let title = "Create";
    let changepassword = false;
    let disabled = "";
    let accountexists = false;
    const id = this.props.match.params.id;
    if (id) {
      title = "Modify";
      changepassword = true;
      disabled = "disabled";
      accountexists = true;
    }
    let hasimage = false;
    if (this.state.imageBuffer) {
      hasimage = true;
    }

    return (
      <div className="register">
        <div className="container">
          <div className="row">
            <div className="col-md-8 m-auto">
              <h1 className="display-6 text-center">
                {title} Advertiser Account
              </h1>
              {errors.generic ? (
                <h3 className="display-32 text-center">{errors.generic}</h3>
              ) : null}

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
                    disabled={disabled}
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

                {changepassword ? (
                  <div className="form-group">
                    <label>
                      Change Password:&nbsp;
                      <input
                        name="changePassword"
                        type="checkbox"
                        checked={this.state.changePassword}
                        onChange={this.onChange}
                      />
                    </label>
                  </div>
                ) : (
                  <div />
                )}

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

                <div className="form-group">
                  <div className="row">
                    <div className="col-md-3">Logo</div>
                    <div className="col-md-4">
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

                <div className="invalid-feedback">
                  {this.state.errors.noimage}
                </div>

                <input type="submit" className="btn btn-info btn-block mt-4" />
              </form>
              {perrors && (
                <div className="error-display">{perrors.message}</div>
              )}
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
  registerAdvertiser: PropTypes.func.isRequired,
  modifyAdvertiser: PropTypes.func.isRequired,
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
  { registerAdvertiser, modifyAdvertiser }
)(withRouter(Register));
// wrap the Register with withRouter so the authAction can use history to redirect
