import { RequestHandler } from "express";



import { CreateUser, VerifyEmailRequest } from "#/@types/user";
import User from "#/models/user";
import { generateToken } from "#/utils/helper";
import { sendVerificationMail } from "#/utils/mail";
import EmailVerificationToken from "#/models/emailVerificationToken";



export const create: RequestHandler = async (req: CreateUser, res) => {

    const { name, email, password } = req.body;





    const user = await User.create({ name, email, password });
    //send verification email

    const token = generateToken();
    sendVerificationMail(token, { name, email, userId: user._id.toString() });



    res.status(201).json({ user: { id: user._id, name, email } });




}



export const verifyEmail: RequestHandler = async (req: VerifyEmailRequest, res) => {

    const { token, userId } = req.body;

    const verificationToken = await EmailVerificationToken.findOne({ owner: userId });

    if (!verificationToken) {
        res.status(403).json({ error: "Invalid token" });
        return;
    };

    const matched = await verificationToken.compareToken(token);

    if (!matched) {
        res.status(403).json({ error: "Invalid token" });
        return;
    };

    await User.findByIdAndUpdate(userId, {
        verified: true
    });

    await EmailVerificationToken.findByIdAndDelete(verificationToken._id);
    res.status(200).json({ message: "Email verified"});

};