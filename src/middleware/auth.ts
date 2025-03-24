import { RequestHandler } from "express";
import passwordResetToken from "#/models/passwordResetToken";


export const isValidPassResetToken: RequestHandler = async (req, res, next) => {

    const { token, userId } = req.body;

    const resetToken = await passwordResetToken.findOne({ owner: userId })

    if (!resetToken) {
        res.status(403).json({ error: "Unauthorized Access" });

        return;
    }
    const matched = await resetToken.compareToken(token);
    if (!matched) {
        res.status(403).json({ error: "Unauthorized Access" });

        return;
    }


    next();
};