import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { Button, Dialog, DialogActions, DialogContent, TextField, CircularProgress } from '@material-ui/core'
import { withFormik } from 'formik'
import { makeStyles } from '@material-ui/core/styles'
import { addUser, displayError } from '../../_actions/actions'
import axios from 'axios';
const dotenv = require("dotenv");
dotenv.config();

const BACKEND_URL =  "https://passbolt.onrender.com"

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

const Form = props => {
    const classes = useStyles();
    const {
        open,
        onClose,
        values,
        errors,
        touched,
        handleChange,
        handleSubmit,
        isSubmitting,
        resetForm,
    } = props;
    
    useEffect(() => {
        if(props.code.code !== 0)
            onClose()
            //eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props.code.code])

    return (
        <Dialog open={open} maxWidth="xs" fullWidth>
            <form onSubmit={handleSubmit}>
                <DialogContent className={classes.dialogContent}>
                    <TextField variant="outlined" label="Username" fullWidth className={classes.text}
                        name="username" value={values.username} onChange={handleChange}
                        error={errors.username && touched.username}
                    />
                    {errors.username && touched.username && <div className={classes.error}>{errors.username}</div>}
                    <TextField variant="outlined" label="E-mail" fullWidth className={classes.text}
                        name="email" value={values.email} onChange={handleChange}
                        error={errors.email && touched.email}
                    />
                    {errors.email && touched.email && <div className={classes.error}>{errors.email}</div>}
                    <TextField variant="outlined" label="Password" fullWidth className={classes.text}
                        name="password" type="password" value={values.password} onChange={handleChange}
                        error={errors.password && touched.password}
                    />
                    {errors.password && touched.password && <div className={classes.error}>{errors.password}</div>}
                    <TextField variant="outlined" label="Password Repeat" fullWidth className={classes.text}
                        name="password2" type="password" value={values.password2} onChange={handleChange}
                        error={errors.password2 && touched.password2 && values.password !== values.password2}
                    />
                    {errors.password2 && touched.password2 && <div className={classes.error}>{errors.password2}</div>}
                    <TextField variant="outlined" label="First Name" fullWidth className={classes.text}
                        name="first_name" value={values.first_name} onChange={handleChange}
                        error={errors.first_name && touched.first_name}
                    />
                    {errors.first_name && touched.first_name && <div className={classes.error}>{errors.first_name}</div>}
                    <TextField variant="outlined" label="Last Name" fullWidth className={classes.text}
                        name="last_name" value={values.last_name} onChange={handleChange}
                        error={errors.last_name && touched.last_name}
                    />
                    {errors.last_name && touched.last_name && <div className={classes.error}>{errors.last_name}</div>}
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => { onClose(); resetForm() }} variant="outlined" color="secondary">Cancel</Button>
                    <Button type="submit" variant="contained" color="primary">
                        {isSubmitting ? <CircularProgress color="inherit" size="1.8em" /> : "Sign Up"}
                    </Button>
                </DialogActions>
            </form>
        </Dialog>
    )
}

const SignupForm = withFormik({
    mapPropsToValues: () => ({
        username: "",
        password: "",
        password2: "",
        email: "",
        first_name: "",
        last_name: "",
    }),
    handleSubmit: (values, { props, setSubmitting, setErrors, resetForm }) => {
        axios.post(`${BACKEND_URL}/api/v1/auth/signup/`, values)
            .then(res => {
                props.addUser(values.username, values.password)
                resetForm()
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

    },
    validate: values => {
        const errors = {}
        if (!values.username)
            errors.username = "Required"
        if (!values.email)
            errors.email = "Required"
        if (values.password.length < 8)
            errors.password = "Minimum length is 8"
        if (values.password !== values.password2)
            errors.password2 = "Passwords do not match"
        if (!values.first_name)
            errors.first_name = "Required"
        if (!values.last_name)
            errors.last_name = "Required"
        return errors
    }
})(Form);

const mapStateToProps = state => ({
    code: state.status
})

export default connect(mapStateToProps, { addUser, displayError })(SignupForm);