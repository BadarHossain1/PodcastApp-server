import { ObjectId } from "mongoose";

export const generateToken = (length: number = 6) => {

    //declare a variable for holding the token

    let otp = "";

    for (let i = 0; i < length; i++) {

        const digit = Math.floor(Math.random() * 10);
        otp += digit;


    }

    return otp;
    
}

interface UserDocument {
    _id: ObjectId;
    name: string;
    email: string;
    password: string;
    verified: boolean;
    avatar?: { url: string, publicId: string };
    tokens: string[];
    favorites: ObjectId[];
    followers: ObjectId[];
    followings: ObjectId[];
}


export const formatProfile = (user: UserDocument) => {
    return {
        id: user._id,
        name: user.name,
        email: user.email,
        verified: user.verified,
        avatar: user.avatar?.url,
        followers: user.followers.length,
        followings: user.followings.length

    }


}