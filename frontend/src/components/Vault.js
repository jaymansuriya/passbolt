import React, { useState } from 'react';
import { connect } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import { Dialog, DialogContent, DialogActions, Button, Tooltip } from '@material-ui/core';
import { Card, CardContent, CardActions, IconButton, Typography } from '@material-ui/core'
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import FileCopyIcon from '@material-ui/icons/FileCopy';
import { deleteVault, displayError } from '../_actions/actions';

const useStyles = makeStyles({
    cardTitle: {
        flexGrow: 1,
        textAlign: "center",
    },
    cardContent: {
        flexGrow: 1,
    },
    cardActions: {
        justifyContent: "flex-end",
    },
})

function Vault(props) {
    const classes = useStyles();

    const [dialog, setDialog] = useState(false);
    const openDialog = () => setDialog(true)
    const closeDialog = () => setDialog(false)

    return (
        <>
            <Card raised>
                <CardContent className={classes.cardTitle}>
                    <Typography variant="h6" noWrap>
                        {props.name}
                    </Typography>
                </CardContent>
                <CardContent className={classes.cardContent}>
                    <Typography noWrap>
                        Username: {props.username}
                    </Typography>
                </CardContent>
                <CardActions className={classes.cardActions}>
                    <Tooltip title="Copy Password"><IconButton size="small" onClick={() => { navigator.clipboard.writeText(props.password); props.displayError({ code: 200, msg: "Password Copied" }) }}><FileCopyIcon /></IconButton></Tooltip>
                    <Tooltip title="Edit"><IconButton size="small" color="primary" onClick={() => props.onEdit(props._id)}><EditIcon /></IconButton></Tooltip>
                    <Tooltip title="Delete"><IconButton size="small" color="secondary" onClick={openDialog}><DeleteIcon /></IconButton></Tooltip>
                </CardActions>
            </Card>
            <Dialog open={dialog} onClose={closeDialog}>
                <DialogContent>
                    {`Are you sure you want to delete ${props.name} ?`}
                </DialogContent>
                <DialogActions>
                    <Button variant="outlined" color="primary" onClick={closeDialog}>Cancel</Button>
                    <Button variant="contained" color="secondary" onClick={() => { props.deleteVault(props._id); closeDialog() }}>Delete</Button>
                </DialogActions>
            </Dialog>
        </>
    )
}

export default connect(null, { deleteVault, displayError })(Vault);