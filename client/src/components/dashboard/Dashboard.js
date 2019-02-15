import React, { Component } from "react";
// we need to get into git
import { connect } from "react-redux";

//import Trips from "../shuttles/Trips";
import Advertisers from "../advertisers/Advertisers";
//import Advertisements from "../advertisements/Advertisements";

import Businesses from "../businesses/Businesses";

class Dashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {}; //shuttles: ["one", "two", "three"] };
    // console.log("Dashboard props", props);
  }
  render() {
    const userrole = this.props.auth.user.role;
    const { isAuthenticated, user } = this.props.auth; // shorthand
    return (
      <div>
        <h3 style={{ textAlign: "center" }}>Dashboard: {user.name}</h3>

        {userrole === "admin" ? <Advertisers /> : null}
        {/* <Advertisers />  */}
        <Businesses />
      </div>
    );
  }
}

const mapStateToProps = state => ({
  auth: state.auth,
  errors: state.errors
});

export default connect(
  mapStateToProps,
  {}
)(Dashboard);

//export default Dashboard;
