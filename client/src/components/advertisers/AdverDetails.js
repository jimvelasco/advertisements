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

class AdverDetails extends Component {
  constructor(props) {
    super(props);
    // console.log("AdverDeails props", props);
    this.state = {
      selectedAdvertiser: props.selectedAdvertiser
    };
    this.onSubmit = this.onSubmit.bind(this);
  }

  onSubmit(e) {
    e.preventDefault();
  }

  // runPassed() {
  //   let sa = this.state.selectedAdvertiser;
  //   console.log("runPassed", sa);
  //   this.props.passedFunction(sa);
  // }

  changeStatus(adid, status) {
    //  console.log("changeStatus", adid);
    // this.props.passedFunction();

    let link = `/api/advertise/change-advertiser-status/${adid}/${status}`;
    axios
      .get(link)
      .then(res => {
        let sa = res.data;
        this.setState({ selectedAdvertiser: sa });
        this.props.passedFunction(sa);
      })
      .catch(err => console.log("error"));
  }

  componentDidMount() {
    //console.log("Component did mount **********");
    console.log(this.props);
  }

  // if we have errors this will run
  componentWillReceiveProps(nextProps) {
    // console.log("Component will receive **********");
    // console.log(this.props);
    // console.log("**********");
    // console.log(nextProps);
    // console.log("**********");
    this.props.selectedAdvertiser._id !== nextProps.selectedAdvertiser._id
      ? this.setState({ selectedAdvertiser: nextProps.selectedAdvertiser })
      : null;
  }

  render() {
    // const { errors } = this.state;
    const advertiser = this.state.selectedAdvertiser;
    // same as const errors = this.state.errors

    // this was used to show user from props
    // const { user } = this.props.auth; // const user = this.props.auth.user
    // this shows user {user ? user.name : null}

    return (
      <div className="container">
        <div className="row">
          <div className="col-md-10 m-auto">
            <h4 className="text-center">Advertiser Details</h4>

            <table className="table  table-bordered table-striped table-sm">
              <thead className="thead-light">
                <tr>
                  <th>_id</th>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Company</th>
                  <th>Role</th>
                  <th>Status</th>
                  <th>&nbsp;</th>
                </tr>
              </thead>
              <tbody>
                <tr key={advertiser._id}>
                  <td>{advertiser._id}</td>
                  <td>{advertiser.companyId}</td>
                  <td>{advertiser.name}</td>
                  <td>{advertiser.email}</td>
                  <td>{advertiser.company}</td>
                  <td>{advertiser.role}</td>
                  <td>{advertiser.status}</td>
                  <td>
                    <a
                      href="#"
                      onClick={() => {
                        this.changeStatus(advertiser._id, advertiser.status);
                      }}
                    >
                      change
                    </a>
                  </td>
                </tr>
              </tbody>
            </table>
            <ImageDisplay
              buf={advertiser.imageBuffer}
              width={advertiser.width}
              height={advertiser.height}
              filename={advertiser.imageFilename}
            />
          </div>
        </div>
      </div>
    );
  }
}

// this is good practice because it will help debugging
// it is not checked when in production mode.
// Register.propTypes = {
//   registerAdvertiser: PropTypes.func.isRequired,
//   auth: PropTypes.object.isRequired,
//   errors: PropTypes.object.isRequired
// };

// map errors to this component
// then we can use this.props.auth.user etc
// since we mapped error, we can use componentWillReceiveProps method
const mapStateToProps = state => ({
  auth: state.auth,
  errors: state.errors,
  selectedAdvisor: state.selectedAdvertiser
});
// the state.auth above comes from rootReducer in index.js in reducers.

export default connect(
  mapStateToProps,
  null
)(withRouter(AdverDetails));
// wrap the Register with withRouter so the authAction can use history to redirect
