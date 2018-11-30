import React, { Component } from "react";
import { connect } from "react-redux";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
// we need these so app remembers if person is logged on
import jwt_decode from "jwt-decode";
import setAuthToken from "./utils/setAuthToken";
import { setCurrentUser, logoutUser } from "./actions/authActions";
//import { clearErrors } from "./actions/advertiseActions";

import { Provider } from "react-redux";
import store from "./store";

import PrivateRoute from "./components/common/PrivateRoute";
import Test from "./components/Test";
import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";
import Landing from "./components/layout/Landing";
import StatusMessage from "./components/common/StatusMessage";
import MapBusinesses from "./components/common/MapBusinesses";

//import GoogleMapsContainer from "./components/common/GoogleMapsContainer";

import TestLinks from "./components/common/TestLinks";
//import Shuttles from "./components/shuttles/Shuttles";
import Advertisers from "./components/advertisers/Advertisers";

import Advertisements from "./components/advertisements/Advertisements";
import Advertisement from "./components/advertisements/Advertisement";

import Businesses from "./components/businesses/Businesses";
import Business from "./components/businesses/Business";

import Trips from "./components/shuttles/Trips";
import Dashboard from "./components/dashboard/Dashboard";
import TripEdit from "./components/shuttles/TripEdit";

// import ModalDialog from "./components/shuttles/ModalDialog";

import Register from "./components/auth/Register";
import Login from "./components/auth/Login";
import "./App.css";

// Check for token
if (localStorage.jwtToken) {
  // Set auth token header auth
  setAuthToken(localStorage.jwtToken);
  // Decode token and get user info and exp
  const decoded = jwt_decode(localStorage.jwtToken);
  // Set user and isAuthenticated
  // we can call anything in store with dispatch
  store.dispatch(setCurrentUser(decoded));

  // Check for expired token
  const currentTime = Date.now() / 1000;
  // console.log("current time ", currentTime);
  // console.log("decoded time ", decoded.exp);
  if (decoded.exp < currentTime) {
    // Logout user
    store.dispatch(logoutUser());
    // Clear current Profile
    //store.dispatch(clearCurrentProfile());
    // Redirect to login
    //console.log("we are redirecting to login");
    // window.location.href = "/login";
    window.location.href = "/";
  }
}
// console.log("about to call clear errors");
// store.dispatch(clearErrors());
// we need to wrap privateroutes in switch because pr has a redirect in it.
class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <Router>
          <div className="App">
            <StatusMessage />
            <Navbar />

            {/* <TestLinks /> */}

            <Route exact path="/" component={Landing} />
            <div className="container">
              {/* <h3>status message</h3> */}
              <Route exact path="/test" component={Test} />
              {/* <Route exact path="/googlemaps" component={GoogleMapsContainer} /> */}
              <Route exact path="/register" component={Register} />
              <Route exact path="/login" component={Login} />
              {/* <Route exact path="/map" component={MapBusinesses} /> */}
              {/* <Route exact path="/newadvertisement" component={Advertisement} /> */}
              {/* <Route exact path="/thumbs" component={Thumbs} /> */}
              <Switch>
                <PrivateRoute
                  exact
                  path="/advertisers"
                  component={Advertisers}
                />

                <PrivateRoute exact path="/map" component={MapBusinesses} />

                <PrivateRoute exact path="/businesses" component={Businesses} />

                <PrivateRoute exact path="/newad" component={Advertisement} />
                <PrivateRoute exact path="/newbusiness" component={Business} />
                <PrivateRoute
                  exact
                  path="/modifyad/:id"
                  component={Advertisement}
                />

                <PrivateRoute
                  exact
                  path="/modifybusiness/:id"
                  component={Business}
                />

                <PrivateRoute
                  exact
                  path="/modifyadvertiser/:id"
                  component={Register}
                />

                <PrivateRoute exact path="/dashboard" component={Dashboard} />
              </Switch>
            </div>

            <Footer />
          </div>
        </Router>
      </Provider>
    );
  }
}

// const mapStateToProps = state => ({
//   auth: state.auth,
//   errors: state.errors,
//   advertise: state.advertise
// });

// export default connect(
//   mapStateToProps,
//   {}
// )(App);
export default App;
