import React from 'react';
import { Container, Typography, Grid } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { indigo } from '@material-ui/core/colors';

const useStyles = makeStyles(theme => ({
    title: {
        color: indigo[700],
        margin: "2em 0em",
    },
}))

function About(props) {
    const classes = useStyles();
    return (
        <>
            {/* <Typography variant="h1" className={classes.title}>Page Not Found.</Typography> */}
            <Container maxWidth="md">
                <Grid align="center">
                    <Typography variant="h2" className={classes.title}>Page Not Found.</Typography>
                </Grid>
            </Container>
        </>
    )
}

export default About;