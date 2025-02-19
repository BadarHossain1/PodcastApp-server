import * as yup from 'yup'


export const CreateUserSchema = yup.object().shape({
    name: yup.string().trim().required("Name is missing").min(3, "Name is too short").max(20, "Name is too strong"),
    email: yup.string().required("Email is missing").email("Invalid email").required("Email is missing"),
    password: yup.string().trim().required("Password is missing").min(8, "Password is too short").matches(/^(?=.[a-z])(?=.[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/, "Password is too simple")
})
