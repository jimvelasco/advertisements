import {
  SET_ADVERTISERS,
  CHANGE_ADVERTISER_STATUS,
  REMOVE_ADVERTISER,
  SET_BUSINESS,
  SET_BUSINESSES,
  CHANGE_BUSINESS_STATUS,
  REMOVE_BUSINESS,
  CREATE_BUSINESS,
  SET_CURRENT_ADVERTISEMENTS,
  SET_CURRENT_ADVERTISEMENT,
  REMOVE_ADVERTISEMENT,
  CREATE_ADVERTISEMENT,
  MODIFY_ADVERTISEMENT,
  CHANGE_ADVERTISEMENT_STATUS,
  SET_IMAGES,
  SET_NEW_IMAGE,
  REMOVE_IMAGE
} from "../actions/types";

// import { TEST_DISPATCH } from "../actions/types";

const initialState = {
  advertisements: [],
  advertisers: [],
  businesses: [],
  business: {},
  images: [],
  image: {},
  advertisement: { image: {} }
};
// let bizid = "";
// let workid = "";
// let workobj = {};
export default function(state = initialState, action) {
  // console.log("adverreducer ", action.type);
  // console.log("adverreducer ", action.payload);
  let bizid = "";
  let workid = "";
  let status = 0;
  let updatestatus = 0;
  let workary = [];
  switch (action.type) {
    // *************************
    // ADVERTISER
    // *************************

    case SET_ADVERTISERS:
      return {
        ...state,
        advertisers: action.payload
      };

    case REMOVE_ADVERTISER:
      workid = action.payload;
      return {
        ...state,
        advertisers: state.advertisers.filter(item => item._id !== workid),
        businesses: state.businesses.filter(item => item._id !== workid),
        images: state.images.filter(item => item._id !== workid)
      };

    case CHANGE_ADVERTISER_STATUS:
      let advers = state.advertisers;
      workid = action.payload.adid;
      let astatus = action.payload.status;
      let aupstatus = 0;
      if (astatus == 0) {
        aupstatus = 1;
      }
      advers.map((biz, index) => {
        if (biz._id == workid) {
          biz.status = aupstatus;
        }
      });
      return {
        ...state,
        advertisers: advers
      };

    // *************************
    // BUSINESSES
    // *************************

    case SET_BUSINESSES:
      return {
        ...state,
        businesses: action.payload
      };

    case SET_BUSINESS:
      return {
        ...state,
        business: action.payload[0],
        image: action.payload[1]
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
          biz.status = upstatus;
        }
      });
      return {
        ...state,
        businesses: bizs
      };

    case REMOVE_BUSINESS:
      workid = action.payload;
      return {
        ...state,
        images: state.images.filter(item => item.businessId !== workid),
        businesses: state.businesses.filter(item => item._id !== workid)
      };

    case CREATE_BUSINESS:
      let workobj = action.payload;
      let curbizes = state.businesses;
      let stateimages = state.images;
      curbizes.push(workobj.business);
      stateimages.push(workobj.image);
      return {
        ...state,
        images: stateimages,
        businesses: curbizes
      };

    case SET_CURRENT_ADVERTISEMENTS:
      return {
        ...state,
        advertisements: action.payload
      };

    // *************************
    // ADVERTISEMENTS
    // *************************

    case SET_CURRENT_ADVERTISEMENT:
      workid = action.payload;
      // console.log("SET_CURRENT_ADVERTISEMENT workid", workid);
      workary = state.advertisements;
      let target = null;
      workary.map((ad, index) => {
        if (ad._id == workid) {
          target = ad;
        }
      });
      return {
        ...state,
        advertisement: target
      };

    case CREATE_ADVERTISEMENT:
      workobj = action.payload;
      let acurads = state.advertisements;
      let astateimages = state.images;

      let combined = workobj.ad;
      combined.image = workobj.image;

      acurads.push(combined);
      astateimages.push(workobj.image);
      return {
        ...state,
        //images: astateimages,
        advertisements: acurads
      };

    case REMOVE_ADVERTISEMENT:
      bizid = action.payload;
      return {
        ...state,
        advertisements: state.advertisements.filter(item => item._id !== bizid)
      };

    case CHANGE_ADVERTISEMENT_STATUS:
      workary = state.advertisements;
      workid = action.payload.adid;
      status = action.payload.status;
      //upstatus = 0;
      if (status == 0) {
        updatestatus = 1;
      }
      workary.map((biz, index) => {
        if (biz._id == workid) {
          biz.status = updatestatus;
        }
      });
      return {
        ...state,
        advertisements: workary
      };

    case MODIFY_ADVERTISEMENT:
      // console.log("MODIFY_ADVERTISEMENT incoming payload", action.payload);
      workary = state.advertisements;
      let modobj = action.payload;
      let adobj = modobj.ad;
      let imgobj = modobj.img;
      workid = adobj._id;
      let wehaveimage = false;

      let imgary = state.images;
      if (imgobj) {
        wehaveimage = true;
        //console.log("we are doing something with image");
        // imgary.map((img, index) => {
        //   if (img.advertisementId === workid) {
        //     imgary[index] = imgobj;
        //   }
        // });
      } else {
        //console.log("we are not doing anything with image");
      }

      // console.log("we have image is ", wehaveimage);
      // console.log("workarybefore", workary);

      workary.map((biz, index) => {
        if (biz._id === workid) {
          if (wehaveimage) {
            adobj.image = imgobj;
          } else {
            adobj.image = biz.image;
          }
          workary[index] = adobj;
        }
      });
      // console.log("workaryafter", workary);

      return {
        ...state,
        advertisements: workary,
        advertisement: adobj
        // images: imgary
      };

    // *************************
    // IMAGES
    // *************************

    case SET_IMAGES:
      return {
        ...state,
        images: action.payload
      };

    case REMOVE_IMAGE:
      workid = action.payload;
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
