import React, { Component } from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { logoutUser } from "../../actions/authActions";

//import { withRouter } from "react-router-dom";

class Navbar extends Component {
  // constructor(props) {
  //   super(props);
  //   console.log("Navbar  props", props);
  //   this.state = {};
  // }

  onLogoutClick(e) {
    e.preventDefault();
    //this.props.clearCurrentProfile();
    this.props.logoutUser();
    // no need to do this.  logoutUser wipes out token and then PrivateRoute directs to / which is the landing page
    //window.location.href = "/";

    // this.props.history.push("/");
  }

  showModifyProfile(userid) {
    // console.log("deleteAd", adid);
    //let link = `/api/advertisers/modify-ad/${adid}`;
    // console.log(link);
    //let pobj = { pathname: "/newad", search: "?id=12345" };
    //this.props.history.push(pobj);
    let url = "/modifyprofile/" + userid;
    //console.log(url);
    this.props.history.push(url);
    // axios
    //   .get(link)
    //   .then(res => this.setState({ advertisements: res.data }))
    //   .catch(err => console.log(err.response.data)); // to get actual errors from backend
  }
  render() {
    const { isAuthenticated, user } = this.props.auth; // shorthand

    const authLinks = (
      <ul className="navbar-nav ml-auto">
        {/* <li className="nav-item">
        <Link className="nav-link" to="/feed">
          Post Feed
        </Link>
      </li> */}
        <li className="nav-item">
          <Link className="nav-link" to="/dashboard">
            Dashboard
          </Link>
        </li>
        {/* <li className="nav-item">
          <Link className="nav-link" to="/shuttles">
            Shuttles
          </Link>
        </li> */}
        {/* <li className="nav-item">
          <Link className="nav-link" to="/trips">
            Trips
          </Link>
        </li> */}

        {/* <li className="nav-item">
          <Link className="nav-link" to="/businesses">
            Businesses
          </Link>
        </li>
        <li className="nav-item">
          <Link className="nav-link" to="/test">
            Test
          </Link>
        </li> */}

        <li className="nav-item">
          <Link className="nav-link" to={`/modifyadvertiser/${user.id}`}>
            {user.email}
          </Link>
        </li>

        <li className="nav-item">
          <a
            href=""
            onClick={this.onLogoutClick.bind(this)}
            className="nav-link"
          >
            {/* <img
              className="rounded-circle"
              src={user.avatar}
              alt={user.name}
              style={{ width: "25px", marginRight: "5px" }}
              title="You must have a Gravatar connected to your email to display an image"
            />{" "} */}
            &nbsp;Logout
          </a>
        </li>
      </ul>
    );

    const guestLinks = (
      <ul className="navbar-nav ml-auto">
        <li className="nav-item">
          <Link to="/register" className="nav-link">
            Sign Up
          </Link>
        </li>
        <li className="nav-item">
          <Link to="/login" className="nav-link">
            Login
          </Link>
        </li>
      </ul>
    );
    return (
      <div>
        <nav className="navbar navbar-expand-sm navbar-dark bg-dark mb-4">
          <div className="container">
            <Link to="/" className="navbar-brand">
              Home
            </Link>
            <button
              className="navbar-toggler"
              type="button"
              data-toggle="collapse"
              data-target="#mobile-nav"
            >
              <span className="navbar-toggler-icon" />
            </button>

            <div className="collapse navbar-collapse" id="mobile-nav">
              {/* <ul className="navbar-nav mr-auto">
                <li className="nav-item">
                  <Link to="/thumbs" className="nav-link">
                    Thumbnails
                  </Link>
                </li>
              </ul> */}
              {isAuthenticated ? authLinks : guestLinks}{" "}
            </div>
          </div>
        </nav>
      </div>
    );
  }
}

Navbar.propTypes = {
  logoutUser: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth,
  status: state.status
});

export default connect(
  mapStateToProps,
  { logoutUser }
)(Navbar);
