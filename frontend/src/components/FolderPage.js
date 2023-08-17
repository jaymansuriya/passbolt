import React, { useState } from 'react';
import { Container, Paper, Typography, Button, Dialog, DialogContent, DialogActions, Tooltip, IconButton } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux';
import FolderForm from './Forms/FolderForm';
import { deleteFolder } from '../_actions/actions';
import HelpOutlineIcon from '@material-ui/icons/HelpOutline';

const useStyles = makeStyles({
    paper: {
        display: "flex",
        alignItems: "center",
        height: 50,
        margin: 15,
        padding: 15,
    },
    text: {
        display: "flex",
        flexGrow: 1,
    },
    btn: {
        marginLeft: 15,
    },
    addButton: {
        display: "flex",
        justifyContent: "flex-end",
        marginRight: "2em",
        marginTop: "1em",
    }
});

function FolderPage(props) {
    const classes = useStyles();

    const [dialog, setDialog] = useState(0);
    const openDialog = id => {
        setDialog(id)
    };
    const closeDialog = () => setDialog(0);

    const [del, setDel] = useState(0);
    const openDelete = id => setDel(id);
    const closeDelete = () => setDel(0);

    const help = "A Folder is a container for vaults. A Folder groups together similar vaults for organization and convenience."

    return (
        <>
            <Container maxWidth="lg">
                <div className={classes.addButton}>
                    <Tooltip title={help}><IconButton><HelpOutlineIcon /></IconButton></Tooltip>
                    <Button variant="contained" color="primary" onClick={() => openDialog(-1)}>Add Folder</Button>
                </div>
                {props.folders.map(folder => (
                    <Paper className={classes.paper} key={folder._id}>
                        <Typography className={classes.text}>
                            {folder.name}
                        </Typography>
                        <div>
                            <Button variant="contained" color="primary" className={classes.btn} onClick={() => openDialog(folder._id)}>Edit</Button>
                            <Button variant="outlined" color="secondary" className={classes.btn} onClick={() => openDelete(folder._id)}>Delete</Button>
                        </div>
                    </Paper>
                ))}
            </Container>
            <Dialog open={Boolean(del)} onClose={closeDelete}>
                <DialogContent>
                    {`Deleteing this folder will delete all items inside it.`}
                </DialogContent>
                <DialogActions>
                    <Button variant="outlined" color="primary" onClick={closeDelete}>Cancel</Button>
                    <Button variant="contained" color="secondary" onClick={() => { props.deleteFolder(del); closeDelete() }}>Delete</Button>
                </DialogActions>
            </Dialog>
            <FolderForm open={Boolean(dialog)} folder={dialog} onClose={closeDialog} />
        </>
    )
}

const mapStateToProps = state => ({
    folders: state.folders.sort((a, b) => a._id - b._id),
    token: state.token,
})

export default connect(mapStateToProps, { deleteFolder })(FolderPage);