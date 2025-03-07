import { Model, model, ObjectId, Schema } from "mongoose";
//interface for user
interface UserDocument {
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

//now making a schema for user

const userSchema = new Schema<UserDocument>({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        trim: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    avatar: {
        type: Object,
        url: String,
        publicId: String
    },
    verified: {
        type: Boolean,
        default: false
    },
    favorites: [{
        type: Schema.Types.ObjectId,
        ref: 'Audio'
    }],
    followers: [{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }],
    followings: [{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }],
    tokens: [String]
}, { timestamps: true });


//creating the module 

export default model("User", userSchema) as Model<UserDocument>;