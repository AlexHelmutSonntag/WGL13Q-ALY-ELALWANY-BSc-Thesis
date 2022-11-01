import React from "react";
import {DiscardFormButton} from "./FormButton";
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
} from "@mui/material";

interface DialogProps {
    openDialog: boolean;
    buttonText: string;
    buttonColor: string;
    dialogContentText: string;
    dialogTitle: string;
    passResponseToParent?: (value: boolean) => void;
}

export const CustomDialogComponent: React.FC<DialogProps> = (props: DialogProps) => {

    console.log(`in child : ${props.openDialog}`)
    const [dialogState, setDialogState] = React.useState({
        openDialog: props.openDialog,
        dialogContentText: props.dialogContentText ? props.dialogContentText : "Enter dialog content text",
        dialogTitle: props.dialogTitle ? props.dialogTitle : "Enter dialog title",
        buttonText: props.buttonText ? props.buttonText : "Open dialogue",
        buttonColor: props.buttonColor ? props.buttonColor : "red",
    });

    const handleClose = (decisionRecorded: boolean) => {
        setDialogState({...dialogState, openDialog: false})
        if (props.passResponseToParent) {
            props.passResponseToParent(decisionRecorded);
        }
    };

    return (
        <div>
            <DiscardFormButton onClick={() =>setDialogState({...dialogState, openDialog: true})}>{dialogState.buttonText}</DiscardFormButton>
            <Dialog
                open={dialogState.openDialog}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">
                    {dialogState.dialogTitle}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        {dialogState.dialogContentText}
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => handleClose(false)}>No</Button>
                    <Button onClick={() => handleClose(true)} autoFocus>
                        Yes
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    )
}


