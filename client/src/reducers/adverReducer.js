import {
  SET_CURRENT_ADVERTISEMENTS,
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
} from "../actions/types";

// import { TEST_DISPATCH } from "../actions/types";

const initialState = {
  advertisements: [],
  advertisers: [],
  businesses: [],
  images: [],
  image: {},
  advertisement: {}
};

export default function(state = initialState, action) {
  // console.log("adverreducer ", action.type);
  // console.log("adverreducer ", action.payload);
  let bizid = "";
  let workid = "";
  switch (action.type) {
    case SET_CURRENT_ADVERTISEMENTS:
      return {
        ...state,
        advertisements: action.payload
      };
    case SET_CURRENT_ADVERTISEMENT:
      //console.log("SET_CURRENT_ADVERTISEMENT", action.payload);
      return {
        ...state,
        advertisement: action.payload
      };

    case SET_BUSINESSES:
      // console.log("action set business cur state", state);
      // let newstate =  {...state,action.payload};
      // const newState = Object.assign({}, state, { businesses: action.payload });
      // console.log("new state is", newState);
      // return newState;
      return {
        ...state,
        businesses: action.payload
      };
    case SET_IMAGES:
      return {
        ...state,
        images: action.payload
      };
    case REMOVE_IMAGE:
      workid = action.payload;
      // let cimages = state.images;
      // let rary = cimages.filter(item => item._id !== pid);

      return {
        ...state,
        images: state.images.filter(item => item._id !== workid)
      };
    case SET_NEW_IMAGE:
      let curimages = state.images;
      curimages.push(action.payload);

      return {
        ...state,
        image: action.payload,
        images: curimages
      };

    case CHANGE_BUSINESS_STATUS:
      let bizs = state.businesses;
      workid = action.payload.bizid;
      let status = action.payload.status;
      let upstatus = 0;
      if (status == 0) {
        upstatus = 1;
      }
      //console.log("incoming payload", action.payload);
      bizs.map((biz, index) => {
        if (biz._id == workid) {
          // console.log("we found a hit for ", bizid);
          // console.log("before status", biz.status);
          biz.status = upstatus;
          //console.log("after status", biz.status);
        }
      });

    case CHANGE_ADVERTISER_STATUS:
      let advers = state.advertisers;
      workid = action.payload.adid;
      let astatus = action.payload.status;
      let aupstatus = 0;
      if (astatus == 0) {
        aupstatus = 1;
      }
      //console.log("incoming payload", action.payload);
      advers.map((biz, index) => {
        if (biz._id == workid) {
          // console.log("we found a hit for ", bizid);
          // console.log("before status", biz.status);
          biz.status = aupstatus;
          //console.log("after status", biz.status);
        }
      });

      return {
        ...state,
        advertisers: advers
      };

    case REMOVE_BUSINESS:
      workid = action.payload;
      // let cimages = state.images;
      // let rary = cimages.filter(item => item._id !== pid);

      return {
        ...state,
        images: state.images.filter(item => item.ownerid !== workid),
        businesses: state.businesses.filter(item => item._id !== workid)
      };

    case CREATE_BUSINESS:
      let workobj = action.payload;
      let curbizes = state.businesses;
      let stateimages = state.images;
      curbizes.push(workobj.business);
      stateimages.push(workobj.image);

      // let cimages = state.images;
      // let rary = cimages.filter(item => item._id !== pid);

      return {
        ...state,
        images: stateimages,
        businesses: curbizes
      };

    case SET_ADVERTISERS:
      return {
        ...state,
        advertisers: action.payload
      };
    // case TEST_DISPATCH:
    //   console.log("we are in authreducer " + action.type);
    //   return {
    //     ...state,
    //     user: action.payload
    //   };
    default:
      return state;
  }
}
