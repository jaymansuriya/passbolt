import React, { useState } from 'react';
import { connect } from 'react-redux';
import { withFormik } from 'formik'
import { Button, TextField, CircularProgress, Typography, Dialog, DialogContent, DialogActions, Divider } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import { deleteData } from '../../../_services/services'
import { displayError, logoutUser } from '../../../_actions/actions'
import { produceKey } from '../../../_services/services';

const useStyles = makeStyles({
    dialogContent: {
        padding: 25,
    },
    text: {
        marginBottom: 10,
    },
    error: {
        marginBottom: 10,
        color: "red",
    }
})

function NameForm(props) {
    const classes = useStyles()
    const {
        values,
        errors,
        touched,
        handleChange,
        handleSubmit,
        isSubmitting,
    } = props;

    const [dialog, setDialog] = useState(false)
    const openDialog = () => setDialog(true)
    const closeDialog = () => setDialog(false)

    return (
        <>
            <Typography className={classes.text}>Delete Your Account</Typography>
            <Button onClick={openDialog} variant="contained" color="secondary">Delete</Button>
            <Dialog open={dialog} onClose={closeDialog} maxWidth="xs" fullWidth>
                <form onSubmit={handleSubmit}>
                    <DialogContent>
                        <Typography className={classes.error}>This action can't be undone.</Typography>
                        <Divider className={classes.text} />
                        <Typography variant="caption">Account Credentials for Security Purposes</Typography>
                        <TextField variant="outlined" label="Username" fullWidth className={classes.text}
                            name="username" value={values.username} onChange={handleChange}
                            error={errors.username && touched.username}
                        />
                        {errors.username && touched.username && <div className={classes.error}>{errors.username}</div>}
                        <TextField variant="outlined" label="Password for verification" fullWidth className={classes.text}
                            name="password" value={values.password} onChange={handleChange} type="password"
                            error={errors.password && touched.password}
                        />
                        {errors.password && touched.password && <div className={classes.error}>{errors.password}</div>}
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={closeDialog} variant="outlined" color="secondary">Cancel</Button>
                        <Button type="submit" variant="contained" color="primary">
                            {isSubmitting ? <CircularProgress color="inherit" size="1.8em" /> : "Delete"}
                        </Button>
                    </DialogActions>
                </form>
            </Dialog>
        </>
    )
}

const FullName = withFormik({
    mapPropsToValues: () => ({
        username: "",
        password: "",
    }),
    validate: (values, props) => {
        const errors = {}

        if (props.user.username !== values.username)
            errors.username = "Username is incorrect"
        if (produceKey(props.user.username, values.password) !== props.enckey)
            errors.password = "Password is incorrect"
        if (!values.username)
            errors.username = "Required"
        if (!values.password)
            errors.password = "Required"

        return errors
    },
    handleSubmit: (values, { props, resetForm, setSubmitting }) => {
        deleteData(`users/`, values.password)
            .then(res => {
                resetForm()
                props.logoutUser(true)
                props.displayError({ code: 204, msg: "Your account has been Deleted." })
            })
            .catch(res => {
                console.log(res.response)
                if (res.response.status === 500) {
                    props.displayError({ code: res.response.status, msg: "Server is Unreachable. Please try again later." })
                }
            })
            .finally(setSubmitting(false))
    },
    enableReinitialize: true,
})(NameForm)

const mapStateToProps = state => ({
    user: state.user,
    enckey: state.key,
})

export default connect(mapStateToProps, { logoutUser, displayError })(FullName);