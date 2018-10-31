import React, { Component } from "react";
// we need to get into git
import { connect } from "react-redux";

//import Trips from "../shuttles/Trips";
import Advertisers from "../advertisers/Advertisers";
import Advertisements from "../advertisements/Advertisements";

class Dashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {}; //shuttles: ["one", "two", "three"] };
    console.log("Dashboard props", props);
  }
  render() {
    const userrole = this.props.auth.user.role;
    return (
      <div>
        <h3 style={{ textAlign: "center" }}>Dispatch Dashboard</h3>

        {/* {userrole === "admin" ? <Advertisers /> : <Advertisements />} */}
        <Advertisers />
        <Advertisements />
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
