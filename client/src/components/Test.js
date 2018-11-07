import React, { Component } from "react";
import { connect } from "react-redux";

//import axios from "axios";
//import classnames from "classnames";

class Test extends Component {
  constructor(props) {
    super(props);
    console.log("Test props", props);
    console.log("Test props", props.advertise);

    this.state = {
      curad: props.advertise
    };
  }

  render() {
    // const { errors } = this.state;
    //const advertiser = this.state.selectedAdvertiser;
    // same as const errors = this.state.errors

    // this was used to show user from props
    // const { user } = this.props.auth; // const user = this.props.auth.user
    // this shows user {user ? user.name : null}
    let id = "123";
    console.log("pa", this.state.curad);
    if (this.state.curad) {
      id = this.state.curad.advertisement._id;
    }

    return (
      <div>
        <h2>Howdy</h2>
        <h2>{id}</h2>
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
)(Test);
// wrap the Register with withRouter so the authAction can use history to redirect
