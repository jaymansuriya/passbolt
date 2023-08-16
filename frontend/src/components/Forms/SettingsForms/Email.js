import React from 'react';
import { connect } from 'react-redux';
import { withFormik } from 'formik'
import { Button, TextField, CircularProgress } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import { editData } from '../../../_services/services'
import { editUser, displayError } from '../../../_actions/actions'

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

function EmailForm(props) {
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
                <TextField variant="outlined" label="Email" fullWidth className={classes.text}
                    name="email" value={values.email} onChange={handleChange}
                    error={errors.email && touched.email}
                />
                {errors.email && touched.email && <div className={classes.error}>{errors.email}</div>}
                <Button onClick={handleSubmit} variant="contained" color="primary">
                    {isSubmitting ? <CircularProgress color="inherit" size="1.8em" /> : "Save"}
                </Button>
            </form>
        </>
    )
}

const Email = withFormik({
    mapPropsToValues: props => ({
        email: props.email || "",
    }),
    validate: values => {
        const errors = {}

        if (!values.email)
            errors.email = "Required"

        return errors
    },
    handleSubmit: (values, { props, setSubmitting, setErrors }) => {
        editData(`users/`, { ...props.user, email: values.email })
            .then(res => {
                props.editUser(res.data)
                props.displayError({ code: 200, msg: "Email Changed" })
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
})(EmailForm)

const mapStateToProps = state => ({
    email: state.user.email,
    user: state.user,
})

export default connect(mapStateToProps, { editUser, displayError })(Email)