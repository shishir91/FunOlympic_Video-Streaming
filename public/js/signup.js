const password = document.getElementById("password");
const c_password = document.getElementById("confirm_password");
const p_error = document.getElementById("p_error");
const cp_error = document.getElementById("cp_error");

const uppercaseRegex = /[A-Z]/;
const lowercaseRegex = /[a-z]/;
const digitRegex = /[0-9]/;
const specialCharRegex = /[!@#$%^&*(),.?":{}|<>]/;

password.addEventListener("keyup", () => {
    if (password.value.length < 8) {
        p_error.style.display = "block";
        p_error.innerText = 'Password must be at least 8 characters long.';
    } else if (!uppercaseRegex.test(password.value)) {
        p_error.style.display = "block";
        p_error.innerText = 'Password must contain at least one uppercase letter.';
    } else if (!lowercaseRegex.test(password.value)) {
        p_error.style.display = "block";
        p_error.innerText = 'Password must contain at least one lowercase letter.';
    } else if (!digitRegex.test(password.value)) {
        p_error.style.display = "block";
        p_error.innerText = 'Password must contain at least one numeric digit.';
    } else if (!specialCharRegex.test(password.value)) {
        p_error.style.display = "block";
        p_error.innerText = 'Password must contain at least one special character.';
    } else {
        p_error.style.display = "none";
        p_error.innerText = "";
    }
});

c_password.addEventListener("keyup", () => {
    if (c_password.value !== password.value){
        cp_error.style.display = "block";
        cp_error.innerText = "Password didn't match";
    }else{
        cp_error.style.display = "none";
        cp_error.innerText = "";
    }
});
