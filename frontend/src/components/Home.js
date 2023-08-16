import React from 'react';
import { Container, Typography, Grid } from '@material-ui/core';
import { grey, indigo } from '@material-ui/core/colors';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles({
    back: {
        backgroundColor: grey[300],
    },
    wrapper: {
        marginBottom: "5em",
        display: "flex",
        justifyContent: "center",
    },
    title: {
        marginTop: "1em",
        color: indigo[900],
    },
    topics: {
        color: grey[700],
    },
})

function About(props) {
    const classes = useStyles();
    return (
        <Container maxWidth="xl" className="back" >
            <Container maxWidth="sm">
                <video autoPlay loop muted width="100%" height="100%">
                    <source src="/static/mainvid.webm" />
                </video>
            </Container>
            <Container maxWidth="lg" className={classes.wrapper}>
                <Grid container align="center" spacing={6}>
                    <Grid item xs={12}>
                        <Typography variant="h4" className={classes.title}>
                            Passwords Are Frustrating...
                        </Typography>
                        <Typography variant="h6">
                            With PassBolt, you never have to worry about them. Ever Again...
                        </Typography>
                    </Grid>
                    <Grid item sm={6} md={4}>
                        <img src="/static/pm1.png" alt="Time" />
                        <Typography variant="h5" className={classes.title}>
                            Save Time
                        </Typography>
                        <Typography variant="h6" className={classes.topics}>
                            Using a password manager will save you time since you don't have to recall passwords for each website
                        </Typography>
                    </Grid>
                    <Grid item sm={6} md={4}>
                        <img src="/static/pm2.png" alt="Access" />
                        <Typography variant="h5" className={classes.title}>
                            Single Password
                        </Typography>
                        <Typography variant="h6" className={classes.topics}>
                            You only have to remember one password which will give you access to all of your other passwords.
                        </Typography>
                    </Grid>
                    <Grid item sm={6} md={4}>
                        <img src="/static/pm3.png" alt="Anywhere" />
                        <Typography variant="h5" className={classes.title}>
                            Access Anywhere
                        </Typography>
                        <Typography variant="h6" className={classes.topics}>
                            PassBolt can be used on any device, giving you easy access to your passwords. Anytime. Anywhere.
                        </Typography>
                    </Grid>
                </Grid>
            </Container>
        </Container>
    )
}

export default About;