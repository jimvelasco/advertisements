import React, { Component } from "react";
//import { Link } from "react-router-dom";
import axios from "axios";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import Spinner from "../common/Spinner";
import AdverDetails from "./AdverDetails";
import { getAdvertisers } from "../../actions/advertiseActions";
import { changeAdvertiserStatus } from "../../actions/advertiseActions";

class Advertisers extends Component {
  constructor(props) {
    super(props);
    this.state = {
      advertisers: [],
      selectedAdvertiser: null,
      selectedId: null
    };
  }

  componentDidMount() {
    // console.log("thumbs did mount");
    //this.getAdvertisers();
    // axios
    //   .get("/api/advertise/advertisers")
    //   // .then(res => console.log(res.data))
    //   //.then(res => (thumbnails = res.data))
    //   .then(res => this.setState({ advertisers: res.data }))
    //   .catch(err => console.log(err.response.data)); // to get actual errors from backend
    // this.setState({ shuttles: ["one", "two", "three"] });
    this.props.getAdvertisers();
  }

  // getAdvertisers() {
  //   axios
  //     .get("/api/advertise/advertisers")
  //     .then(res => this.setState({ advertisers: res.data }))
  //     .catch(err => console.log(err.response.data)); // to get actual errors from backend
  // }

  // good_deleteAdvertiser(adid) {
  //   let link = `/api/advertise/delete-advertiser/${adid}`;
  //   let link2 = "/api/advertise/advertisers";
  //   axios
  //     .get(link)
  //     .then(
  //       axios
  //         .get(link2)
  //         .then(res => this.setState({ advertisers: res.data }))
  //         //.then(res => console.log(res.data))
  //         .catch(err => console.log("error"))
  //     )
  //     .catch(err => console.log("error"));
  // }

  deleteAdvertiser(adid) {
    let link = `/api/advertise/delete-advertiser/${adid}`;
    axios
      .get(link)
      .then(res => {
        let oid = res.data._id;
        let newary = [];
        let curadverts = this.state.advertisers;
        curadverts.forEach(a => {
          a._id == oid ? null : newary.push(a);
        });
        this.setState({ advertisers: newary });
      })
      .catch(err => console.log("error"));
  }

  changeAdvertiserStatus = (adid, status) => {
    this.props.changeAdvertiserStatus(adid, status);
  };

  detailsAdvertiser(advertiser) {
    let cursid = this.state.selectedId;
    let curaid = advertiser._id;
    //console.log("curid " + cursid + " curaid " + curaid);
    if (cursid === null || cursid !== curaid) {
      return this.setState({
        selectedAdvertiser: advertiser,
        selectedId: curaid
      });
    }

    if (cursid === curaid) {
      // console.log("we should hide details for " + cursid + " curaid " + curaid);
      return this.setState({
        selectedAdvertiser: null,
        selectedId: null
      });
    }
  }

  // changeStatus(adid, status) {
  //   //  console.log("changeStatus", adid);
  //   let link = `/api/advertise/change-advertiser-status/${adid}/${status}`;
  //   let link2 = "/api/advertise/advertisers";
  //   axios
  //     .get(link)
  //     .then(
  //       axios
  //         .get(link2)
  //         .then(res => this.setState({ advertisers: res.data }))
  //         //.then(res => console.log(res.data))
  //         .catch(err => console.log("error"))
  //     )
  //     .catch(err => console.log("error"));
  // }

  // passedFunction = advertiser => {
  //   // console.log("we hit passed function", advertiser);
  //   // console.log("we hit passed function state", this.state);
  //   //this.getAdvertisers();
  //   let advertisers = this.state.advertisers;
  //   // console.log("pif current advertisers", advertisers);
  //   advertisers.map((target, index) => {
  //     if (target._id == advertiser._id) {
  //       target.status = advertiser.status;
  //     }
  //   });
  //   // console.log("pif updated advertisers", advertisers);
  //   this.setState({ advertisers: advertisers });
  // };

  render() {
    if (!this.state.advertisers) {
      // return <div>Loading...</div>;
      return <Spinner />;
    }

    let selectedAdvertiser = this.state.selectedAdvertiser;

    let showdetails = false;
    if (selectedAdvertiser) {
      showdetails = true;
    }

    const { errors } = this.props;
    // console.log("businesses render", errors);
    const { advertisers } = this.props.advertise;

    return (
      <div className="container">
        <h4>Advertisers</h4>
        <table className="table table-bordered table-striped table-sm">
          <thead className="thead-dark">
            <tr>
              <th>_id</th>
              <th>Name</th>
              <th>Email</th>
              <th>Company</th>
              <th>Role</th>
              <th>Status</th>
              <th>&nbsp;</th>
            </tr>
          </thead>
          <tbody>
            {advertisers.map((advertiser, index) => (
              <tr key={advertiser._id}>
                <td>{advertiser._id}</td>
                <td>{advertiser.name}</td>
                <td>{advertiser.email}</td>
                <td>{advertiser.company}</td>
                <td>{advertiser.role}</td>
                <td>{advertiser.status}</td>
                <td>
                  <a
                    href="#"
                    onClick={() => {
                      this.detailsAdvertiser(advertiser);
                    }}
                  >
                    details
                  </a>
                  &nbsp;
                  <a
                    href="#"
                    onClick={() => {
                      this.changeAdvertiserStatus(
                        advertiser._id,
                        advertiser.status
                      );
                    }}
                  >
                    change
                  </a>
                  &nbsp;
                  <a
                    href="#"
                    onClick={() => {
                      this.deleteAdvertiser(advertiser._id);
                    }}
                  >
                    delete
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {showdetails ? (
          <AdverDetails selectedAdvertiser={selectedAdvertiser} />
        ) : (
          <div />
        )}
      </div>
    );
  }
}

const mapStateToProps = state => ({
  auth: state.auth,
  errors: state.errors,
  advertise: state.advertise
});

export default connect(
  mapStateToProps,
  { getAdvertisers, changeAdvertiserStatus }
)(withRouter(Advertisers));

//export default Advertisers;

// passedFunction={this.passedFunction}
