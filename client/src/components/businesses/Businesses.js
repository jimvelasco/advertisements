import React, { Component } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import axios from "axios";
import classnames from "classnames";
// import Spinner from "../common/Spinner";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
// import { triggerError } from "../../actions/advertiseActions";
// import { triggerStatus } from "../../actions/advertiseActions";
import { getBusinesses } from "../../actions/advertiseActions";
import { changeBusinessStatus } from "../../actions/advertiseActions";
import { deleteBusiness } from "../../actions/advertiseActions";
import ManagePhotos from "../common/ManagePhotos";
import Advertisements from "../advertisements/Advertisements";
import isEmpty from "../../validation/is-empty";

import { confirmAlert } from "react-confirm-alert"; // Import
import "react-confirm-alert/src/react-confirm-alert.css"; // Import css

class Businesses extends Component {
  constructor(props) {
    super(props);
    // console.log("Businesses props", props);
    this.state = {
      businesses: null,
      errors: null,
      showPhotos: false,
      selectedBizid: null,
      selectedName: null,
      showAdvertisements: false
    }; //shuttles: ["one", "two", "three"] };
    // this.getAdvertisements = this.getAdvertisements.bind(this);
    this.performdoJoin = this.performdoJoin.bind(this);
    this.doDeleteBusiness = this.doDeleteBusiness.bind(this);
    this.closePhotos = this.closePhotos.bind(this);
    this.closeAdvertisements = this.closeAdvertisements.bind(this);
  }

  componentDidMount() {
    //console.log("component did mount ", this.props);
    //if (!this.props.advertise.businesses) {
    //  console.log("component did mount getting businesses");
    this.getBusinesses();
    //}
  }

  componentWillReceiveProps(nextProps) {
    //console.log("register componentWillReceiveProps");
    //console.log("current props ", this.props);
    //console.log("nextProps ", nextProps);
    // if (nextProps.errors) {
    //   this.setState({ errors: nextProps.errors });
    //   // setState triggers a render
    // }
  }

  logConsole() {
    console.log("logging to console");
  }

  getBusinesses() {
    let userrole = this.props.auth.user.role;
    let userid = this.props.auth.user.id;
    this.props.getBusinesses(userrole, userid, this.props.history);
  }

  deleteBusiness(adid) {
    confirmAlert({
      customUI: ({ onClose }) => {
        return (
          <div className="custom-ui">
            <h1>Are you sure</h1>
            <p>you want to delete this Business?</p>
            <button className="btn btn-sm btn-info mr-2" onClick={onClose}>
              No
            </button>
            <button
              className="btn btn-sm btn-info mr-2"
              onClick={() => {
                this.doDeleteBusiness(adid);
                onClose();
              }}
            >
              Yes
            </button>
          </div>
        );
      }
    });
  }

  doDeleteBusiness(adid) {
    this.props.deleteBusiness(adid);
  }

  managePhotos(bizid, name) {
    // let cursid = this.state.selectedBizid;
    // if (cursid === null || cursid !== bizid) {
    //   return this.setState({
    //     showPhotos: true,
    //     selectedBizid: bizid,
    //     selectedName: name
    //   });
    // }
    // if (cursid === bizid) {
    //   return this.setState({
    //     showPhotos: false,
    //     selectedBizid: null,
    //     selectedName: name
    //   });
    // }

    this.setState({
      showPhotos: true,
      selectedBizid: bizid,
      selectedName: name
    });
  }

  manageAdvertisements(bizid, name) {
    // let cursid = this.state.selectedBizid;
    // if (cursid === null || cursid !== bizid) {
    //   return this.setState({
    //     showAdvertisements: true,
    //     selectedBizid: bizid,
    //     selectedName: name
    //   });
    // }
    // if (cursid === bizid) {
    //   return this.setState({
    //     showPhotos: false,
    //     selectedBizid: null,
    //     selectedName: name
    //   });
    // }
    this.setState({
      showAdvertisements: true,
      selectedBizid: bizid,
      selectedName: name
    });
  }

  closePhotos() {
    this.setState({
      showPhotos: false,
      selectedBizid: null
    });
  }

  closeAdvertisements() {
    this.setState({
      showAdvertisements: false,
      selectedBizid: null
    });
  }

  // triggerError() {
  //   this.props.triggerError();
  // }
  // triggerStatus() {
  //   this.props.triggerStatus();
  // }

  doJoin(bizid, adverid) {
    this.performdoJoin(bizid, adverid);
  }

  performdoJoin(bizid, ownerid) {
    // alert("what");
    // if (window.confirm("do join")) {
    //   alert("yes");
    // } else {
    //   alert("No");
    // }

    let link = "/api/advertise/doadimagejoin/" + bizid;
    console.log("do join link", link);
    axios
      .get(link)
      .then(res => {
        // dispatch({ type: SET_CURRENT_ADVERTISEMENT, payload: res.data });
        console.log("do join ", res.data);
      })
      // thunk lets us do a dispatch
      // .then(res => console.log(res.data))
      .catch(err => {
        console.log("triggering error in actions", err.message);

        let errors = {};
        errors.errormsg = "we have a major problem";
        console.log("return errors", errors);
        this.setState({ errors: errors });
      });
  }

