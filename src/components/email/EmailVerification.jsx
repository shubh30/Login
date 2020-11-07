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
import useStyles from "./emailVerification.style";

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
const Verification = ({
  setUserToken,
  setNotification,
  setShow,
  setId,
  setData,
  clearData,
  history,
}) => {
  // state
  const [verificationError, setVerificationError] = useState("");

  // component style
  const classes = useStyles();

  // project theme
  const theme = useTheme();

  // form field
  const formik = useFormik({
    initialValues: {
      verification: "",
    },

    validationSchema: Yup.object({
      verification: Yup.string()
        .trim()
        .matches(/^[0-9]{6}$/, "Invalid code format!!")
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
        email: getUserData().email,
        token: getToken(),
        verificationToken: formik.values.verification,
      };
      let response = await axios({
        method: "POST",
        url: `https://hiring.getbasis.co/candidate/users/email/verify`,
        data,
      });

      console.log("email verification response ==> ", response);

      // if all good
      if (response.data.success) {
        // setNotification({
        //   open: true,
        //   severity: "success",
        //   msg: response.data.message,
        // });

        let signup_response = await axios({
          method: "POST",
          url: `https://hiring.getbasis.co/candidate/users`,
          data: getUserData(),
        });
        console.log("signup response ==>> ", signup_response);

        setId(signup_response.data.results.user._id);

        setNotification({
          open: true,
          severity: "success",
          msg: signup_response.data.message,
        });
        setUserToken(signup_response.data.results.user.token);
        setData(signup_response.data.results.user);

        history.push(profile);
      } else {
        if (response.data.messageObj.wrongEmailTokenCount < 3) {
          setVerificationError(
            `Wrong Code, ${
              3 - response.data.messageObj.wrongEmailTokenCount
            } attempts remaining `
          );
        } else {
          setVerificationError("");

          clearData();

          setShow((prev) => {
            return { ...prev, phone: true, verification: false };
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
          Enter Verification Code
        </Typography>

        {!!verificationError && (
          <Typography color="error" variant="body2">
            {verificationError}
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
            id="verification"
            label="Verification Code"
            name="verification"
            autoComplete="verification"
            InputProps={{
              style: { color: theme.palette.common.white },
            }}
            onChange={onChangeHandle}
            error={formik.errors.verification && formik.touched.verification}
            helperText={formik.errors.verification}
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
            disabled={!!formik.errors.verification}
          >
            <Typography color="inherit" style={{ marginTop: "2px" }}>
              Verify Code
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
export default connect(null, mapActionToProps)(withRouter(Verification));
