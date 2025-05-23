import { Model, model, models, ObjectId, Schema } from "mongoose";



interface PlaylistDocument {
    title: string;
    owner: ObjectId;
    items: ObjectId[];
    visibility: "private" | "public" | "auto";
}

const playlistSchema = new Schema<PlaylistDocument>({

    title: {
        type: String,
        required: true,

    },
    owner: {
        type: Schema.Types.ObjectId,
        required: true,
        ref:"User"
    },

    items: [{
        type: Schema.Types.ObjectId,
        required: true,
        ref: "Audio"
    }],

    visibility: {
        type: String,
        enum: ["private", "public", "auto"],
        default: "public",

        
    },

}, {timestamps: true})

const Playlist = models.Playlist ||  model(
    "Playlist",
    playlistSchema
)

export default Playlist as Model<PlaylistDocument>;



