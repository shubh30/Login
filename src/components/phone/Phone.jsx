import React from "react";
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

// styles
import useStyles from "./phone.style";

// config
// import baseURL from "../../config/baseURL";

// action
import { SET_NOTIFICATION } from "../../redux/actions/notification.action";

// utility
import { setToken, setUserData } from "../../utils/storeData";

//  signin component -----------------------------------------------
const Phone = ({ setNotification, setUserToken, setData, setShow }) => {
  // component style
  const classes = useStyles();

  // project theme
  const theme = useTheme();

  // form field
  const formik = useFormik({
    initialValues: {
      phone: "",
    },

    validationSchema: Yup.object({
      phone: Yup.string()
        .trim()
        .matches(/^[0-9]*$/, "Only numbers are allowed!!")
        .length(10, "Should be 10 characters!!")
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
        phoneNumber: formik.values.phone,
      };
      let response = await axios({
        method: "POST",
        url: `https://hiring.getbasis.co/candidate/users/phone`,
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

      // setting token to local storage
      setUserToken(response.data.results.token);
      setData(formik.values.phone);
      setShow((prev) => {
        return { ...prev, phone: false, otp: true };
      });
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
          Enter phone number
        </Typography>

        <form className={classes.form} onSubmit={submitHandler}>
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            InputLabelProps={{
              style: { color: "inherit" },
            }}
            id="phone"
            label="Phone Number"
            name="phone"
            autoComplete="phone"
            InputProps={{
              style: { color: theme.palette.common.white },
            }}
            onChange={onChangeHandle}
            error={formik.errors.phone && formik.touched.phone}
            helperText={formik.errors.phone}
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
            disabled={!!formik.errors.phone}
          >
            <Typography color="inherit" style={{ marginTop: "2px" }}>
              Get OTP
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
    setData: (phone) => dispatch(setUserData({ phone: phone })),
  };
};
export default connect(null, mapActionToProps)(Phone);
