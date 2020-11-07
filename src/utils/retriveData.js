export const getToken = () => {
  return localStorage.getItem("token");
};

// to get user id from local storage
export const getUserId = () => {
  return localStorage.getItem("user_id");
};

// to get user data from local storage
export const getUserData = () => {
  return JSON.parse(localStorage.getItem("user"));
};