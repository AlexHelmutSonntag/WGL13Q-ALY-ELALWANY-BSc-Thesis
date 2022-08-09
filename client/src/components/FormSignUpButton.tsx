import Button from '@mui/material/Button';
import {styled} from '@mui/material/styles';

export const FormSignupButton = styled(Button)({
    "background-color": "#5BC0BE",
    "width": '20ch',
    "height": '5ch',
    "color" : "#FFFFFF",
    "font-weight" : "bold",
    "padding" : 10,
    "margin-bottom" : 10,
    "margin-top" : 10,
    "margin-left" : 5 ,
    "margin-right" : 5 ,
    "border-radius": 10,
    textTransform: "none",
    '&:hover' :{
        "background-color": "#FFFFFF",
        "color" : "#5BC0BE",
    }
}) as typeof Button;