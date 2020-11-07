import React, { useState } from "react";
import { withRouter } from "react-router";
import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import TextField from "@material-ui/core/TextField";
import TextsmsOutlinedIcon from "@material-ui/icons/TextsmsOutlined";
import Typography from "@material-ui/core/Typography";
import Container from "@material-ui/core/Container";
import { useFormik } from "formik";
import * as Yup from "yup";
import { connect } from "react-redux";
import axios from "axios";
import { useTheme } from "@material-ui/core";

// url
import { profile } from "../../config/webURLs";

// styles
import useStyles from "./phone.style";

// config
// import baseURL from "../../config/baseURL";

// action
import { SET_NOTIFICATION } from "../../redux/actions/notification.action";

// utility
import { getToken, getUserData } from "../../utils/retriveData";
import {
  setUserId,
  setUserData,
  clearUserData,
  setToken,
} from "../../utils/storeData";

//  signin component -----------------------------------------------
const OTP = ({
  setUserToken,
  setNotification,
  setShow,
  setId,
  setData,
  clearData,
  history,
}) => {
  // state
  const [otpError, setOtpError] = useState("");

  // component style
  const classes = useStyles();

  // project theme
  const theme = useTheme();

  // form field
  const formik = useFormik({
    initialValues: {
      otp: "",
    },

    validationSchema: Yup.object({
      otp: Yup.string()
        .trim()
        .matches(/^[0-9]{4}$/, "Invalid OTP format!!")
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
        phoneNumber: getUserData().phone,
        verificationCode: formik.values.otp,
        token: getToken(),
      };
      let response = await axios({
        method: "POST",
        url: `https://hiring.getbasis.co/candidate/users/phone/verify`,
        data,
      });

      // console.log("response ==> ", response);

      // if all good
      if (response.data.success) {
        setNotification({
          open: true,
          severity: "success",
          msg: response.data.message,
        });

        if (response.data.results.isLogin) {
          setId(response.data.results.user._id);
          setUserToken(response.data.results.user.token);
          setData(response.data.results.user);
          history.push(profile);
        } else {
          setShow((prev) => {
            return { ...prev, otp: false, signUp: true };
          });
        }
      } else {
        if (response.data.messageObj.wrongOtpCount < 3) {
          setOtpError(
            `Wrong OTP, ${
              3 - response.data.messageObj.wrongOtpCount
            } attempts remaining `
          );
        } else {
          setOtpError("");

          clearData();

          setShow((prev) => {
            return { ...prev, phone: true, otp: false };
          });
        }
        setNotification({
          open: true,
          severity: "error",
          msg: response.data.message,
        });
      }
    } catch (err) {
      console.log(err);
      // console.log(baseURL);
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
          <TextsmsOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Enter OTP
        </Typography>

        {!!otpError && (
          <Typography color="error" variant="body2">
            {otpError}
          </Typography>
        )}

        <form className={classes.form} onSubmit={submitHandler}>
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            InputLabelProps={{
              style: { color: "inherit" },
            }}
            id="otp"
            label="OTP"
            name="otp"
            autoComplete="otp"
            InputProps={{
              style: { color: theme.palette.common.white },
            }}
            onChange={onChangeHandle}
            error={formik.errors.otp && formik.touched.otp}
            helperText={formik.errors.otp}
            FormHelperTextProps={{
              style: { color: theme.palette.error.main },
            }}
            autoFocus
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
            disabled={!!formik.errors.otp}
          >
            <Typography color="inherit" style={{ marginTop: "2px" }}>
              Verify OTP
            </Typography>
          </Button>
        </form>
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
    setId: (id) => dispatch(setUserId(id)),
    setData: (data) => dispatch(setUserData(data)),
    clearData: () => dispatch(clearUserData()),
  };
};
export default connect(null, mapActionToProps)(withRouter(OTP));