  changeBusinessStatus = (adid, status) => {
    this.props.changeBusinessStatus(adid, status);
  };

  showModifyBusiness(adid) {
    // console.log("showModifyBusiness", adid);
    //let link = `/api/advertisers/modify-ad/${adid}`;
    // console.log(link);
    //let pobj = { pathname: "/newad", search: "?id=12345" };
    //this.props.history.push(pobj);
    let url = "/modifybusiness/" + adid;
    this.props.history.push(url);
    // axios
    //   .get(link)
    //   .then(res => this.setState({ businesss: res.data }))
    //   .catch(err => console.log(err.response.data)); // to get actual errors from backend
  }

  render() {
    //const { errors } = this.props;
    // console.log("rendering businesses state", this.state);
    // console.log("rendering businesses props", this.props.advertise.businesses);

    if (this.props.auth.user.status == "0") {
      return <div>User is not authorized to view or create businesses</div>;
      // return <Spinner />;
    }

    const { errors } = this.props;
    // console.log("businesses render", errors);
    const { businesses } = this.props.advertise;

    // if (!this.state.businesses) {
    //   return <Spinner />;
    // }

    //let businesses = this.state.businesses;
    let selectedBizid = this.state.selectedBizid;
    let selectedName = this.state.selectedName;

    // let errormsg = "";
    // if (!isEmpty(errors)) {
    //   errormsg = errors.message;
    // }
    // let show = true;
    // let data = "123456";

    return (
      <div className="container">
        <h4>Businesses</h4>

        <table className="table table-bordered table-striped table-sm">
          <thead className="thead-dark">
            <tr>
              {/* <th>_id</th>*/}
              {/* <th>Advertiser ID</th> */}
              <th>Advertiser</th>
              <th>Business</th>
              <th>Description</th>
              <th>Address</th>
              {/* <th>City</th> */}
              <th>Email</th>
              <th>Status</th>
              <th>&nbsp;</th>
            </tr>
          </thead>
          <tbody>
            {businesses.map((business, index) => (
              //link = `/delete-ad/${business._id}`
              <tr key={business._id}>
                {/* <td>{business._id}</td> */}
                {/* <td>{business.advertiserId}</td> */}
                <td>{business.advertiser.name}</td>
                <td>{business.name}</td>
                <td>{business.description}</td>
                <td>
                  {business.address},&nbsp;{business.city}
                </td>
                {/* <td>{business.city}</td> */}
                <td>{business.email}</td>
                <td>{business.status}</td>
                <td>
                  <a
                    href="#"
                    onClick={() => {
                      this.manageAdvertisements(business._id, business.name);
                    }}
                  >
                    ads
                  </a>
                  &nbsp;
                  <a
                    href="#"
                    onClick={() => {
                      this.managePhotos(business._id, business.name);
                    }}
                  >
                    photos
                  </a>
                  &nbsp;
                  <a
                    href="#"
                    onClick={() => {
                      this.showModifyBusiness(business._id);
                    }}
                  >
                    modify
                  </a>
                  &nbsp;
                  <a
                    href="#"
                    onClick={() => {
                      this.changeBusinessStatus(business._id, business.status);
                    }}
                  >
                    status
                  </a>
                  &nbsp;
                  <a
                    href="#"
                    onClick={() => {
                      this.deleteBusiness(business._id);
                    }}
                  >
                    delete
                  </a>
                  {/* &nbsp;
                  <a
                    href="#"
                    onClick={() => {
                      this.doJoin(business._id, business.advertiserId);
                    }}
                  >
                    join
                  </a> */}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {!isEmpty(errors) ? (
          <div className="error-display">{errors.message}</div>
        ) : (
          <div />
        )}
        {/* <a
          href="#"
          onClick={() => {
            this.triggerError();
          }}
        >
          trigger
        </a>
        |
        <a
          href="#"
          onClick={() => {
            this.triggerStatus();
          }}
        >
          status
        </a> */}
        <br />
        {this.props.auth.user.role == "" ? (
          <Link to="/newbusiness" className="btn btn-lg btn-info mr-2">
            New Business
          </Link>
        ) : (
          <div />
        )}
        {this.state.showPhotos ? (
          <ManagePhotos
            selectedBizid={selectedBizid}
            selectedName={selectedName}
            closePhotos={this.closePhotos}
          />
        ) : (
          <div />
        )}

        {this.state.showAdvertisements ? (
          <Advertisements
            selectedBizid={selectedBizid}
            selectedName={selectedName}
            closeAdvertisements={this.closeAdvertisements}
          />
        ) : (
          <div />
        )}
      </div>
    );
  }
}

Businesses.propTypes = {
  getBusinesses: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired,
  advertise: PropTypes.object.isRequired
};

//export default withRouter(Advertisements);
const mapStateToProps = state => ({
  auth: state.auth,
  errors: state.errors,
  status: state.status,
  advertise: state.advertise
});

// function mapDispatchToProps(dispatch) {
//   return bindActionCreators({ getBusinesses }, dispatch);
// }

export default connect(
  mapStateToProps,
  {
    getBusinesses,
    changeBusinessStatus,
    deleteBusiness
  }
)(withRouter(Businesses));

//Advertisements;
