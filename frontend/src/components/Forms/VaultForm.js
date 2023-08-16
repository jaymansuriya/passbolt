import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Button, TextField, IconButton, Dialog, DialogActions, DialogContent, MenuItem, InputAdornment, CircularProgress } from '@material-ui/core';
import { withFormik } from 'formik';
import { makeStyles } from '@material-ui/core';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';
import { addVault, editVault, displayError } from '../../_actions/actions';
import { addData, editData, encrypt, shouldUpdateVaults } from '../../_services/services';

const useStyles = makeStyles({
    dialogContent: {
        padding: 15,
    },
    text: {
        marginBottom: 10,
    },
    error: {
        color: "red",
        marginBottom: 10,
    }
});

const Form = props => {
    const classes = useStyles();
    const {
        open,
        onClose,
        values,
        errors,
        touched,
        handleSubmit,
        handleChange,
        isSubmitting,
        resetForm,
    } = props;

    const [showPass, setShowPass] = useState(false)
    const togglePass = () => setShowPass(!showPass)

    useEffect(() => {
        if (props.code.code !== 0)
            onClose()
        //eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props.code.code])

    return (
        <Dialog open={open} maxWidth="xs" fullWidth>
            <form onSubmit={handleSubmit}>
                <DialogContent className={classes.dialogContent}>
                    <TextField variant="outlined" label="Name" fullWidth className={classes.text}
                        name="name" value={values.name} onChange={handleChange} error={errors.name && touched.name}
                    />
                    {errors.name && touched.name && <div className={classes.error}>This Field is required</div>}
                    <TextField variant="outlined" label="Username" fullWidth className={classes.text}
                        name="username" value={values.username} onChange={handleChange} error={errors.username && touched.username}
                    />
                    {errors.name && touched.username && <div className={classes.error}>This Field is required</div>}
                    <TextField variant="outlined" label="Password" fullWidth className={classes.text}
                        type={showPass ? "text" : "password"} name="password" value={values.password} onChange={handleChange}
                        InputProps={{ endAdornment: <InputAdornment><IconButton onClick={togglePass}>{showPass ? <Visibility /> : <VisibilityOff />}</IconButton></InputAdornment> }}
                        error={errors.password && touched.password}
                    />
                    {errors.name && touched.password && <div className={classes.error}>This Field is required</div>}
                    <TextField variant="outlined" label="Folder" fullWidth className={classes.text}
                        select name="fid" value={values.fid} onChange={handleChange}>
                        {props.folders.map(folder => (
                            <MenuItem key={folder._id} value={folder._id}>{folder.name}</MenuItem>
                        ))}
                    </TextField>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => { onClose(); resetForm(); }} variant="outlined" color="secondary">Cancel</Button>
                    <Button variant="contained" color="primary" type="submit">
                        {isSubmitting ? <CircularProgress color="inherit" size="1.8em" /> : "Save"}
                    </Button>
                </DialogActions>
            </form>
        </Dialog>
    )
}

const VaultForm = withFormik({
    mapPropsToValues: (props) => ({
        _id: props.vault._id,
        name: props.vault.name,
        username: props.vault.username,
        password: props.vault.password,
        fid: props.vault.fid || props.folders[0]._id,
    }),
    enableReinitialize: true,
    handleSubmit: (values, { props, setSubmitting, setErrors, resetForm }) => {
        if (values._id) {
            if (shouldUpdateVaults({ ...values }, props.vault)) {
                let data = { ...values, username: encrypt(values.username), password: encrypt(values.password) }
                editData(`vaults/${values._id}/`, data)
                    .then(res => {
                        props.editVault(data)
                        resetForm()
                        props.displayError({ code: 200, msg: "Vault Saved" })
                        props.onClose()
                    })
                    .catch(res => {
                        if (res.response.status === 400) {
                            setErrors(res.response.data)
                        } else {
                            props.displayError({ code: res.response.status, msg: "Server is Unreachable. Please try again later." })
                        }
                    })
                    .finally(setSubmitting(false))
            } else {
                resetForm()
                props.onClose()
                setSubmitting(false)
            }
        } else {
            let data = { ...values, username: encrypt(values.username), password: encrypt(values.password) }
            addData('vaults/', data)
                .then(res => {
                    props.onClose()
                    resetForm()
                    props.addVault(res.data)
                })
                .catch(res => {
                    setErrors({ "name": "Required" })
                })
                .finally(setSubmitting(false))
        }
    },
    validate: values => {
        const errors = {}
        if (!values.name)
            errors.name = true
        if (!values.username)
            errors.username = true
        if (!values.password)
            errors.password = true
        return errors
    }
})(Form)

const mapStateToProps = (state, ownProps) => {
    let vault = { _id: 0, name: "", username: "", password: "", fid: 0 };
    if (ownProps.vault) {
        vault = state.vaults.filter(vault => vault._id === ownProps.vault)[0]
    }
    return {
        vault,
        folders: state.folders,
        code: state.status,
    }
}

export default connect(mapStateToProps, { addVault, editVault, displayError })(VaultForm);