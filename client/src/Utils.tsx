
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
