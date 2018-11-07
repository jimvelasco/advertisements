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
    this.getAdvertisements();
  }

  logConsole() {
    console.log("logging to console");
  }

  getAdvertisements() {
    // console.log(" Advertisements componentDidMount props", this.props);
    let userrole = this.props.auth.user.role;
    let userid = this.props.auth.user.id;
    let status = this.props.auth.user.status;
    let link = "/api/advertise/advertisements";
    if (userrole === "") {
      link = "/api/advertise/advertisements/" + userid;
    }

    if (status !== "0") {
      axios
        .get(link)
        // .then(res => console.log(res.data))
        .then(res => {
          this.setState({ advertisements: res.data });
          //this.logConsole();
          // console.log(res.data);
        })
        .catch(err => console.log(err.response.data));
    }
  }

  xdeleteAd(adid) {
    console.log("deleteAd", adid);
    let link = `/api/advertise/delete-ad/${adid}`;
    axios
      .get(link)
      .then(function(res) {
        console.log("running getAdvertisements");
        this.getAdvertisements;
      })
      .catch(err => console.log("error"));
  }

  deleteAd(adid) {
    // console.log("deleteAd", adid);
    let userid = this.props.auth.user.id;
    let link = `/api/advertise/delete-ad/${adid}`;
    let link2 = "/api/advertise/advertisements/" + userid;
    axios
      .get(link)
      .then(
        axios
          .get(link2)
          .then(res => {
            this.setState({ advertisements: res.data });
            console.log("settubg state");
          })
          //.then(res => console.log(res.data))
          .catch(err => console.log("error"))
      )
      .catch(err => console.log("error"));
  }

  changeAdStatus = (adid, status) => {
    let link = `/api/advertise/change-advertisement-status/${adid}/${status}`;
    axios
      .get(link)
      .then(res => {
        let advertisement = res.data;
        //console.log("the updated advertisement is ", sa);
        let advertisements = this.state.advertisements;
        advertisements.map((target, index) => {
          if (target._id == advertisement._id) {
            target.status = advertisement.status;
          }
        });
        this.setState({ advertisements: advertisements });
      })
      .catch(err => console.log("error"));
  };

  showModifyAd(adid) {
    // console.log("deleteAd", adid);
    //let link = `/api/advertisers/modify-ad/${adid}`;
    // console.log(link);
    //let pobj = { pathname: "/newad", search: "?id=12345" };
    //this.props.history.push(pobj);
    let url = "/modifyad/" + adid;
    this.props.history.push(url);
    // axios
    //   .get(link)
    //   .then(res => this.setState({ advertisements: res.data }))
    //   .catch(err => console.log(err.response.data)); // to get actual errors from backend
  }

  render() {
    if (this.props.auth.user.status == "0") {
      return <div>User is not authorized to view or create advertisements</div>;
      // return <Spinner />;
    }
    if (!this.state.advertisements) {
      // return <div>Loading...</div>;
      return <Spinner />;
    }

    let newbutton =
      '<Link to="/newad" className="btn btn-lg btn-info mr-2">New Advertisement</Link>';

    return (
      <div className="container">
        <h4>Advertisements</h4>
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
            {this.state.advertisements.map((advertisement, index) => (
              //link = `/delete-ad/${advertisement._id}`
              <tr key={advertisement._id}>
                {/* <td>{advertisement._id}</td> */}
                <td>{advertisement.ownerid}</td>
                <td>{advertisement.name}</td>
                <td>{advertisement.description}</td>
                <td>{advertisement.address}</td>
                <td>{advertisement.city}</td>
                <td>{advertisement.status}</td>
                <td>
                  {/* <Link
                    to={`/delete-ad/${advertisement._id}`}
                    onClick={() => {
                      this.deleteAd(advertisement._id);
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
                      this.showModifyAd(advertisement._id);
                    }}
                  >
                    modify
                  </a>
                  &nbsp;
                  <a
                    href="#"
                    onClick={() => {
                      this.changeAdStatus(
                        advertisement._id,
                        advertisement.status
                      );
                    }}
                  >
                    change
                  </a>
                  &nbsp;
                  <a
                    href="#"
                    onClick={() => {
                      this.deleteAd(advertisement._id);
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
          <Link to="/newad" className="btn btn-lg btn-info mr-2">
            New Advertisement
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
