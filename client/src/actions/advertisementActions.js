import axios from "axios";
import setAuthToken from "../utils/setAuthToken";
import jwt_decode from "jwt-decode";
import {
  GET_ERRORS,
  CLEAR_ERRORS,
  SET_CURRENT_ADVERTISEMENT,
  SET_CURRENT_ADVERTISEMENTS,
  CREATE_ADVERTISEMENT,
  MODIFY_ADVERTISEMENT,
  REMOVE_ADVERTISEMENT,
  CHANGE_ADVERTISEMENT_STATUS,
  SET_STATUS_MESSAGE,
  SET_IS_LOADING
} from "./types";

export const getAdvertisements = bizid => dispatch => {
  //console.log("getAdvertisements");
  //dispatch({ type: SET_IS_LOADING, payload: true });
  let link = "/api/advertise/advertisements/" + bizid;

  axios
    .get(link)
    // .then(res => console.log(res.data))
    .then(res => {
      //console.log("getAdvertisements we have success", res.data);
      //this.setState({ businesses: res.data });
      dispatch({ type: CLEAR_ERRORS });
      dispatch({
        type: SET_IS_LOADING,
        payload: { isloading: true, page: "advertisements" }
      });
      dispatch({ type: SET_CURRENT_ADVERTISEMENTS, payload: res.data });
      dispatch({
        type: SET_IS_LOADING,
        payload: { isloading: false, page: "" }
      });
      //
      // history.push("/dashboard");
      //this.logConsole();
      // console.log(res.data);
    })
    .catch(err => {
      //console.log("advertise actions error ", err);
      dispatch({ type: SET_IS_LOADING, payload: false });
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      });
    });
  // }
};

export const createAdvertisement = advertisementData => dispatch => {
  axios
    .post("/api/advertise/createAdvertisement", advertisementData)

    .then(res => {
      //console.log("action createAdvertisement", res.data);
      dispatch({ type: CLEAR_ERRORS });
      dispatch({ type: CREATE_ADVERTISEMENT, payload: res.data });
      // history.push("/dashboard");
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

export const modifyAdvertisement = advertisementData => dispatch => {
  axios
    .post("/api/advertise/modifyAdvertisement", advertisementData)

    .then(res => {
      dispatch({ type: CLEAR_ERRORS });
      dispatch({
        type: SET_STATUS_MESSAGE,
        payload: { message: "Advertisement Update Successful" }
      });
      dispatch({ type: MODIFY_ADVERTISEMENT, payload: res.data });
      // history.push("/dashboard");
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

export const deleteAdvertisement = adid => dispatch => {
  let link = "/api/advertise/delete-advertisement/" + adid;
  axios
    .get(link)
    .then(res => {
      // history.push("/dashboard")
      dispatch({ type: CLEAR_ERRORS });
      dispatch({ type: REMOVE_ADVERTISEMENT, payload: adid });
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

export const changeAdvertisementStatus = (adid, status) => dispatch => {
  //console.log("modify advertisement in actions ", advertisementData);
  let link = `/api/advertise/change-advertisement-status/${adid}/${status}`;
  //console.log("adveractions changebusinesssttus", link);
  let rdata = { adid: adid, status: status };
  axios
    .get(link)
    .then(res => {
      dispatch({ type: CLEAR_ERRORS });
      dispatch({
        type: SET_STATUS_MESSAGE,
        payload: { message: "Advertisement Status Update Successful" }
      });
      dispatch({ type: CHANGE_ADVERTISEMENT_STATUS, payload: rdata });
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

export const setCurrentAdvertisement = adid => dispatch => {
  //console.log("setCurrentAdvertisement advertisement in actions ", adid);
  //let link = `/api/advertise/change-advertisement-status/${adid}/${status}`;
  //console.log("adveractions changebusinesssttus", link);

  //dispatch({ type: CLEAR_ERRORS });

  dispatch({ type: SET_CURRENT_ADVERTISEMENT, payload: adid });
};
