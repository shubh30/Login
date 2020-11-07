import { combineReducers } from "redux";

// reducers
import notificationReducer from "./notification.reducer";

export default combineReducers({
  notification: notificationReducer,
});