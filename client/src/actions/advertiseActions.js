import axios from "axios";
import setAuthToken from "../utils/setAuthToken";
import jwt_decode from "jwt-decode";
import {
  GET_ERRORS,
  CLEAR_ERRORS,
  SET_CURRENT_ADVERTISEMENT,
  SET_BUSINESSES,
  SET_IMAGES,
  SET_NEW_IMAGE,
  REMOVE_IMAGE,
  CHANGE_BUSINESS_STATUS,
  REMOVE_BUSINESS,
  CREATE_BUSINESS,
  SET_ADVERTISERS,
  CHANGE_ADVERTISER_STATUS
} from "./types";

export const createBusiness = (advertisementData, history) => dispatch => {
  axios
    .post("/api/business/createBusiness", advertisementData)
    .then(res => {
      dispatch({ type: CREATE_BUSINESS, payload: res.data });
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

export const getBusinessPhotos = userid => dispatch => {
  dispatch({ type: CLEAR_ERRORS });
  let link = "/api/business/allphotos/" + userid;
  axios
    .get(link)
    // .then(res => console.log(res.data))
    .then(res => {
      //console.log(res.data);
      // this.setState({ photos: res.data });

      dispatch({ type: SET_IMAGES, payload: res.data });
      //this.logConsole();
      // console.log(res.data);
    })
    .catch(err => {
      dispatch({
        type: GET_ERRORS,
        payload: { msg: "bummer" }
      });
    });
};

export const getBusinesses = (userrole, userid, history) => dispatch => {
  // let userrole = this.props.auth.user.role;
  // let userid = this.props.auth.user.id;
  // let status = this.props.auth.user.status;
  let link = "/api/business/businesses";
  if (userrole === "") {
    link = "/api/business/businesses/" + userid;
  }

  //console.log("link we are using in actions ", link);

  // if (status !== "0") {
  axios
    .get(link)
    // .then(res => console.log(res.data))
    .then(res => {
      //console.log("we have success", res.data);
      //this.setState({ businesses: res.data });
      dispatch({ type: CLEAR_ERRORS });
      dispatch({ type: SET_BUSINESSES, payload: res.data });
      // history.push("/dashboard");
      //this.logConsole();
      // console.log(res.data);
    })
    .catch(err => {
      console.log("advertise actions error ", err);
      dispatch({
        type: GET_ERRORS,
        payload: "whatever" //err.res.data
      });
    });
  // }
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

export const changeBusinessStatus = (bizid, status) => dispatch => {
  //console.log("modify advertisement in actions ", advertisementData);
  let link = `/api/business/change-business-status/${bizid}/${status}`;
  //console.log("adveractions changebusinesssttus", link);
  let rdata = { bizid: bizid, status: status };
  axios
    .get(link)
    .then(res => {
      dispatch({ type: CHANGE_BUSINESS_STATUS, payload: rdata });
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

export const deleteBusiness = bid => dispatch => {
  //let link = "/api/business/deletePhoto/" + id;
  let link = `/api/business/delete-business/${bid}`;
  axios
    .get(link)
    .then(res => {
      dispatch({ type: REMOVE_BUSINESS, payload: bid });
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

// changeBusinessStatus = (adid, status) => {
//   let link = `/api/business/change-business-status/${adid}/${status}`;
//   axios
//     .get(link)
//     .then(res => {
//       let business = res.data;
//       //console.log("the updated business is ", sa);
//       let businesses = this.state.businesses;
//       businesses.map((target, index) => {
//         if (target._id == business._id) {
//           target.status = business.status;
//         }
//       });
//       this.setState({ businesses: businesses });
//     })
//     .catch(err => console.log("error"));
// };

export const createImage = formdata => dispatch => {
  //console.log("creating photo");
  axios
    .post("/api/business/createImage", formdata)
    .then(res => {
      dispatch({ type: SET_NEW_IMAGE, payload: res.data });
    })
    // thunk lets us do a dispatch
    // .then(res => console.log(res.data))
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err
      })
    );
};

export const deletePhoto = id => dispatch => {
  let link = "/api/business/deletePhoto/" + id;
  axios
    .get(link)
    .then(res => {
      dispatch({ type: REMOVE_IMAGE, payload: id });
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

export const triggerError = () => dispatch => {
  //console.log("modify advertisement in actions ", advertisementData);
  axios
    .get("/api/business/trigger_error")
    .then(res => {
      // dispatch({ type: SET_CURRENT_ADVERTISEMENT, payload: res.data });
    })
    // thunk lets us do a dispatch
    // .then(res => console.log(res.data))
    .catch(err => {
      console.log("triggering error in actions", err.response.data);
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      });
    });
};

//**********************************/
// METHODS ADMINISTRATOR USES
//**********************************/

export const getAdvertisers = () => dispatch => {
  axios
    .get("/api/advertise/advertisers")
    .then(res => {
      dispatch({ type: SET_ADVERTISERS, payload: res.data });
    })
    .catch(err => {
      //console.log("advertise actions error ", err);
      dispatch({
        type: GET_ERRORS,
        payload: err.res.data
      });
    });
};

export const changeAdvertiserStatus = (adid, status) => dispatch => {
  //console.log("modify advertisement in actions ", advertisementData);
  //let link = `/api/business/change-business-status/${bizid}/${status}`;
  let link = `/api/advertise/change-advertiser-status/${adid}/${status}`;
  //console.log("adveractions changebusinesssttus", link);
  let rdata = { adid: adid, status: status };
  axios
    .get(link)
    .then(res => {
      dispatch({ type: CHANGE_ADVERTISER_STATUS, payload: rdata });
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
//console.log("link we are using in actions ", link);

// if (status !== "0") {
// axios
//   .get(link)
//   // .then(res => console.log(res.data))
//   .then(res => {
//     //console.log("we have success", res.data);
//     //this.setState({ businesses: res.data });
//     dispatch({ type: CLEAR_ERRORS });
//     dispatch({ type: SET_BUSINESSES, payload: res.data });
//     // history.push("/dashboard");
//     //this.logConsole();
//     // console.log(res.data);
//   })
//   .catch(err => {
//     console.log("advertise actions error ", err);
//     dispatch({
//       type: GET_ERRORS,
//       payload: "whatever" //err.res.data
//     });
//   });
// // }
//};

// export const createAdvertisement = (advertisementData, history) => dispatch => {
//   axios
//     .post("/api/advertise/createAdvertisement", advertisementData)
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

// export const modifyAdvertisement = (advertisementData, history) => dispatch => {
//   console.log("modify advertisement in actions ", advertisementData);
//   axios
//     .post("/api/advertise/modifyAdvertisement", advertisementData)
//     .then(res => {
//       console.log("the result is ", res.data);
//       dispatch({ type: SET_CURRENT_ADVERTISEMENT, payload: res.data });
//       history.push("/dashboard");
//     })
//     // thunk lets us do a dispatch
//     // .then(res => console.log(res.data))
//     .catch(err =>
//       dispatch({
//         type: GET_ERRORS,
//         payload: err.response.data
//       })
//     );
// };

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
