import * as Yup from 'yup';

export const CreateUserSchema = Yup.object().shape({
    name: Yup.string().trim().required('Name is required').min(3, 'Name must be at least 3 characters').max(20, 'Name must be at most 20 characters'),
    email: Yup.string().email('Invalid email').required('Email is required'),
    password: Yup.string().trim().required('Password is required').min(3, 'Password must be at least 8 characters')
})

//.matches(/^(?=.[a-z])(?=.[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/, 'Password must contain at least one uppercase letter, one lowercase letter and one number')