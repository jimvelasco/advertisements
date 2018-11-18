import { SET_STATUS_MESSAGE, CLEAR_STATUS_MESSAGE } from "../actions/types";

const initialState = {};

export default function(state = initialState, action) {
  //console.log("in error reducer payload is", action.payload);
  switch (action.type) {
    case SET_STATUS_MESSAGE:
      return action.payload;
    case CLEAR_STATUS_MESSAGE:
      return {};
    default:
      return state;
  }
}
