import React from 'react';
import { AppBar, Toolbar, Typography, Snackbar, IconButton } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import { makeStyles } from '@material-ui/core/styles';
import { useHistory } from 'react-router-dom';
import User from './User';
import { connect } from 'react-redux';
import { displayError, clearError } from '../_actions/actions';

const useStyles = makeStyles({
    toolbar: {
        flexWrap: 1,
        margin: "0em 2em",
    },
    toolbarTitle: {
        flexGrow: 1,
        fontFamily: "Roboto Condensed",
        fontSize: "2em",
        '&:hover': {
            cursor: "pointer",
        }
    },
    link: {
        marginLeft: 15,
        textDecoration: "none",
        color: "black",
        fontFamily: "Roboto Condensed",
    },
    icon: {
        color: "white",
    },
})

function Navbar(props) {
    const classes = useStyles();

    const handleClose = () => {
        props.clearError()
    }
    
    let history = useHistory()
    const homeRedirect = () => {
        history.push("/")
    }

    return (
        <>
            <AppBar position="static" style={{ background: 'transparent', boxShadow: 'none'}}>
                <Toolbar className={classes.toolbar}>
                    <Typography variant="h5" color="primary" className={classes.toolbarTitle}>
                        <span onClick={homeRedirect}>PassBolt</span>
                </Typography>
                    <User />
                </Toolbar>
            </AppBar>
            <Snackbar 
                anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "right",
                }}
                open={Boolean(props.status.code)}
                onClose={handleClose}
                autoHideDuration={5000}
                message={<span>{props.status.msg}</span>}
                action={
                    <IconButton onClick={handleClose} className={classes.icon}><CloseIcon /></IconButton>
                }
            />
        </>
    )
}

const mapStateToProps = state => ({
    status: state.status
})

export default connect(mapStateToProps, { displayError, clearError })(Navbar);