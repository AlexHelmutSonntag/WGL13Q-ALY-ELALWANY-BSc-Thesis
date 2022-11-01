import Button, {ButtonProps} from '@mui/material/Button';
import {styled} from '@mui/material/styles';

interface StyledButtonProps extends ButtonProps {
    success?: boolean;
}

const FormButtonStyles = {
    "backgroundColor": "#5BC0BE",
    "width": '20ch',
    "height": '5ch',
    "color": "#FFFFFF",
    "fontWeight": "bold",
    "padding": 10,
    "marginBottom": 10,
    "marginTop": 10,
    "marginLeft": 5,
    "marginRight": 5,
    "borderRadius": 10,
    "textTransform": "none",
    '&:hover': {
        "backgroundColor": "#FFFFFF",
        "color": "#5BC0BE",
    }
}

export const DiscardFormButton = styled(Button)<StyledButtonProps>({
    "background-color": "rgba(28,37,65,0.5)",
    "width": '20ch',
    "height": '5ch',
    "color": "#FFFFFF",
    "fontWeight": "bold",
    "padding": 10,
    "marginBottom": 10,
    "marginTop": 10,
    "marginLeft": 5,
    "marginRight": 5,
    "borderRadius": 10,
    "textTransform": "none",
    '&:hover': {
        "backgroundColor": "#1C2541",
    }
});

export const DiscardFilterButton = styled(Button)<StyledButtonProps>({
    "background-color": "rgba(28,37,65,0.5)",
    "width": '20ch',
    "height": '5ch',
    "color": "#FFFFFF",
    "fontWeight": "bold",
    "padding": 10,
    "marginBottom": 10,
    "marginTop": 10,
    "marginLeft": 5,
    "marginRight": 5,
    "borderRadius": 10,
    "textTransform": "none",
    '&:hover': {
        "backgroundColor": "#FFFFFF",
        "color": "#1C2541",
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
        "backgroundColor": "#FFFFFF",
    }
});

export const ReturnFormButton = styled(Button)({
    "backgroundColor": "#5BC0BE",
    "width": '20ch',
    "height": '5ch',
    "color": "#FFFFFF",
    "fontWeight": "bold",
    "padding": 10,
    "marginBottom": 10,
    "marginTop": 10,
    "marginLeft": 5,
    "marginRight": 5,
    "borderRadius": 10,
    "textTransform": "none",
    '&:hover': {
        "backgroundColor": "#FFFFFF",
        "color": "#5BC0BE",
    }
}) as typeof Button;

export const ApplyFilterButton = styled(Button)({
    "backgroundColor": "#5BC0BE",
    "width": '10ch',
    "height": '5ch',
    "color": "#FFFFFF",
    "fontWeight": "bold",
    "padding": 10,
    "marginBottom": 10,
    "marginTop": 10,
    "marginLeft": 5,
    "marginRight": 5,
    "borderRadius": 10,
    "textTransform": "none",
    '&:hover': {
        "backgroundColor": "#FFFFFF",
        "color": "#5BC0BE",
    }
}) as typeof Button;



