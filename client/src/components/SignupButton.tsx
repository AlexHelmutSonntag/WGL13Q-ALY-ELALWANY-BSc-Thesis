import Button from '@mui/material/Button';
import {styled} from '@mui/material/styles';

export const SignupButton = styled(Button)({
    "background-color": "#3A506B",
    "width": 60,
    "height": 20,
    "color" : "#FFFFFF",
    "font-weight" : "bold",
    "padding" : 10,
    "margin-left" : 5 ,
    "margin-right" : 5 ,
    textTransform: "none",
    '&:hover' :{
        "background-color": "#3A506B",
        "color" : "#FFFFFF",
    }
}) as typeof Button;