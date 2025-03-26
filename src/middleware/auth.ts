import { RequestHandler } from "express";
import passwordResetToken from "#/models/passwordResetToken";
import { JwtPayload, verify } from "jsonwebtoken";
import { JWT_SECRET } from "#/utils/variables";
import User from "#/models/user";



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

export const mustAuth: RequestHandler = async (req,res,next) =>{
    
        const {authorization} = req.headers;
        const token = authorization?.split("Bearer ")[1]
        console.log(token);
    
        if(!token){
             res.status(403).json({message: "Unauthorized"})
             return
        }
    
        const payload =  verify(token, JWT_SECRET) as JwtPayload;
        const id = payload.userId;
    
        const user = await User.findOne({_id: id, tokens: token});
    
        if(!user){
            res.status(403).json({message: "Unauthorized"})
            return
    
    
        }
        
        req.user = {
            id: user._id, name: user.name, email: user.email, verified: user.verified, avatar: user.avatar?.url, followers: user.followers.length, followings: user.followings.length
        }
        
        next()
    
}