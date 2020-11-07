import { SET_TOKEN, SET_USER, CLEAR_USER } from "../redux/actions/user.action";

export const setToken = (token) => (dispatch) => {
  localStorage.setItem("token", token);
  let payload = {
    token,
  };

  dispatch({
    type: SET_TOKEN,
    payload,
  });
};

export const setUserId = (data) => (dispatch) => {
  localStorage.setItem("user_id", data);
  let payload = { user_id: data };

  dispatch({
    type: SET_USER,
    payload,
  });
};

export const setUserData = (data) => (dispatch) => {
  localStorage.setItem("user", JSON.stringify(data));
  let payload = {
    ...data,
  };

  dispatch({
    type: SET_USER,
    payload,
  });
};

export const clearUserData = () => (dispatch) => {
  localStorage.clear();
  dispatch({
    type: CLEAR_USER,
  });
};