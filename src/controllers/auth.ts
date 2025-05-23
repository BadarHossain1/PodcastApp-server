import { RequestHandler } from "express";
import jwt from "jsonwebtoken";



import { CreateUser, VerifyEmailRequest } from "#/@types/user";
import User from "#/models/user";
import { formatProfile, generateToken } from "#/utils/helper";
import { sendForgetPasswordLink, sendPassResetSuccessEmail, sendVerificationMail } from "#/utils/mail";
import EmailVerificationToken from "#/models/emailVerificationToken";
import { isValidObjectId } from "mongoose";
import passwordResetToken from "#/models/passwordResetToken";
import crypto from "crypto";
import { JWT_SECRET, PASSWORD_RESET_LINK } from "#/utils/variables";
import cloudinary from "#/cloud";
import formidable, { File } from "formidable";
interface RequestWithFiles extends Request {

    files?: { [key: string]: File }
}




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
    res.status(200).json({ message: "Email verified" });

};

export const sendReVerificationToken: RequestHandler = async (req, res) => {

    const { userId } = req.body;

    if (!isValidObjectId(userId)) {
        res.status(403).json({ error: "Invalid request" });
        return;
    }

    const user = await User.findById(userId);
    if (!user) {
        res.status(403).json({ error: "Invalid user" });
        return;
    }

    await EmailVerificationToken.findOneAndDelete({ owner: userId });

    const token = generateToken();

    EmailVerificationToken.create({ owner: userId, token });

    await User.findById(userId)

    sendVerificationMail(token, { name: user?.name, email: user?.email, userId: user?._id.toString() });

    res.json({ message: "Verification email sent. Please check your mail" });
};

export const generateForgetPasswordLink: RequestHandler = async (req, res) => {

    const { email } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
        res.status(404).json({ error: "Account not found" });
        return;
    }

    //generate the link
    // https://example.com/reset-password?token=hfksdsddeef&userId=wdidfdmf
    //send the link to the email

    await passwordResetToken.findOneAndDelete({ owner: user._id });
    const token = crypto.randomBytes(36).toString("hex");


    await passwordResetToken.create({ owner: user._id, token });

    const resetLink = `${PASSWORD_RESET_LINK}?token=${token}&userId=${user._id}`;


    sendForgetPasswordLink({ email, link: resetLink });

    res.json({ message: "Password reset link sent. Please check your mail" });





};

export const grantValid: RequestHandler = async (req, res) => {
    res.json({ valid: true });
};
export const updatePassword: RequestHandler = async (req, res) => {
    const { password, userId } = req.body;

    const user = await User.findById(userId)
    if (!user) {
        res.status(403).json({ error: "Unauthorized access found" })
        return;
    }
    const matched = await user.comparePassword(password)
    if (matched) {
        res.status(422).json({ error: "The new password must be different" })
    }

    user.password = password;
    await user.save()

    await passwordResetToken.findOneAndDelete({ owner: user._id })

    //send success email

    sendPassResetSuccessEmail(user.name, user.email);
    res.json({ message: "email sent" });
};
export const signIn: RequestHandler = async (req, res) => {
    const { password, email } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
        res.status(403).json({ error: "Email/Password mismatch" });
        return;
    }

    //compare the password

    const matched = await user.comparePassword(password);


    if (!matched) {
        res.status(403).json({ error: "Email/Password mismatch" });
        return;
    }

    // generate the token for later use

    const token = jwt.sign({ userId: user._id }, JWT_SECRET,)
    user.tokens.push(token);

    await user.save();

    res.json({ profile: { id: user._id, name: user.name, email: user.email, verified: user.verified, avatar: user.avatar?.url, followers: user.followers.length, followings: user.followings.length }, token });












};

export const updateProfile: RequestHandler = async (req: RequestWithFiles, res) => {
    const { name } = req.body;
    const avatar = req.files?.avatar as formidable.File;


    const user = await User.findById(req.user.id);
    if (!user) {
        throw new Error("something went wrong, user not found")

    }

    if (typeof name !== "string") {
        throw new Error("Name must be a string")
    }

    if (name.trim().length < 3) {
        throw new Error("Name must be at least 3 characters")
    }

    user.name = name;

    if (avatar) {

        if (user.avatar?.publicId) {
            await cloudinary.uploader.destroy(user.avatar?.publicId);
        }

        const { secure_url, public_id } = await cloudinary.uploader.upload(avatar.filepath, {
            width: 300,
            height: 300,
            crop: "thumb",
            gravity: "face"

        })

        user.avatar = { url: secure_url, publicId: public_id };



    }

    await user.save();

    res.json({ profile: formatProfile(user) });






};

export const sendProfile: RequestHandler = async (req, res) => {
    res.json({ profile: req.user });

}


export const logOut: RequestHandler = async (req, res) => {
    const { fromAll } = req.query;
    const token = req.token;

    const user = await User.findById(req.user.id)

    if (!user) {
        throw new Error("User not found")
    }

    // logout from ALL

    if (fromAll === "yes") {
        user.tokens = [];

    }
    else {
        user.tokens = user.tokens.filter(t => t !== token)
    }

    await user.save();

    res.json({ success: "Logged out" });


}

