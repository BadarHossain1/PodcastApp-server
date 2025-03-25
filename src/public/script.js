const getById = (id) => {
    return document.getElementById(id);
};

const password = getById("password");
const confirmPassword = getById("confirm-password");
const form = getById("form");
const container = getById("container");
const loader = getById("loader");
const button = getById("submit");
const error = getById("error");
const success = getById("success");

error.style.display = "none";
success.style.display = "none";
container.style.display = "none";

let token, userId;

const passwordRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%?&])[A-Za-z\d@$!%?&]{8,}$/;



window.addEventListener("DOMContentLoaded", async () => {
    const params = new Proxy(new URLSearchParams(window.location.search), {
        get: (searchParams, prop) => {
            return searchParams.get(prop);
        },
    });
    token = params.token;
    userId = params.userId;

    const res = await fetch("/auth/verify-pass-reset-token", {
        method: "POST",
        headers: {
            "Content-Type": "application/json;charset=utf-8",
        },
        body: JSON.stringify({
            token,
            userId,
        }),
    });

    if (!res.ok) {
        const { error } = await res.json();
        loader.innerText = error;
        return;
    }

    loader.style.display = "none";
    container.style.display = "block";
});



const displayError = (errorMessage) => {

    //first remove if there is any success messages
    success.style.display = "none";
    error.innerText = errorMessage;
    error.style.display = "block";
}


const displaySuccess = (successMessage) => {

    //first remove if there is any success messages
    error.style.display = "none";
    success.innerText = successMessage;
    success.style.display = "block";
}


const handleSubmit = async (evt) => {
    evt.preventDefault();
    console.log("inside the submit");
    //validate
    if (!password.value.trim()) {

        return displayError("Password is required");

    }
    if (!passwordRegex.test(password.value)) {

        return displayError("Your password is too simple use alphanumeric and special characters");

    }
    if (password.value !== confirmPassword.value) {
        return displayError("Passwords do not match");
    }

    button.disabled = true;
    button.innerText = "Please wait...";

    //handle the submit part 

    const res = await fetch("/auth/update-password", {
        method: "POST",
        headers: {
            "Content-Type": "application/json;charset=utf-8",
        },
        body: JSON.stringify({
            token,
            userId,
            password: password.value,
        }),
    });

    button.disabled = false;
    button.innerText = "Reset Password";

    if (!res.ok) {
        const { error } = await res.json();
        return displayError(error);
    }

    displaySuccess("Your password has been reset successfully");

    password.value = "";
    confirmPassword.value = "";



};

form.addEventListener("submit", handleSubmit);