import React from "react";
import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import TextField from "@material-ui/core/TextField";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import Typography from "@material-ui/core/Typography";
import Container from "@material-ui/core/Container";
import { useFormik } from "formik";
import * as Yup from "yup";
import { connect } from "react-redux";
import axios from "axios";
import {
  FormControlLabel,
  Checkbox,
  Grid,
  useTheme,
  FormHelperText,
} from "@material-ui/core";

// styles
import useStyles from "./signUp.style";

// config
// import baseURL from "../../config/baseURL";

// action
import { SET_NOTIFICATION } from "../../redux/actions/notification.action";

// utility
import { getToken, getUserData } from "../../utils/retriveData";
import { setUserData } from "../../utils/storeData";

//  signin component -----------------------------------------------
const SignUp = ({ setNotification, setShow, setData }) => {
  // component style
  const classes = useStyles();

  // project theme
  const theme = useTheme();

  // form field
  const formik = useFormik({
    initialValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: getUserData().phone,
      reference: "",
      tandc: false,
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
      email: Yup.string()
        .trim()
        .email("Invalid email format")
        .required("Required!"),
      reference: Yup.string().trim().length(6, "Should be 6 characters"),
      tandc: Yup.boolean().oneOf(
        [true],
        "You must accept the terms and conditions"
      ),
    }),
  });

  // formik input handle
  let onChangeHandle = (e) => {
    formik.setFieldTouched(e.target.id);
    return formik.handleChange(e);
  };

  // to check reference code
  let onBlurHandle = async () => {
    if (formik.values.reference.length === 0) return true;
    let ref_response = await axios({
      method: "PUT",
      url: `https://hiring.getbasis.co/candidate/users/referral/${formik.values.reference}`,
    });
    // console.log("reference response ==>> ", ref_response);
    if (!ref_response.data.success) {
      formik.setFieldError("reference", ref_response.data.message);
      return false;
    }
    return true;
  };

  // on click submit
  const submitHandler = async (e) => {
    e.preventDefault();
    let cont = await onBlurHandle();
    // console.log("in handler ----- xxxxx --------11", cont);
    if (cont === false) return;
    try {
      let data = {
        email: formik.values.email,
        token: getToken(),
        phoneNumber: formik.values.phone,
      };
      // console.log("in handler ----- xxxxx --------", data);
      let response = await axios({
        method: "POST",
        url: `https://hiring.getbasis.co/candidate/users/email`,
        data,
      });

      // console.log("email response ==> ", response);

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

      // setting user data to local storage
      setData({
        firstName: formik.values.firstName,
        lastName: formik.values.lastName,
        email: formik.values.email,
        phoneNumber: formik.values.phone,
        referredCodeKey: formik.values.reference,
        agreeToPrivacyPolicy: formik.values.tandc,
        token: getToken(),
        source: "WEB_APP",
      });
      setShow((prev) => {
        return { ...prev, signUp: false, verification: true };
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
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Sign Up
        </Typography>

        <form className={classes.form} onSubmit={submitHandler} noValidate>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                InputLabelProps={{
                  style: { color: "inherit" },
                }}
                id="firstName"
                label="First Name"
                name="firstName"
                autoComplete="fname"
                InputProps={{
                  style: { color: theme.palette.common.white },
                }}
                onChange={onChangeHandle}
                error={formik.errors.firstName && formik.touched.firstName}
                helperText={formik.errors.firstName}
                FormHelperTextProps={{
                  style: { color: theme.palette.error.main },
                }}
                autoFocus
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                InputLabelProps={{
                  style: { color: "inherit" },
                }}
                id="lastName"
                label="Last Name"
                name="lastName"
                autoComplete="lname"
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
            </Grid>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                id="email"
                InputLabelProps={{
                  style: { color: "inherit" },
                }}
                label="Email Address"
                name="email"
                autoComplete="email"
                InputProps={{
                  style: { color: theme.palette.common.white },
                }}
                value={formik.values.email}
                onChange={onChangeHandle}
                error={formik.errors.email && formik.touched.email}
                helperText={formik.errors.email}
                FormHelperTextProps={{
                  style: { color: theme.palette.error.main },
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                required
                fullWidth
                name="phone"
                label="Phone Number"
                id="phone"
                InputLabelProps={{
                  style: { color: "inherit" },
                }}
                InputProps={{
                  style: { color: theme.palette.common.white },
                }}
                value={formik.values.phone}
                disabled
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                margin="normal"
                fullWidth
                id="reference"
                InputLabelProps={{
                  style: { color: "inherit" },
                }}
                label="Reference Code"
                name="reference"
                autoComplete="reference"
                InputProps={{
                  style: { color: theme.palette.common.white },
                }}
                value={formik.values.reference}
                onChange={onChangeHandle}
                onBlur={onBlurHandle}
                error={formik.errors.reference && formik.touched.reference}
                helperText={formik.errors.reference}
                FormHelperTextProps={{
                  style: { color: theme.palette.error.main },
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Checkbox
                    value={formik.values.tandc}
                    color="primary"
                    name="tandc"
                    id="tandc"
                    onChange={onChangeHandle}
                  />
                }
                label="I agree to the terms and conditions."
              />
              <FormHelperText
                style={{ color: theme.palette.error.main, textAlign: "center" }}
              >
                {formik.errors.tandc}
              </FormHelperText>
            </Grid>
          </Grid>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            classes={{
              root: classes.submit,
              disabled: classes.disabled,
            }}
            disabled={
              !!formik.errors.firstName ||
              !!formik.errors.lastName ||
              !!formik.errors.email ||
              !!formik.errors.reference ||
              !!formik.errors.tandc
            }
          >
            <Typography color="inherit" style={{ marginTop: "2px" }}>
              Sign Up
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
    setData: (data) => dispatch(setUserData(data)),
  };
};
export default connect(null, mapActionToProps)(SignUp);
