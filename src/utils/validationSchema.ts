import * as Yup from 'yup';
import { isValidObjectId } from 'mongoose';
import { categories } from './audio_category';

export const CreateUserSchema = Yup.object().shape({
    name: Yup.string()
        .trim()
        .required('Name is required')
        .min(3, 'Name must be at least 3 characters')
        .max(20, 'Name must be at most 20 characters'),

    email: Yup.string()
        .email('Invalid email')
        .required('Email is required'),

    password: Yup.string()
        .trim()
        .required('Password is required')
        .min(8, 'Password must be at least 8 characters')
        .matches(
            /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%?&])[A-Za-z\d@$!%?&]{8,}$/,
            'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character (@$!%?&)'
        ),
});

export const TokenAndIDValidation = Yup.object().shape({
    token: Yup.string().trim().required('Token is required'),

    userId: Yup.string()
        .transform(function (value) {
            return this.isType(value) && isValidObjectId(value) ? value : null;
        })
        .required('Invalid user ID!'),
});

export const UpdatePasswordSchema = Yup.object().shape({
    token: Yup.string().trim().required('Token is required'),

    userId: Yup.string()
        .transform(function (value) {
            return this.isType(value) && isValidObjectId(value) ? value : null;
        })
        .required('Invalid user ID!'),

    password: Yup.string()
        .trim()
        .required('Password is required')
        .min(8, 'Password must be at least 8 characters')
        .matches(
            /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%?&])[A-Za-z\d@$!%?&]{8,}$/,
            'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character (@$!%?&)'
        ),
});


export const EmailValidationSchema = Yup.object().shape({

    email: Yup.string()
        .email('Invalid email')
        .required('Email is required'),
        
        

    
});


export const SignInValidationSchema = Yup.object().shape({

    email: Yup.string()
        .email('Invalid email')
        .required('Email is required'),

    password: Yup.string()
        .trim()
        .required('Password is required')
        
        

    
});

export const AudioValidationSchema = Yup.object().shape({

    title: Yup.string()
       
        .required('Title is required'),

    about: Yup.string()
       
        .required('About is required'),

    category: Yup.string().oneOf(categories, "Invalid Category").required("Category is missing"),
        
        

    
});




