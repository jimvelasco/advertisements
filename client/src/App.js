import React, { Component } from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
// we need these so app remembers if person is logged on
import jwt_decode from "jwt-decode";
import setAuthToken from "./utils/setAuthToken";
import { setCurrentUser, logoutUser } from "./actions/authActions";

import { Provider } from "react-redux";
import store from "./store";

import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";
import Landing from "./components/layout/Landing";
import Shuttles from "./components/shuttles/Shuttles";
import Trips from "./components/shuttles/Trips";
import Dashboard from "./components/shuttles/Dashboard";
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
  if (decoded.exp < currentTime) {
    // Logout user
    store.dispatch(logoutUser());
    // Clear current Profile
    //store.dispatch(clearCurrentProfile());
    // Redirect to login
    window.location.href = "/login";
  }
}

class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <Router>
          <div className="App">
            <Navbar />
            <Route exact path="/" component={Landing} />
            <div className="container">
              <Route exact path="/register" component={Register} />
              <Route exact path="/login" component={Login} />
              {/* <Route exact path="/thumbs" component={Thumbs} /> */}
              <Route exact path="/shuttles" component={Shuttles} />
              <Route exact path="/trips" component={Trips} />
              <Route exact path="/dashboard" component={Dashboard} />
              <Route exact path="/tripedit" component={TripEdit} />
            </div>

            <Footer />
          </div>
        </Router>
      </Provider>
    );
  }
}

export default App;