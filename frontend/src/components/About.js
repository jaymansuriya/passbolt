import React from 'react';
import { Container, Typography, Grid } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { indigo } from '@material-ui/core/colors';

const useStyles = makeStyles(theme => ({
    wrapper: {
        display: "flex",
    },
    title: {
        color: indigo[900],
        marginBottom: "0.5em",
    },
    main: {
        alignSelf: "center",
    },
    content: {
        marginBottom: "5em",
    },
    margin: {
        marginBottom: "2em",
    }
}))

function About(props) {
    const classes = useStyles();
    return (
        <>
            <Container className={classes.wrapper} maxWidth="md">
                <Grid xs={12} sm={6} item className={classes.main}>
                    <Typography variant="h4" className={classes.title}>What is PassBolt?</Typography>
                    <Typography>
                        PassBolt is a password manager made with security in mind.
                        You only have to remember one master password which will unlock
                        all of your other passwords which are securely stored into vaults.
                        </Typography>
                </Grid>
                <Grid xs={12} sm={6} item >
                    <img src="/static/pm4.png" width="100%" alt="Security" />
                </Grid>
            </Container>
            <Container maxWidth="md">
                <Grid container align="center" spacing={5}>
                    <Grid item xs={12}>
                        <Typography variant="h4" className={classes.title}>We Care About Your Security</Typography>
                        <Typography variant="h6" className={classes.margin}>
                            We Give The Highest Priority To Your Privacy And Security...
                        </Typography>
                    </Grid>
                    <Grid item md={4} xs={12} className={classes.content}>
                        <Typography className={classes.title} variant="h5">
                            Client Side Processing
                        </Typography>
                        <Typography>
                            We perform all of the encryption and decryption locally in your browser.
                            None of your username or password ever end up on our servers
                            unsecured.
                        </Typography>
                    </Grid>
                    <Grid item md={4} xs={12} className={classes.content}>
                        <Typography className={classes.title} variant="h5">
                            Very Strong Encryption
                        </Typography>
                        <Typography>
                            We use 256-bit AES to encrypt your data. This is impossible
                            to break combined with unique keys derived from your master
                            password.
                        </Typography>
                    </Grid>
                    <Grid item md={4} xs={12} className={classes.content}>
                        <Typography className={classes.title} variant="h5">
                            Uncrackable Hashing
                        </Typography>
                        <Typography>
                            We derive encryption key by processing your password through
                            PBKDF2 and salting from SHA-256. This key is impossible to predict.
                        </Typography>
                    </Grid>
                </Grid>
            </Container>
        </>
    )
}

export default About;