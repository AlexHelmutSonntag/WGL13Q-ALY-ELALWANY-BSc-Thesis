import Button from '@mui/material/Button';
import {styled} from '@mui/material/styles';

export const SignupButton = styled(Button)({
    "backgroundColor": "#3A506B",
    "width": 60,
    "height": 20,
    "color" : "#FFFFFF",
    "fontWeight" : "bold",
    "padding" : 10,
    "marginLeft" : 5 ,
    "marginRight" : 5 ,
    textTransform: "none",
    '&:hover' :{
        "backgroundColor": "#3A506B",
        "color" : "#FFFFFF",
    }
}) as typeof Button;