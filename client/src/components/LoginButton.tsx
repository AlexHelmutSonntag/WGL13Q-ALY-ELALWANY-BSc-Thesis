import Button from '@mui/material/Button';
import {styled} from '@mui/material/styles';

export const LoginButton = styled(Button)({
    "backgroundColor": "#FFFFFF",
    "color" : "#3A506B",
    "outline" : "1px solid #3A506B ",
    "width": 60,
    "height": 20,
    "padding" : 10,
    "fontWeight" : "bold",
    textTransform: "none",
    "marginLeft" : 5 ,
    "marginRight" : 5 ,
    '&:hover' :{
        // "background-color": "#3A506B",
        // "color" : "#FFFFFF",
    }
}) as typeof Button;