import * as Yup from 'yup';
import { isValidObjectId } from 'mongoose';

export const CreateUserSchema = Yup.object().shape({
    name: Yup.string().trim().required('Name is required').min(3, 'Name must be at least 3 characters').max(20, 'Name must be at most 20 characters'),
    email: Yup.string().email('Invalid email').required('Email is required'),
    password: Yup.string().trim().required('Password is required').min(3, 'Password must be at least 8 characters')
})

//.matches(/^(?=.[a-z])(?=.[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/, 'Password must contain at least one uppercase letter, one lowercase letter and one number')


export const TokenAndIDValidation = Yup.object().shape({
    token: Yup.string().trim().required('Token is required'),
    userId: Yup.string().transform(function (value) {
        if (this.isType(value) && isValidObjectId(value)) {
            return value;
        } else {
            return "";
        }
    })
        .required("Invalid userID!"),
});


export const UpdatePasswordSchema = Yup.object().shape({
    token: Yup.string().trim().required('Token is required'),
    userId: Yup.string().transform(function (value) {
        if (this.isType(value) && isValidObjectId(value)) {
            return value;
        } else {
            return "";
        }
    })
        .required("Invalid userID!"),
        password: Yup.string().trim().required('Password is required').min(3, 'Password must be at least 8 characters')
});

