import React, { useState } from 'react';
import { connect } from 'react-redux';
import { ExpansionPanel, ExpansionPanelDetails, ExpansionPanelSummary, Container, Typography, Button, IconButton, Tooltip } from '@material-ui/core'
import Folder from './Folder'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { makeStyles } from '@material-ui/core/styles';
import VaultForm from './Forms/VaultForm';
import HelpOutlineIcon from '@material-ui/icons/HelpOutline';

const useStyles = makeStyles({
    buttons: {
        marginTop: "1em",
        marginRight: "5em",
        display: "flex",
        justifyContent: "flex-end",
    },
    folder: {
        margin: 10,
    },
    expand: {
        backgroundColor: "whitesmoke"
    },
    default: {
        display: "flex",
        justifyContent: "center",
        alignItems: "stretch",
    }
})

function Wrapper(props) {
    const classes = useStyles();

    const [dialog, setDialog] = useState(false);
    const openDialog = () => setDialog(true)
    const closeDialog = () => setDialog(false)

    const help = "A Vault stores your username and password for one website."
    const help2 = "Open drop-down menu by clicking on your username and select folder."

    const folders = props.folders.map(folder => {
        return (
            <div className={classes.folder} key={folder._id}>
                <ExpansionPanel defaultExpanded className={classes.expand}>
                    <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                        <Typography variant="h6">
                            {folder.name}
                        </Typography>
                    </ExpansionPanelSummary>
                    <ExpansionPanelDetails>
                        <Folder {...folder} />
                    </ExpansionPanelDetails>
                </ExpansionPanel>
            </div>
        )
    })
    return (
        <div className="wrapper">
            {props.folders.length
                ? <div className={classes.buttons}>
                    <Tooltip title={help}><IconButton><HelpOutlineIcon /></IconButton></Tooltip>
                    <Button onClick={openDialog} variant="contained" size="large" color="primary" >Add Vault</Button>
                    <VaultForm open={dialog} onClose={closeDialog} />
                </div>
                : <div className={classes.default}>
                    <Typography align="center">Please create some folders.
                    <Tooltip title={help2}><IconButton><HelpOutlineIcon /></IconButton></Tooltip>
                    </Typography>
                </div>
            }
            <Container maxWidth="lg">
                {folders}
            </Container>
        </div>
    )
}

const mapState = state => ({
    folders: state.folders.sort((a, b) => a._id - b._id),
    token: state.token,
})

export default connect(mapState, {})(Wrapper);