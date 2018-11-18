import axios from "axios";
import setAuthToken from "../utils/setAuthToken";
import jwt_decode from "jwt-decode";

//import { TEST_DISPATCH } from "./types";
// REGISTER

// must return type always
// export const registerUser = userData => {
//   // console.log("we are in authactions");
//   // this then goes to the reducer.  TEST_DISPATCH happens to be in authReducer
//   return {
//     type: TEST_DISPATCH,
//     payload: userData
//   };
//};

import {
  GET_ERRORS,
  SET_CURRENT_USER,
  SET_STATUS_MESSAGE,
  CLEAR_ERRORS
} from "./types";

// Register User
// we passed in the history for Register component so now we can redirect
export const registerUser = (userData, history) => dispatch => {
  dispatch({ type: CLEAR_ERRORS });
  axios
    .post("/api/users/register", userData)
    .then(res => history.push("/login"))
    // thunk lets us do a dispatch
    // .then(res => console.log(res.data))
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    );
};

export const registerAdvertiser = (advertiserData, history) => dispatch => {
  dispatch({ type: CLEAR_ERRORS });
  axios
    .post("/api/users/register", advertiserData)
    .then(res => history.push("/login"))
    // thunk lets us do a dispatch
    // .then(res => console.log(res.data))
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    );
};

export const modifyAdvertiser = (advertiserData, history) => dispatch => {
  // console.log("we are in modifyAdvertiser in authActions", advertiserData);
  dispatch({ type: CLEAR_ERRORS });
  axios
    .post("/api/users/modify", advertiserData)
    .then(advertiser => {
      //console.log("modify user response data", advertiser);
      //return res.json(advertiser);

      dispatch(logoutUser());
      dispatch({
        type: SET_STATUS_MESSAGE,
        payload: { message: "Account Update Successfull.  Please Login." }
      });
      //.then(advertiser => res.json(advertiser))
    })
    // thunk lets us do a dispatch
    // .then(res => console.log(res.data))
    .catch(err => {
      console.log("in modify user action error response ", err.response.data);
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      });
    });
};

// Login - Get User Token
export const loginUser = userData => dispatch => {
  dispatch({ type: CLEAR_ERRORS });
  axios
    .post("/api/users/login", userData)
    .then(res => {
      // Save to localStorage
      const { token } = res.data;
      const { role } = res.data;
      // Set token to ls  The localStorage method is built into react framework.  no need to create our own
      localStorage.setItem("jwtToken", token);
      //console.log("user role is ", res.data.role);
      localStorage.setItem("userRole", role);
      // Set token to Auth header
      // token includes user information
      setAuthToken(token);
      // Decode token to get user data
      const decoded = jwt_decode(token);
      // Set current user
      // console.log("decoded current user ", decoded);
      dispatch(setCurrentUser(decoded));
    })
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    );
};

// Set logged in user
// this goes to reducer
export const setCurrentUser = decoded => {
  return {
    type: SET_CURRENT_USER,
    payload: decoded
  };
};

// Log user out
export const logoutUser = () => dispatch => {
  // Remove token from localStorage
  //console.log("logout user");
  localStorage.removeItem("jwtToken");
  localStorage.removeItem("userRole");
  // Remove auth header for future requests
  setAuthToken(false);
  // Set current user to {} which will set isAuthenticated to false
  // looke at reducer
  dispatch(setCurrentUser({}));
};
