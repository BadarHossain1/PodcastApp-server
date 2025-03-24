import nodemailer from 'nodemailer';
import path from 'path';

import { CreateUser } from "#/@types/user";
import User from "#/models/user";
import { MAILTRAP_PASS, MAILTRAP_USER, SIGN_IN_URL, VERIFICATION_EMAIL } from "#/utils/variables";
import { generateToken } from "#/utils/helper";

import EmailVerificationToken from "#/models/emailVerificationToken";
import { generateTemplate } from "#/mail/template";

const generateMailTrasporter = () => {
    const transport = nodemailer.createTransport({
        host: "sandbox.smtp.mailtrap.io",
        port: 2525,
        auth: {
            user: MAILTRAP_USER,
            pass: MAILTRAP_PASS
        }
    });

    return transport;
}

interface Profile {
    name: string;
    email: string;
    userId: string;
}

export const sendVerificationMail = async (token: string, profile: Profile) => {
    const transport = generateMailTrasporter();
    const { name, email, userId } = profile;

   
  

    // Create the welcome message
    const welcomeMessage = `Hi ${name}, welcome to Podify! Use the following code to verify your email: ${token}`;

    // Send the email
    transport.sendMail({
        to: email,
        from: VERIFICATION_EMAIL,
        subject: "Welcome to Podify",
        html: generateTemplate({
            title: "Welcome to Podify",
            message: welcomeMessage,
            logo: "cid:logo",
            banner: "cid:welcome",
            link: "#", // You can set the verification link here if needed
            btnTitle: "Verify Email"
        }),
        attachments: [
            {
                filename: "logo.png",
                path: path.join(__dirname, "../mail/logo.png"),
                cid: "logo"
            },
            {
                filename: "welcome.png",
                path: path.join(__dirname, "../mail/welcome.png"),
                cid: "welcome"
            }
        ]
    });
}

interface Options{
    email: string;
    link: string;
}

export const sendForgetPasswordLink = async (options: Options) => {
    const transport = generateMailTrasporter();
    const { email, link } = options;

   
  

    // Create the welcome message
    const message = `We just received a request to reset your password. If you didn't make this request, you can ignore this email. Otherwise, you can reset your password by clicking the link below: ${link}`;

    // Send the email
    transport.sendMail({
        to: email,
        from: VERIFICATION_EMAIL,
        subject: "Reset Password Link",
        html: generateTemplate({
            title: "Forget Password",
            message,
            logo: "cid:logo",
            banner: "cid:forget_password",
            link: "#", // You can set the verification link here if needed
            btnTitle: "Reset Password"
        }),
        attachments: [
            {
                filename: "logo.png",
                path: path.join(__dirname, "../mail/logo.png"),
                cid: "logo"
            },
            {
                filename: "welcome.png",
                path: path.join(__dirname, "../mail/welcome.png"),
                cid: "forget_password"
            }
        ]
    });
}


export const sendPassResetSuccessEmail = async (name: string, email:string) => {
    const transport = generateMailTrasporter();
    

   
  

    // Create the welcome message
    const message = `Dear ${name} we updated ur pass, sign in with new password`;

    // Send the email
    transport.sendMail({
        to: email,
        from: VERIFICATION_EMAIL,
        subject: "Password Reset Successfully",
        html: generateTemplate({
            title: "Password Reset Successfully",
            message,
            logo: "cid:logo",
            banner: "cid:forget_password",
            link: SIGN_IN_URL, // You can set the verification link here if needed
            btnTitle: "Login"
        }),
        attachments: [
            {
                filename: "logo.png",
                path: path.join(__dirname, "../mail/logo.png"),
                cid: "logo"
            },
            {
                filename: "welcome.png",
                path: path.join(__dirname, "../mail/welcome.png"),
                cid: "forget_password"
            }
        ]
    });
}