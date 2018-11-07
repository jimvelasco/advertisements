import React, { Component } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import Spinner from "../common/Spinner";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";

class Advertisements extends Component {
  constructor(props) {
    super(props);
    this.state = {}; //shuttles: ["one", "two", "three"] };
    // this.getAdvertisements = this.getAdvertisements.bind(this);
  }

  componentDidMount() {
    this.getBusinesses();
  }

  logConsole() {
    console.log("logging to console");
  }

  getBusinesses() {
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
        .catch(err => console.log(err.response.data));
    }
  }

  deleteBusiness(adid) {
    // let link = `/api/advertise/delete-advertiser/${adid}`;
    let link = `/api/business/delete-business/${adid}`;
    //console.log(link);
    axios
      .get(link)
      .then(res => {
        let oid = adid;
        let newary = [];
        let curbus = this.state.businesses;
        curbus.forEach(a => {
          a._id == oid ? null : newary.push(a);
        });
        this.setState({ businesses: newary });
      })
      .catch(err => console.log("error"));
  }

  changeBusinessStatus = (adid, status) => {
    let link = `/api/business/change-business-status/${adid}/${status}`;
    axios
      .get(link)
      .then(res => {
        let business = res.data;
        //console.log("the updated business is ", sa);
        let businesses = this.state.businesses;
        businesses.map((target, index) => {
          if (target._id == business._id) {
            target.status = business.status;
          }
        });
        this.setState({ businesses: businesses });
      })
      .catch(err => console.log("error"));
  };

  showModifyBusiness(adid) {
    // console.log("deleteAd", adid);
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
    if (this.props.auth.user.status == "0") {
      return <div>User is not authorized to view or create businesss</div>;
      // return <Spinner />;
    }
    if (!this.state.businesses) {
      // return <div>Loading...</div>;
      return <Spinner />;
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
              <th>Status</th>
              <th>&nbsp;</th>
            </tr>
          </thead>
          <tbody>
            {this.state.businesses.map((business, index) => (
              //link = `/delete-ad/${business._id}`
              <tr key={business._id}>
                {/* <td>{business._id}</td> */}
                <td>{business.ownerid}</td>
                <td>{business.name}</td>
                <td>{business.description}</td>
                <td>{business.address}</td>
                <td>{business.city}</td>
                <td>{business.status}</td>
                <td>
                  {/* <Link
                    to={`/delete-ad/${business._id}`}
                    onClick={() => {
                      this.deleteAd(business._id);
                    }}
                  > 
                  <span
                      style={{
                        textDecoration: "underline",
                        cursor: "pointer"
                      }}
                    >
                      delete
                    </span>
                
                 </Link> 
                
                */}
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
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {this.props.auth.user.role == "" ? (
          <Link to="/newbusiness" className="btn btn-lg btn-info mr-2">
            New Business
          </Link>
        ) : (
          <div />
        )}
      </div>
    );
  }
}

//export default withRouter(Advertisements);
const mapStateToProps = state => ({
  auth: state.auth,
  errors: state.errors
});

export default connect(
  mapStateToProps,
  {}
)(withRouter(Advertisements));

//Advertisements;
