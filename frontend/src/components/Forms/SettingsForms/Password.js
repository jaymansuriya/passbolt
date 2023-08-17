import React from 'react';
import { connect } from 'react-redux';
import { withFormik } from 'formik'
import { Button, TextField, CircularProgress } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import { updateVaultsAfterUserChange, displayError } from '../../../_actions/actions'
import { produceKey } from '../../../_services/services';
import axios from 'axios';
const dotenv = require("dotenv");
dotenv.config();

const BACKEND_URL = process.env.BACKEND_URL || "https://passbolt.onrender.com"

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
            <form>
                <TextField variant="outlined" label="Current Password" fullWidth className={classes.text}
                    name="password" value={values.password} onChange={handleChange} type="password"
                    error={errors.password && touched.password}
                />
                {errors.password && touched.password && <div className={classes.error}>{errors.password}</div>}
                <TextField variant="outlined" label="New Password" fullWidth className={classes.text}
                    name="password2" value={values.password2} onChange={handleChange} type="password"
                    error={errors.password2 && touched.password2}
                />
                {errors.password2 && touched.password2 && <div className={classes.error}>{errors.password2}</div>}
                <TextField variant="outlined" label="Repeat New Password" fullWidth className={classes.text}
                    name="password3" value={values.password3} onChange={handleChange} type="password"
                    error={errors.password3 && touched.password3}
                />
                {errors.password3 && touched.password3 && <div className={classes.error}>{errors.password3}</div>}
                <Button onClick={handleSubmit} variant="contained" color="primary">
                    {isSubmitting ? <CircularProgress color="inherit" size="1.8em" /> : "Save"}
                </Button>
            </form>
        </>
    )
}

const FullName = withFormik({
    mapPropsToValues: props => ({
        password: "",
        password2: "",
        password3: "",
    }),
    validate: (values, props) => {
        const errors = {}

        if (!values.password)
            errors.username = "Required"
        if (values.password2 !== values.password3)
            errors.password3 = "Passwords do not match"
        if (values.password === values.password2)
            errors.password2 = "New password can't be the same as old one"
        if (produceKey(props.user.username, values.password) !== props.enckey)
            errors.password = "Password is incorrect"

        return errors
    },
    handleSubmit: (values, { props, setSubmitting, setErrors }) => {
        axios.post(`${BACKEND_URL}/api/v1/users/set_password/`, {
            current_password: values.password,
            new_password: values.password2,
            re_new_password: values.password3,
        }, {
            headers: { Authorization: `Bearer ${props.token}` }
        })
            .then(() => {
                props.updateVaultsAfterUserChange(props.user.username, values.password2)
                props.displayError({ code: 200, msg: "Password Changed" })
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
                props.history.push('/vault')
            })
    },
    enableReinitialize: true,
})(NameForm)

const mapStateToProps = state => ({
    user: state.user,
    enckey: state.key,
    token: state.token,
})

export default connect(mapStateToProps, { updateVaultsAfterUserChange, displayError })(FullName)