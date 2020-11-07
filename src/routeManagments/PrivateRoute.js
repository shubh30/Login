import React from "react";
import { Route, Redirect } from "react-router-dom";

// utility
import { getToken, getUserId } from "../utils/retriveData";

// checking for token & user id
const isAuth = () => !!getToken() && !!getUserId();

const PrivateRoute = (props) => {
  return isAuth() ? <Route {...props} /> : <Redirect to={"/"} />;
};

export default PrivateRoute;