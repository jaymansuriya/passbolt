import React from 'react';
import { connect } from 'react-redux';
import { withFormik } from 'formik'
import { Button, TextField, CircularProgress, Typography } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import { editData } from '../../../_services/services'
import { editUser, updateVaultsAfterUserChange, displayError } from '../../../_actions/actions'
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
    return (
        <>
            <Typography className={classes.text}>Change your Username</Typography>
            <form>
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
                <Button onClick={handleSubmit} variant="contained" color="primary">
                    {isSubmitting ? <CircularProgress color="inherit" size="1.8em" /> : "Save"}
                </Button>
            </form>
        </>
    )
}

const FullName = withFormik({
    mapPropsToValues: props => ({
        username: props.user.username || "",
        password: "",
    }),
    validate: (values, props) => {
        const errors = {}

        if (props.user.username === values.username)
        errors.username = "Username can't be the same"
        if (produceKey(props.user.username, values.password) !== props.enckey)
        errors.password = "Password is incorrect"
        if (!values.username)
            errors.username = "Required"
        if (!values.password)
            errors.password = "Required"

        return errors
    },
    handleSubmit: (values, { props, setSubmitting, setErrors }) => {
        editData(`users/`, { ...props.user, username: values.username })
            .then(res => {
                props.updateVaultsAfterUserChange(res.data.username, values.password)
                props.editUser(res.data)
                props.displayError({ code: 200, msg: "Username Changed" })
            })
            .catch(res => {
                if (res.response.status === 400) {
                    setErrors(res.response.data)
                } else {
                    props.displayError({ code: res.response.status, msg: "Server is Unreachable. Please try again later." })
                }
            })
            .finally(() => {
                setSubmitting(false)
            })
    },
    enableReinitialize: true,
})(NameForm)

const mapStateToProps = state => ({
    user: state.user,
    enckey: state.key,
})

export default connect(mapStateToProps, { editUser, updateVaultsAfterUserChange, displayError })(FullName);