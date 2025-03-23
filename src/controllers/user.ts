import { RequestHandler } from "express";


import nodemailer from 'nodemailer';
import path from 'path';

import { CreateUser } from "#/@types/user";
import User from "#/models/user";
import { MAILTRAP_PASS, MAILTRAP_USER } from "#/utils/variables";
import { generateToken } from "#/utils/helper";

import emailVerification from "#/models/emailVerificationToken";
import { generateTemplate } from "#/mail/template";

export const create: RequestHandler = async (req: CreateUser, res) => {

    const { name, email, password } = req.body;


    

    const user = await User.create({ name, email, password });
    //send verification email
    const transport = nodemailer.createTransport({
        host: "sandbox.smtp.mailtrap.io",
        port: 2525,
        auth: {
            user: MAILTRAP_USER,
            pass: MAILTRAP_PASS
        }
    });


    




    const token = generateToken(6);
    await emailVerification.create({
        owner: user._id,
        token: token
    })

    
    const welcomeMessage = `Hi ${user.name}, welcome to Podify 🎉🎉🎉` ;

    transport.sendMail({
        to: user.email,
        from: "auth@myYupp.com",
        html: generateTemplate({
            title: "Email Verification",
            message: welcomeMessage,
            logo: "cid:logo",
            banner: "cid:welcome",
            link: "#",
            btnTitle: token,
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
            },

        ]

    });



    
    res.status(201).json({ user });




}