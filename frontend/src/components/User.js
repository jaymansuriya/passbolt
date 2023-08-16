import React, { useState, useEffect } from 'react';
import { Button, Menu, MenuItem, Avatar, Link, Divider } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import SettingsIcon from '@material-ui/icons/Settings';
import ImportExportIcon from '@material-ui/icons/ImportExport';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import LoginForm from './Forms/LoginForm';
import SignupForm from './Forms/SignupForm';
import { connect } from 'react-redux';
import { logoutUser } from '../_actions/actions';
import { withRouter } from 'react-router-dom';

const useStyles = makeStyles({
    link: {
        marginLeft: "1.5em",
        fontFamily: "Roboto Condensed",
        '&:hover': {
            cursor: "pointer",
        }
    },
    logout: {
        color: "#c00",
    },
    avatar: {
        height: "1.5em",
        width: "1.5em",
        marginRight: "0.2em",
    },
})

function User(props) {
    const classes = useStyles();
    const [anchorEl, setAnchorEl] = useState(null)
    const handleClick = event => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    const [login, setLogin] = useState(false);
    const openLogin = () => {
        setLogin(true)
    }
    const closeLogin = () => {
        setLogin(false)
    }

    const [signup, setSignup] = useState(false);
    const openSignup = () => {
        setSignup(true)
    }
    const closeSignup = () => {
        setSignup(false)
    }

    useEffect(() => {
        if (props.user.username) {
            if (!window.sessionStorage.getItem("loggedIn")) {
                window.sessionStorage.setItem("loggedIn", true)
                props.history.push('/vault')
            }
        }
        //eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props.user])

    return (
        <>
            {
                props.user.username === undefined ?
                    <>
                        <Button variant="outlined" color="primary" className={classes.link} onClick={openLogin} >Log In</Button>
                        <Button variant="contained" color="primary" className={classes.link} onClick={openSignup}>Sign Up</Button>
                    </> :
                    <>
                        <Link className={classes.link} onClick={() => props.history.push("/vault")}>Vaults</Link>
                        <Link className={classes.link} onClick={() => props.history.push("/folder")}>Folders</Link>
                        <Link className={classes.link} onClick={() => props.history.push("/generate")}>Generate Password</Link>
                        <Button size="large" className={classes.link} onClick={handleClick}>
                            <Avatar className={classes.avatar}>{props.user.first_name[0]}</Avatar>{props.user.first_name} {props.user.last_name} <ExpandMoreIcon />
                        </Button>
                        <Menu
                            anchorEl={anchorEl}
                            keepMounted
                            open={Boolean(anchorEl)}
                            onClose={handleClose}
                            anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
                            transformOrigin={{ vertical: "top", horizontal: "center" }}
                            getContentAnchorEl={null}
                        >
                            <MenuItem onClick={() => { handleClose(); props.history.push("/analyze") }}><LockOutlinedIcon /> Analyze</MenuItem>
                            <MenuItem onClick={() => { handleClose(); props.history.push("/settings") }}><SettingsIcon /> Settings</MenuItem>
                            <Divider />
                            <MenuItem onClick={() => { handleClose(); props.logoutUser() }} className={classes.logout}><ExitToAppIcon /> Logout</MenuItem>
                        </Menu>
                    </>
            }
            <LoginForm open={login} onClose={closeLogin} />
            <SignupForm open={signup} onClose={closeSignup} />
        </>
    )
}

const mapStateToProps = state => ({
    user: state.user,
})

export default withRouter(connect(mapStateToProps, { logoutUser })(User));