import Button from '@mui/material/Button';
import {styled} from '@mui/material/styles';

export const LoginButton = styled(Button)({
    "background-color": "#FFFFFF",
    "color" : "#3A506B",
    "outline" : "1px solid #3A506B ",
    "width": 60,
    "height": 20,
    "padding" : 10,
    "font-weight" : "bold",
    textTransform: "none",
    "margin-left" : 5 ,
    "margin-right" : 5 ,
    '&:hover' :{
        // "background-color": "#3A506B",
        // "color" : "#FFFFFF",
    }
}) as typeof Button;