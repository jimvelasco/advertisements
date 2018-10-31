import React, { Component } from "react";
//import { Link } from "react-router-dom";
import axios from "axios";
import Spinner from "../common/Spinner";

class Advertisers extends Component {
  constructor(props) {
    super(props);
    this.state = {}; //shuttles: ["one", "two", "three"] };
  }

  componentDidMount() {
    // console.log("thumbs did mount");
    axios
      .get("/api/advertisers/advertisers")
      // .then(res => console.log(res.data))
      //.then(res => (thumbnails = res.data))
      .then(res => this.setState({ advertisers: res.data }))
      .catch(err => console.log(err.response.data)); // to get actual errors from backend
    // this.setState({ shuttles: ["one", "two", "three"] });
  }

  render() {
    if (!this.state.advertisers) {
      // return <div>Loading...</div>;
      return <Spinner />;
    }

    return (
      <div className="container">
        <h4>Advertisers</h4>
        <table className="table table-bordered table-striped table-sm">
          <thead className="thead-dark">
            <tr>
              <th>_id</th>
              <th>ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Company</th>
              <th>Role</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {this.state.advertisers.map((advertiser, index) => (
              <tr key={advertiser._id}>
                <td>{advertiser._id}</td>
                <td>{advertiser.companyId}</td>
                <td>{advertiser.name}</td>
                <td>{advertiser.email}</td>
                <td>{advertiser.company}</td>
                <td>{advertiser.role}</td>
                <td>{advertiser.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }
}

export default Advertisers;
