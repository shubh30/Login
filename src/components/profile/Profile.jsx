import React from "react";
import { withRouter } from "react-router";
import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import TextField from "@material-ui/core/TextField";
import PhoneIphoneIcon from "@material-ui/icons/PhoneIphone";
import Typography from "@material-ui/core/Typography";
import Container from "@material-ui/core/Container";
import { useFormik } from "formik";
import * as Yup from "yup";
import { connect } from "react-redux";
import axios from "axios";
import { useTheme } from "@material-ui/core";

// urls
import { home } from "../../config/webURLs";

// styles
import useStyles from "./profile.style";

// config
// import baseURL from "../../config/baseURL";

// action
import { SET_NOTIFICATION } from "../../redux/actions/notification.action";

// utility
import { setToken, setUserData, clearUserData } from "../../utils/storeData";
import { getToken, getUserData, getUserId } from "../../utils/retriveData";

//  signin component -----------------------------------------------
const Profile = ({ setNotification, clearData, history }) => {
  // component style
  const classes = useStyles();

  // project theme
  const theme = useTheme();

  // fetch token and id from local storage
  let auth_token = getToken();
  let user_id = getUserId();

  // form field
  const formik = useFormik({
    initialValues: {
      firstName: getUserData().firstName,
      lastName: getUserData().lastName,
    },

    validationSchema: Yup.object({
      firstName: Yup.string()
        .trim()
        .min(2, "Mininum 2 characters")
        .max(10, "Maximum 10 characters")
        .required("Required!"),
      lastName: Yup.string()
        .trim()
        .min(2, "Mininum 2 characters")
        .max(10, "Maximum 10 characters")
        .required("Required!"),
    }),
  });

  // formik input handle
  let onChangeHandle = (e) => {
    formik.setFieldTouched(e.target.id);
    return formik.handleChange(e);
  };

  // on click submit
  const submitHandler = async (e) => {
    e.preventDefault();

    try {
      let data = {
        firstName: formik.values.firstName,
        lastName: formik.values.lastName,
        avatar: null,
      };
      let response = await axios({
        method: "PUT",
        headers: { Authorization: `Bearer ${user_id},${auth_token}` },
        url: `https://hiring.getbasis.co/candidate/users/${user_id}`,
        data,
      });

      // if all good
      if (response.data.success) {
        setNotification({
          open: true,
          severity: "success",
          msg: response.data.message,
        });
      } else {
        setNotification({
          open: true,
          severity: "error",
          msg: response.data.message,
        });
      }

      //   console.log("profile update ==>>", response);
    } catch (err) {
      console.log(err);
      setNotification({
        open: true,
        severity: "error",
        msg: "Internal server error, try again.",
      });
    }
  };

  // on click signout
  const signoutHandler = async () => {
    try {
      let signout_response = await axios({
        method: "DELETE",
        headers: { Authorization: `Bearer ${user_id},${auth_token}` },
        url: `https://hiring.getbasis.co/candidate/users/logout/${user_id}`,
      });
      //   console.log("signout_response  ==>", signout_response);
      setNotification({
        open: true,
        severity: "warning",
        msg: signout_response.data.message,
      });

      clearData();
      history.push(home);
    } catch (err) {
      console.log(err);
      setNotification({
        open: true,
        severity: "error",
        msg: "Internal server error, try again.",
      });
    }
  };

  // return component -----------------------------------------------------------
  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <PhoneIphoneIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Update Profile
        </Typography>

        <form className={classes.form} onSubmit={submitHandler}>
          <TextField
            variant="outlined"
            required
            fullWidth
            name="firstName"
            value={formik.values.firstName}
            label="First Name"
            id="firstName"
            InputLabelProps={{
              style: { color: "inherit" },
            }}
            InputProps={{
              style: { color: theme.palette.common.white },
            }}
            onChange={onChangeHandle}
            error={formik.errors.firstName && formik.touched.firstName}
            helperText={formik.errors.firstName}
            FormHelperTextProps={{
              style: { color: theme.palette.error.main },
            }}
          />

          <TextField
            variant="outlined"
            required
            fullWidth
            name="lastName"
            value={formik.values.lastName}
            label="Last Name"
            id="lastName"
            InputLabelProps={{
              style: { color: "inherit" },
            }}
            InputProps={{
              style: { color: theme.palette.common.white },
            }}
            onChange={onChangeHandle}
            error={formik.errors.lastName && formik.touched.lastName}
            helperText={formik.errors.lastName}
            FormHelperTextProps={{
              style: { color: theme.palette.error.main },
            }}
          />

          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            classes={{
              root: classes.submit,
              disabled: classes.disabled,
            }}
            disabled={!!formik.errors.firstName || !!formik.errors.lastName}
          >
            <Typography color="inherit" style={{ marginTop: "2px" }}>
              Update Profile
            </Typography>
          </Button>
        </form>
        <Button
          type="button"
          fullWidth
          variant="contained"
          color="primary"
          classes={{
            root: classes.submit,
          }}
          onClick={signoutHandler}
        >
          <Typography color="inherit" style={{ marginTop: "2px" }}>
            Sign Out
          </Typography>
        </Button>
      </div>
    </Container>
  );
};

const mapActionToProps = (dispatch) => {
  return {
    setNotification: (data) => {
      dispatch({
        type: SET_NOTIFICATION,
        payload: { ...data },
      });
    },
    setUserToken: (token) => dispatch(setToken(token)),
    setData: (phone) => dispatch(setUserData({ phone: phone })),
    clearData: () => dispatch(clearUserData()),
  };
};
export default connect(null, mapActionToProps)(withRouter(Profile));