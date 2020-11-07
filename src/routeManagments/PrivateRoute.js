import React from "react";
import { Route, Redirect } from "react-router-dom";

// checking for token
const isAuth = () =>
  !!localStorage.getItem("token") && !!localStorage.getItem("user_id");

const PrivateRoute = (props) => {
  return isAuth() ? <Route {...props} /> : <Redirect to={"/"} />;
};

export default PrivateRoute;