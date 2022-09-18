import axios from "axios";

export const stringToDate = (date:String) => {
    let dd_mm_yyyy = date;
    let dob = dd_mm_yyyy.replace(/(\d+)\/(\d+)\/(\d+)/g, "$3-$2-$1");
}

export const validateEmail = (email: string) => {
    const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
};

export const validatePasswordInput = (password: string, repeatedPassword: string): boolean => {
    if (password === "" || repeatedPassword === "") {
        return false;
    }
    return password.trim() === repeatedPassword.trim();
}


export const fetchUserDetails = (username: string, config: any) => {
    axios.get(`http://localhost:8080/api/v1/user/${username}`,
        config,
    ).then((response) => {
            console.log(response);
            if (response.status === 200) {
                console.log(response.data);
                return response.data;
                // setUserState(
                //     {
                //         username: response.data.username,
                //         firstName: response.data.firstName,
                //         lastName: response.data.lastName,
                //         gender: response.data.gender,
                //         role: response.data.role,
                //         email: response.data.email,
                //         dob: response.data.dob,
                //         password: response.data.password
                //     }
                // )
                // console.log(`Inside fetch ${userState}`);
            }
        }
    ).catch((error) => console.log(error));
}