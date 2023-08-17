import React from 'react';
import { Table, Container, TableBody, TableCell, TableHead, TableRow, Card } from '@material-ui/core';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux';
import { } from '../_actions/actions';

const useStyles = makeStyles({
    card: {
        height: "10px",
        width: "30%",
    },
    container: {
        marginTop: "4em",
        marginBottom: "4em",
    }
})

const StyledTableCell = withStyles(theme => ({
    head: {
        backgroundColor: theme.palette.common.black,
        color: theme.palette.common.white,
    },
    body: {
        fontSize: 14,
    },
}))(TableCell);

const StyledTableRow = withStyles(theme => ({
    root: {
        '&:nth-of-type(odd)': {
            backgroundColor: theme.palette.background.default,
        },
    },
}))(TableRow);


const analyzeStrength = (pass) => {
    let s = 0;
    if (pass.length > 7)
        s += 1
    if (pass.length > 15)
        s += 2
    if (pass.length > 23)
        s += 2
    if (pass.match(/[A-Z]/))
        s += 1
    if (pass.match(/[a-z]/))
        s += 1
    if (pass.match(/[0-9]/))
        s += 1
    if (pass.match(/[!@#$%&*-+=_:;,.?/]/))
        s += 2
    return s
}

function Analyze(props) {
    const classes = useStyles();
    const { vaults } = props;
    return (
        <>
            <Container maxWidth="md" className={classes.container}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <StyledTableCell>Sr</StyledTableCell>
                            <StyledTableCell>Name</StyledTableCell>
                            <StyledTableCell>Username</StyledTableCell>
                            <StyledTableCell>Password</StyledTableCell>
                            <StyledTableCell>Strength Indicator</StyledTableCell>
                            <StyledTableCell>Strength</StyledTableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {
                            vaults.map((v, i) => {
                                return <StyledTableRow key={v._id}>
                                    <StyledTableCell>{i + 1}</StyledTableCell>
                                    <StyledTableCell>{v.name}</StyledTableCell>
                                    <StyledTableCell>{v.username}</StyledTableCell>
                                    <StyledTableCell>
                                        {'*'.repeat(v.password.length)}
                                    </StyledTableCell>
                                    <StyledTableCell>
                                        <Card className={classes.card}
                                            style={{
                                                backgroundColor: analyzeStrength(v.password) > 3 ? analyzeStrength(v.password) > 6 ? "limegreen" : "orange" : "orangered",
                                                width: analyzeStrength(v.password) > 3 ? analyzeStrength(v.password) > 6 ? "90%" : "60%" : "30%"
                                            }} />
                                    </StyledTableCell>
                                    <StyledTableCell>
                                        {analyzeStrength(v.password) > 3 ? analyzeStrength(v.password) > 6 ? "Strong" : "Medium" : "Weak"}
                                    </StyledTableCell>
                                </StyledTableRow>
                            })
                        }
                    </TableBody>
                </Table>
            </Container>
        </>
    )
}

const mapStateToProps = state => ({
    vaults: state.vaults,
})

export default connect(mapStateToProps, {})(Analyze);