import React, { useEffect } from "react";
import {
  Dialog,
  TextField,
  DialogContent,
  DialogActions,
  Button,
  CircularProgress,
} from "@material-ui/core";
import { connect } from "react-redux";
import { withFormik } from "formik";
import { addFolder, editFolder, displayError } from "../../_actions/actions";
import { addData, editData } from "../../_services/services";
import { makeStyles } from "@material-ui/core";

const useStyles = makeStyles({
  text: {
    marginBottom: 15,
  },
  error: {
    color: "red",
    marginBottom: 10,
  },
});

const Form = (props) => {
  const classes = useStyles();
  const {
    values,
    errors,
    touched,
    handleChange,
    handleSubmit,
    isSubmitting,
    onClose,
    open,
    resetForm,
  } = props;

  useEffect(() => {
    if (props.code.code !== 0) onClose();
    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.code.code]);

  return (
    <>
      <Dialog onClose={onClose} open={open} maxWidth="xs" fullWidth>
        <form onSubmit={handleSubmit}>
          <DialogContent>
            <TextField
              variant="outlined"
              label="Name"
              fullWidth
              className={classes.text}
              name="name"
              value={values.name}
              onChange={handleChange}
              error={errors.name && touched.name}
            />
            {errors.name && touched.name && (
              <div className={classes.error}>{errors.name}</div>
            )}
          </DialogContent>
          <DialogActions>
            <Button
              onClick={() => {
                onClose();
                resetForm();
              }}
              variant="outlined"
              color="secondary"
            >
              Cancel
            </Button>
            <Button onClick={handleSubmit} variant="contained" color="primary">
              {isSubmitting ? <CircularProgress color="inherit" /> : "Save"}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </>
  );
};

const FolderForm = withFormik({
  mapPropsToValues: (props) => {
    return {
      _id: props.folder._id,
      name: props.folder.name,
    };
  },
  handleSubmit: (values, { props, setSubmitting, setErrors, resetForm }) => {
    if (values._id !== -1 && values._id !== 0) {
      editData(`folders/${values._id}/`, { _id: values._id, name: values.name })
        .then((res) => {
          props.onClose();
          resetForm();
          props.editFolder(res.data);
        })
        .catch((res) => {
          if (res.response.status === 400) {
            setErrors(res.response.data);
          } else {
            props.displayError({
              code: res.response.status,
              msg: "Server is Unreachable. Please try again later.",
            });
          }
        })
        .finally(setSubmitting(false));
    } else {
      addData(`folders/`, { name: values.name })
        .then((res) => {
          props.onClose();
          resetForm();
          props.addFolder(res.data);
        })
        .catch((res) => {
          if (res.response.status === 400) {
            setErrors(res.response.data);
          } else {
            props.displayError({
              code: res.response.status,
              msg: "Server is Unreachable. Please try again later.",
            });
          }
        })
        .finally(setSubmitting(false));
    }
  },
  validate: (values, props) => {
    let errors = {};
    if (!values.name) errors.name = "Required";
    if (
      props.foldersArray.map((f) => Object.values(f)[1]).includes(values.name)
    )
      errors.name = "Folder name can't be same";
    return errors;
  },
  enableReinitialize: true,
})(Form);

const mapStateToProps = (state, ownProps) => {
  let folder = { _id: -1, name: "", uid: 0 };
  if (ownProps.folder !== -1 && ownProps.folder !== 0) {
    state.folders.filter((folder) => {
      return false;
    });
    folder = state.folders.filter(
      (folder) => folder._id === ownProps.folder
    )[0];
  }
  return {
    folder: folder,
    foldersArray: state.folders,
    code: state.status,
  };
};

export default connect(mapStateToProps, {
  addFolder,
  editFolder,
  displayError,
})(FolderForm);
