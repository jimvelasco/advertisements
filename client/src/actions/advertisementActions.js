import axios from "axios";
import setAuthToken from "../utils/setAuthToken";
import jwt_decode from "jwt-decode";
import { GET_ERRORS, SET_CURRENT_ADVERTISEMENT } from "./types";

export const createBusiness = (advertisementData, history) => dispatch => {
  axios
    .post("/api/business/createBusiness", advertisementData)
    .then(res => history.push("/dashboard"))
    // thunk lets us do a dispatch
    // .then(res => console.log(res.data))
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    );
};

export const modifyBusiness = (advertisementData, history) => dispatch => {
  //console.log("modify advertisement in actions ", advertisementData);
  axios
    .post("/api/business/modifyBusiness", advertisementData)
    .then(res => {
      dispatch({ type: SET_CURRENT_ADVERTISEMENT, payload: res.data });
      history.push("/dashboard");
    })
    // thunk lets us do a dispatch
    // .then(res => console.log(res.data))
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    );
};

export const createAdvertisement = (advertisementData, history) => dispatch => {
  axios
    .post("/api/advertise/createAdvertisement", advertisementData)
    .then(res => history.push("/dashboard"))
    // thunk lets us do a dispatch
    // .then(res => console.log(res.data))
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    );
};

export const modifyAdvertisement = (advertisementData, history) => dispatch => {
  console.log("modify advertisement in actions ", advertisementData);
  axios
    .post("/api/advertise/modifyAdvertisement", advertisementData)
    .then(res => {
      console.log("the result is ", res.data);
      dispatch({ type: SET_CURRENT_ADVERTISEMENT, payload: res.data });
      history.push("/dashboard");
    })
    // thunk lets us do a dispatch
    // .then(res => console.log(res.data))
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    );
};

// export const deleteAdvertisement = (advertisementData, history) => dispatch => {
//   axios
//     .post("/api/advertisers/delete-ad", advertisementData)
//     .then(res => history.push("/dashboard"))
//     // thunk lets us do a dispatch
//     // .then(res => console.log(res.data))
//     .catch(err =>
//       dispatch({
//         type: GET_ERRORS,
//         payload: err.response.data
//       })
//     );
// };
