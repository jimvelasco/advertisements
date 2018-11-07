import {
  SET_CURRENT_ADVERTISEMENTS,
  SET_CURRENT_ADVERTISEMENT
} from "../actions/types";

// import { TEST_DISPATCH } from "../actions/types";

const initialState = {
  advertisements: [],
  advertisement: {}
};

export default function(state = initialState, action) {
  //console.log("adverreducer actuib", action.type);
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
