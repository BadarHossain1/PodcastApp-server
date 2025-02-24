import { RequestHandler } from "express";

import nodemailer from 'nodemailer';


import { CreateUser } from "#/@types/user";
import User from "#/models/user";
import { MAILTRAP_PASS, MAILTRAP_USER } from "#/utils/variables";
import { generateToken } from "#/utils/helper";

import emailVerification from "#/models/emailVerificationToken";

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

    

    transport.sendMail({
        to: user.email,
        from: "auth@myYupp.com",
        html: `<h1>your verification toke is ${token}</h1>`
    });



    
    res.status(201).json({ user });




}