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

export const setUserData = (data) => (dispatch) => {
  let { id, ...rest } = data;
  localStorage.setItem("user_id", id);
  localStorage.setItem("user", JSON.stringify(rest));
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