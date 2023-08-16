import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { loginUser, displayError } from '../../_actions/actions';
import { login } from '../../_services/services';
import { Button, Dialog, DialogActions, DialogContent, TextField, CircularProgress } from '@material-ui/core'
import { withFormik } from 'formik'
import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles({
    dialogContent: {
        padding: 25,
    },
    text: {
        marginBottom: 15,
    },
    error: {
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
        <Dialog onClose={onClose} open={open} maxWidth="xs" fullWidth>
            <form onSubmit={handleSubmit}>
                <DialogContent className={classes.dialogContent}>
                    <TextField variant="outlined" label="Username" fullWidth className={classes.text}
                        name="username" value={values.username} onChange={handleChange}
                    />
                    <TextField variant="outlined" label="Password" fullWidth className={classes.text}
                        type="password" name="password" value={values.password} onChange={handleChange}
                    />
                    {errors.password && touched.password && <div className={classes.error}>{errors.password}</div>}
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => {onClose();resetForm()}} variant="outlined" color="secondary">Cancel</Button>
                    <Button type="submit" variant="contained" color="primary">
                        {isSubmitting ? <CircularProgress color="inherit" size="1.8em" /> : "Log In"}
                    </Button>
                </DialogActions>
            </form>
        </Dialog>
    )
}

const LoginForm = withFormik({
    mapPropsToValues: () => ({
        username: "",
        password: "",
    }),
    handleSubmit: (values, { props, setErrors, setSubmitting, resetForm }) => {
        
        login(values.username, values.password)
            .then(res => {
                props.loginUser(values.username, values.password, res.data.access_token)
                resetForm()
                props.onClose()
            })
            .catch(res => {
                if (res.response.status === 400) {
                    setErrors({ "password": "Username and password do not match" })
                } else {
                    props.displayError({ code: res.response.status, msg: "Server is Unreachable. Please try again later." })
                }
            })
            .finally(() => setSubmitting(false))
    },
})(Form);

const mapStateToProps = state => ({
    code: state.status
})

export default connect(mapStateToProps, { loginUser, displayError })(LoginForm);