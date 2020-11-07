import React from "react";
import Snackbar from "@material-ui/core/Snackbar";
import MuiAlert from "@material-ui/lab/Alert";
import { connect } from "react-redux";

// style
import useStyles from "./notification.style";

// action
import { CLEAR_NOTIFICATION } from "../../redux/actions/notification.action";

const Alert = (props) => {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
};

const Notification = (props) => {
  const classes = useStyles();
  const { open, msg, severity, clearNotification } = props;

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    clearNotification();
  };

  return (
    <div className={classes.root}>
      <Snackbar open={open} autoHideDuration={2000} onClose={handleClose}>
        <Alert onClose={handleClose} severity={severity}>
          {msg}
        </Alert>
      </Snackbar>
    </div>
  );
};

// redux notification state
const setStateToProps = ({ notification }) => {
  return {
    ...notification,
  };
};

// redux dispatcher
const setActionToProps = (dispatch) => {
  return {
    clearNotification: () => {
      dispatch({
        type: CLEAR_NOTIFICATION,
      });
    },
  };
};

export default connect(setStateToProps, setActionToProps)(Notification);