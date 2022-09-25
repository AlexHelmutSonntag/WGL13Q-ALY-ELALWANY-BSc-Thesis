import Button, {ButtonProps} from '@mui/material/Button';
import {styled} from '@mui/material/styles';

interface StyledButtonProps extends ButtonProps {
    success?: boolean;
}

const FormButtonStyles = {
    "background-color": "#5BC0BE",
    "width": '20ch',
    "height": '5ch',
    "color": "#FFFFFF",
    "font-weight": "bold",
    "padding": 10,
    "margin-bottom": 10,
    "margin-top": 10,
    "margin-left": 5,
    "margin-right": 5,
    "border-radius": 10,
    "textTransform": "none",
    '&:hover': {
        "background-color": "#FFFFFF",
        "color": "#5BC0BE",
    }
}
export const DiscardFormButton = styled(Button)<StyledButtonProps>({
    "background-color": "rgba(28,37,65,0.5)",
    "width": '20ch',
    "height": '5ch',
    "color": "#FFFFFF",
    "font-weight": "bold",
    "padding": 10,
    "margin-bottom": 10,
    "margin-top": 10,
    "margin-left": 5,
    "margin-right": 5,
    "border-radius": 10,
    "textTransform": "none",
    '&:hover': {
        "background-color": "#1C2541",
    }
});

export const RedFormButton = styled(Button)<StyledButtonProps>({
    "width": '20ch',
    "height": '5ch',
    "fontWeight": "bold",
    "padding": 10,
    "marginBottom": 10,
    "marginTop": 10,
    "marginLeft": 5,
    "marginRight": 5,
    backgroundColor: '#ff0000',
    color: "#FFFFFF",
    "borderRadius": 10,
    textTransform: "none",
    '&:hover': {
        "&.MuiButton-root": {
            backgroundColor: '#FFFFFF'
        },
        "color": "#ff0000",
        "background-color": "#FFFFFF",
    }
});

export const ReturnFormButton = styled(Button)({
    "background-color": "#5BC0BE",
    "width": '20ch',
    "height": '5ch',
    "color": "#FFFFFF",
    "font-weight": "bold",
    "padding": 10,
    "margin-bottom": 10,
    "margin-top": 10,
    "margin-left": 5,
    "margin-right": 5,
    "border-radius": 10,
    "textTransform": "none",
    '&:hover': {
        "background-color": "#FFFFFF",
        "color": "#5BC0BE",
    }
}) as typeof Button;

export const ApplyFilterButton = styled(Button)({
    "background-color": "#5BC0BE",
    "width": '10ch',
    "height": '5ch',
    "color": "#FFFFFF",
    "font-weight": "bold",
    "padding": 10,
    "margin-bottom": 10,
    "margin-top": 10,
    "margin-left": 5,
    "margin-right": 5,
    "border-radius": 15,
    "textTransform": "none",
    '&:hover': {
        "background-color": "#FFFFFF",
        "color": "#5BC0BE",
    }
}) as typeof Button;



