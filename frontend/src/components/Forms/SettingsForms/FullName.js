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
                <Button onClick={handleSubmit} variant="contained" color="primary">
                    {isSubmitting ? <CircularProgress color="inherit" size="1.8em" /> : "Save"}
                </Button>
            </form>
        </>
    )
}

const FullName = withFormik({
    mapPropsToValues: props => ({
        first_name: props.first_name || "",
        last_name: props.last_name || "",
    }),
    validate: values => {
        const errors = {}

        if (!values.first_name)
            errors.first_name = "Required"
        if (!values.last_name)
            errors.last_name = "Required"

        return errors
    },
    handleSubmit: (values, { props, setSubmitting, setErrors }) => {
        editData(`users/`, { ...props.user, first_name: values.first_name, last_name: values.last_name })
            .then(res => {
                props.editUser(res.data)
                props.displayError({ code: 200, msg: "Name Changed" })
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
    first_name: state.user.first_name,
    last_name: state.user.last_name,
    user: state.user,
})

export default connect(mapStateToProps, { editUser, displayError })(FullName)