import React, { useState } from 'react';
import { Grid, Container, Tabs, Tab } from '@material-ui/core';
import { connect } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import FullName from './Forms/SettingsForms/FullName';
import Email from './Forms/SettingsForms/Email';
import Username from './Forms/SettingsForms/Username';
import Password from './Forms/SettingsForms/Password';
import UserDelete from './Forms/SettingsForms/UserDelete';
import { withRouter } from 'react-router-dom';

const useStyles = makeStyles({
    wrapper: {
        marginTop: "1em",
        direction: "row",
    },
    grid: {
        display: "flex",
        justifyContent: "right",
        paddingRight: "1em",
    },
    tabContent: {
        paddingLeft: "1em",
    },
    tab: {
        border: "1px solid lightgray",
    },
    space: {
        margin: "2em",
    }
})

function TabPanel(props) {
    return (
        <>
            {props.value === props.index ? props.children : null}
        </>
    )
}

function SettingsPage(props) {
    const classes = useStyles();
    const [value, setValue] = useState(0)
    const handleChange = (evenv, newValue) => {
        setValue(newValue)
    }

    return (
        <>
            <Container maxWidth="lg">
                <Grid container className={classes.wrapper}>
                    <Grid item xs={4} className={classes.grid}>
                        <Tabs
                            value={value}
                            orientation="vertical"
                            onChange={handleChange}
                            indicatorColor="primary"
                            variant="scrollable"
                        >
                            <Tab label={"Profile"} className={classes.tab}></Tab>
                            <Tab label={"Account"} className={classes.tab}></Tab>
                            <Tab label={"Security"} className={classes.tab}></Tab>
                        </Tabs>
                    </Grid>
                    <Grid item xs={5} className={classes.tabContent}>
                        <TabPanel index={0} value={value}>
                            <FullName history={props.history} />
                        </TabPanel>
                        <TabPanel index={1} value={value}>
                            <Username history={props.history} />
                            <div className={classes.space}></div>
                            <Email history={props.history} />
                            <div className={classes.space}></div>
                            <UserDelete history={props.history} />
                        </TabPanel>
                        <TabPanel index={2} value={value}>
                            <Password history={props.history} />
                        </TabPanel>
                    </Grid>
                </Grid>
            </Container>
        </>
    )
}

const mapStateToProps = state => ({
    token: state.token,
})

export default withRouter(connect(mapStateToProps, {})(SettingsPage));
