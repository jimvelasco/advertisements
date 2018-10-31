import axios from "axios";
import setAuthToken from "../utils/setAuthToken";
import jwt_decode from "jwt-decode";
import { GET_ERRORS } from "./types";

export const createAdvertisement = (advertisementData, history) => dispatch => {
  axios
    .post("/api/advertisers/createAdvertisement", advertisementData)
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
