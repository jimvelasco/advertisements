import React, { Component } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import axios from "axios";
import Spinner from "../common/Spinner";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { triggerError } from "../../actions/advertiseActions";
import { getBusinesses } from "../../actions/advertiseActions";
import { changeBusinessStatus } from "../../actions/advertiseActions";
import { deleteBusiness } from "../../actions/advertiseActions";
import ManagePhotos from "../common/ManagePhotos";
import isEmpty from "../../validation/is-empty";

class Businesses extends Component {
  constructor(props) {
    super(props);
    // console.log("Businesses props", props);
    this.state = {
      businesses: null,
      errors: null,
      showPhotos: false,
      selectedBizid: null,
      selectedName: null
    }; //shuttles: ["one", "two", "three"] };
    // this.getAdvertisements = this.getAdvertisements.bind(this);
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

  XgetBusinesses() {
    let userrole = this.props.auth.user.role;
    let userid = this.props.auth.user.id;
    let status = this.props.auth.user.status;
    let link = "/api/business/businesses";
    if (userrole === "") {
      link = "/api/business/businesses/" + userid;
    }

    if (status !== "0") {
      axios
        .get(link)
        // .then(res => console.log(res.data))
        .then(res => {
          // console.log(res.data);
          this.setState({ businesses: res.data });
          //this.logConsole();
          // console.log(res.data);
        })
        .catch(err => {
          //console.log(err.response.data);
          let errors = {};
          errors.errormsg = "Problem Getting Businesses";
          this.setState({ errors: errors });
        });
    }
  }

  deleteBusiness(adid) {
    // // let link = `/api/advertise/delete-advertiser/${adid}`;
    // let link = `/api/business/delete-business/${adid}`;
    // //console.log(link);
    // axios
    //   .get(link)
    //   .then(res => {
    //     let oid = adid;
    //     let newary = [];
    //     let curbus = this.state.businesses;
    //     curbus.forEach(a => {
    //       a._id == oid ? null : newary.push(a);
    //     });
    //     this.setState({ businesses: newary });
    //   })
    //   .catch(err => {
    //     let errors = {};
    //     errors.errormsg = "Problem Deleting Business";
    //     this.setState({ errors: errors });
    //   });

    this.props.deleteBusiness(adid);
  }

  managePhotos(bizid, name) {
    console.log("managePhotos for id ", bizid);
    console.log("managePhotos for name ", name);
    let cursid = this.state.selectedBizid;
    if (cursid === null || cursid !== bizid) {
      return this.setState({
        showPhotos: true,
        selectedBizid: bizid,
        selectedName: name
      });
    }
    if (cursid === bizid) {
      return this.setState({
        showPhotos: false,
        selectedBizid: null,
        selectedName: name
      });
    }

    // this.setState({
    //   showPhotos: true,
    //   selectedBizid: bizid,
    //   selectedName: name
    // });
  }

  triggerError() {
    this.props.triggerError();
  }

  triggerError2() {
    axios
      .get("/api/business/trigger_error2")
      .then(res => {
        // dispatch({ type: SET_CURRENT_ADVERTISEMENT, payload: res.data });
        console.log("response trig 2", res);
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

  trigger2(id) {
    axios
      .get("/api/business/dojoin")
      .then(res => {
        // dispatch({ type: SET_CURRENT_ADVERTISEMENT, payload: res.data });
        console.log("response trig 2", res.data);
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

  doJoin(bizid, ownerid) {
    let link = `/api/business/dojoin/${bizid}/${ownerid}`;
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
    // let link = `/api/business/change-business-status/${adid}/${status}`;
    // axios
    //   .get(link)
    //   .then(res => {
    //     let business = res.data;
    //     //console.log("the updated business is ", sa);
    //     let businesses = this.state.businesses;
    //     businesses.map((target, index) => {
    //       if (target._id == business._id) {
    //         target.status = business.status;
    //       }
    //     });
    //     this.setState({ businesses: businesses });
    //   })
    //   .catch(err => console.log("error"));
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

    const { errors } = this.props;
    // console.log("businesses render", errors);
    const { businesses } = this.props.advertise;

    // if (!this.state.businesses) {
    //   return <Spinner />;
    // }

    //let businesses = this.state.businesses;
    let selectedBizid = this.state.selectedBizid;
    let selectedName = this.state.selectedName;
    let errormsg = "";
    if (!isEmpty(errors)) {
      errormsg = errors.message;
    }

    return (
      <div className="container">
        <h4>Businesses</h4>
        <table className="table table-bordered table-striped table-sm">
          <thead className="thead-dark">
            <tr>
              {/* <th>_id</th>*/}
              <th>Owner ID</th>
              <th>Name</th>
              <th>Description</th>
              <th>Address</th>
              <th>City</th>
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
                <td>{business.ownerid}</td>
                <td>{business.name}</td>
                <td>{business.description}</td>
                <td>{business.address}</td>
                <td>{business.city}</td>
                <td>{business.email}</td>
                <td>{business.status}</td>
                <td>
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
                    change
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
                  &nbsp;
                  <a
                    href="#"
                    onClick={() => {
                      this.doJoin(business._id, business.ownerid);
                    }}
                  >
                    join
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {!isEmpty(errors) ? (
          <div className="message-display">{errors.message}</div>
        ) : (
          <div />
        )}
        <a
          href="#"
          onClick={() => {
            this.triggerError();
          }}
        >
          trigger
        </a>
        <a
          href="#"
          onClick={() => {
            this.trigger2();
          }}
        >
          trigger2
        </a>

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
  advertise: state.advertise
});

// function mapDispatchToProps(dispatch) {
//   return bindActionCreators({ getBusinesses }, dispatch);
// }

export default connect(
  mapStateToProps,
  { getBusinesses, changeBusinessStatus, deleteBusiness, triggerError }
)(withRouter(Businesses));

//Advertisements;
