import React, { useEffect } from 'react';
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
import { createMuiTheme, ThemeProvider, makeStyles } from '@material-ui/core/styles'
import { connect } from 'react-redux';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Wrapper from './components/Wrapper';
import Generate from './components/Generate';
import Analyze from './components/Analyze';
import Home from './components/Home'
import FolderPage from './components/FolderPage'
import SettingsPage from './components/SettingsPage';
import About from './components/About'
import NotFound from './components/NotFound'
import { getToken, getKey, continueSession } from './_actions/actions';

const darkTheme = createMuiTheme({
    palette: {
        type: 'light'
    },
    typography: {
        fontFamily: 'Barlow, Roboto',
    },
})

const useStyles = makeStyles({
    app: {
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
    },
    top: {
        flexGrow: 1,
    },
})

function PrivateRoute({ children, ...rest }) {
    let isAuthenticated = Boolean(window.sessionStorage.getItem("access_token"))
    return (
        <Route {...rest} render={() => isAuthenticated ? children : <Redirect to='/' />} />
    )
}

function App(props) {
    useEffect(() => {
        let token = window.sessionStorage.getItem("access_token")
        let key = window.sessionStorage.getItem("enc-key")
        if (token && key) {
            props.getToken(token)
            props.getKey(key)
            props.continueSession(token)
        }
        //eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const classes = useStyles()

    return (
        <div className={classes.app}>
            <ThemeProvider theme={darkTheme}>
                <Router>
                    <div className={classes.top}>
                        <Navbar token={props.token} />
                        <Switch>
                            <Route exact path="/" component={Home} />
                            <PrivateRoute exact path="/vault/">
                                <Wrapper />
                            </PrivateRoute>
                            <PrivateRoute exact path="/folder/">
                                <FolderPage />
                            </PrivateRoute>
                            <PrivateRoute exact path="/settings/">
                                <SettingsPage />
                            </PrivateRoute>
                            <PrivateRoute exact path="/generate/">
                                <Generate />
                            </PrivateRoute>
                            <PrivateRoute exact path="/analyze/">
                                <Analyze />
                            </PrivateRoute>
                            <Route exact path="/about/" component={About} />
                            <Route exact path="*" component={NotFound} />
                        </Switch>
                    </div>
                    <Footer />
                </Router>
            </ThemeProvider>
        </div>
    );
}

const mapStateToProps = state => ({
    encKey: state.key,
    token: state.token,
})

export default connect(mapStateToProps, { getToken, getKey, continueSession })(App);
