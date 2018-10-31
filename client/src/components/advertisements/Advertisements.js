import React, { Component } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import Spinner from "../common/Spinner";

class Advertisements extends Component {
  constructor(props) {
    super(props);
    this.state = {}; //shuttles: ["one", "two", "three"] };
  }

  componentDidMount() {
    // console.log("thumbs did mount");
    axios
      .get("/api/advertisers/advertisements")
      // .then(res => console.log(res.data))
      //.then(res => (thumbnails = res.data))
      .then(res => this.setState({ advertisements: res.data }))
      .catch(err => console.log(err.response.data)); // to get actual errors from backend
    // this.setState({ shuttles: ["one", "two", "three"] });
  }

  render() {
    if (!this.state.advertisements) {
      // return <div>Loading...</div>;
      return <Spinner />;
    }

    return (
      <div className="container">
        <h4>Advertisements</h4>
        <table className="table table-bordered table-striped table-sm">
          <thead className="thead-dark">
            <tr>
              <th>_id</th>
              <th>ID</th>
              <th>Name</th>
              <th>Description</th>
              <th>Address</th>
              <th>City</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {this.state.advertisements.map((advertisement, index) => (
              <tr key={advertisement._id}>
                <td>{advertisement._id}</td>
                <td>{advertisement.ownerid}</td>
                <td>{advertisement.name}</td>
                <td>{advertisement.description}</td>
                <td>{advertisement.address}</td>
                <td>{advertisement.city}</td>
                <td>{advertisement.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <Link to="/newad" className="btn btn-lg btn-info mr-2">
          New Advertisement
        </Link>
      </div>
    );
  }
}

export default Advertisements;
