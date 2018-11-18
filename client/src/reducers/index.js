import { combineReducers } from "redux";
import authReducer from "./authReducer";
import errorReducer from "./errorReducer";
import statusReducer from "./statusReducer";
import adverReducer from "./adverReducer";

export default combineReducers({
  auth: authReducer,
  errors: errorReducer,
  status: statusReducer,
  advertise: adverReducer
});
