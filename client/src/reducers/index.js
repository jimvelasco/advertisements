import { combineReducers } from "redux";
import authReducer from "./authReducer";
import errorReducer from "./errorReducer";
import adverReducer from "./adverReducer";

export default combineReducers({
  auth: authReducer,
  errors: errorReducer,
  advertise: adverReducer
});
