import axios from "axios";
import setAuthToken from "../utils/setAuthToken";
import jwt_decode from "jwt-decode";
import * as api from "./index";
import {
  GET_ERRORS,
  CLEAR_ERRORS,
  SET_STATUS_MESSAGE,
  CLEAR_STATUS_MESSAGE,
  SET_CURRENT_ADVERTISEMENT,
  SET_BUSINESSES,
  SET_IMAGES,
  SET_NEW_IMAGE,
  REMOVE_IMAGE,
  CHANGE_BUSINESS_STATUS,
  REMOVE_BUSINESS,
  CREATE_BUSINESS,
  MODIFY_BUSINESS,
  SET_ADVERTISERS,
  CHANGE_ADVERTISER_STATUS,
  REMOVE_ADVERTISER,
  SET_BUSINESS,
  SET_IS_LOADING
} from "./types";

export const clearErrors = () => dispatch => {
  dispatch({ type: CLEAR_ERRORS });
};

export const clearStatusMessage = () => dispatch => {
  dispatch({ type: CLEAR_STATUS_MESSAGE });
};

export const createBusiness = (advertisementData, history) => dispatch => {
  axios
    .post("/api/business/createBusiness", advertisementData)
    .then(res => {
      dispatch({ type: CLEAR_ERRORS });
      dispatch({
        type: SET_STATUS_MESSAGE,
        payload: { message: "Business Create Successful" }
      });

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
      dispatch({ type: CLEAR_ERRORS });

      dispatch({ type: SET_IMAGES, payload: res.data });
      //this.logConsole();
      // console.log(res.data);
    })
    .catch(err => {
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      });
    });
};

export const getBusiness = bizid => dispatch => {
  let link = `/api/business/find-business/${bizid}`;
  axios
    .get(link)
    .then(res => {
      dispatch({ type: CLEAR_ERRORS });
      dispatch({ type: SET_BUSINESS, payload: res.data });
    })
    .catch(err => {
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      });
    });
};

export const getBusinesses = (userrole, userid, history) => dispatch => {
  // let link = "/api/business/businesses";
  // if (userrole === "") {
  //   link = "/api/business/businesses/" + userid;
  // }
  // axios
  //   .get(link)

  dispatch({
    type: SET_IS_LOADING,
    payload: { isloading: true, page: "business" }
  });
  api
    .getApiBusinesses(userrole, userid)
    .then(res => {
      //console.log("we have success", res.data);
      //this.setState({ businesses: res.data });
      dispatch({ type: CLEAR_ERRORS });
      dispatch({ type: SET_BUSINESSES, payload: res.data });

      dispatch({
        type: SET_IS_LOADING,
        payload: { isloading: false, page: "" }
      });
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

export const modifyBusiness = (advertisementData, history) => dispatch => {
  //console.log("modify advertisement in actions ", advertisementData);
  axios
    .post("/api/business/modifyBusiness", advertisementData)
    .then(res => {
      dispatch({ type: CLEAR_ERRORS });
      dispatch({
        type: SET_STATUS_MESSAGE,
        payload: { message: "Business Update Successful" }
      });
      dispatch({ type: MODIFY_BUSINESS, payload: res.data });
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

// export const setBusiness = (bizobj, history) => dispatch => {
//   dispatch({
//     type: SET_BUSINESS,
//     payload: bizobj
//   });
// };

export const changeBusinessStatus = (bizid, status) => dispatch => {
  //console.log("modify advertisement in actions ", advertisementData);
  let link = `/api/business/change-business-status/${bizid}/${status}`;
  //console.log("adveractions changebusinesssttus", link);
  let rdata = { bizid: bizid, status: status };
  axios
    .get(link)
    .then(res => {
      dispatch({ type: CLEAR_ERRORS });
      dispatch({
        type: SET_STATUS_MESSAGE,
        payload: { message: "Business Status Update Successful" }
      });
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
      dispatch({ type: CLEAR_ERRORS });
      dispatch({
        type: SET_STATUS_MESSAGE,
        payload: { message: "Business Deleted" }
      });
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
      dispatch({ type: CLEAR_ERRORS });
      dispatch({ type: SET_NEW_IMAGE, payload: res.data });
    })
    // thunk lets us do a dispatch
    // .then(res => console.log(res.data))
    .catch(err => {
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      });
    });
};

export const deletePhoto = id => dispatch => {
  let link = "/api/business/deletePhoto/" + id;
  axios
    .get(link)
    .then(res => {
      dispatch({ type: CLEAR_ERRORS });
      // dispatch({
      //   type: SET_STATUS_MESSAGE,
      //   payload: { message: "Photo Deleted" }
      // });

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

export const xxtriggerError = () => dispatch => {
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

export const triggerError = () => dispatch => {
  dispatch({
    type: GET_ERRORS,
    payload: { message: "direct error from action" }
  });
};

export const triggerStatus = () => dispatch => {
  dispatch({
    type: SET_STATUS_MESSAGE,
    payload: { message: "THANK YOU FOR USING DISPATCH" }
  });
};

//**********************************/
// METHODS ADMINISTRATOR USES
//**********************************/

export const getAdvertisers = () => dispatch => {
  axios
    .get("/api/advertise/advertisers")
    .then(res => {
      dispatch({ type: CLEAR_ERRORS });
      dispatch({ type: SET_ADVERTISERS, payload: res.data });
    })
    .catch(err => {
      //console.log("advertise actions error ", err);
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
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
      dispatch({ type: CLEAR_ERRORS });
      dispatch({
        type: SET_STATUS_MESSAGE,
        payload: { message: "Advertiser Status Update Successful" }
      });

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

export const deleteAdvertiser = adid => dispatch => {
  //let link = "/api/business/deletePhoto/" + id;
  let link = `/api/advertise/delete-advertiser/${adid}`;
  axios
    .get(link)
    .then(res => {
      dispatch({ type: CLEAR_ERRORS });
      dispatch({
        type: SET_STATUS_MESSAGE,
        payload: { message: "Advertiser Deleted" }
      });
      dispatch({ type: REMOVE_ADVERTISER, payload: adid });
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
