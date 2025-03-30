import { Model, model, models, ObjectId, Schema } from "mongoose";

interface FavouriteDocument {
    owner: ObjectId;
    items: ObjectId[];
}

const favoutiteSchema = new Schema<FavouriteDocument>({

    owner: {
        type: Schema.Types.ObjectId,
        ref: "User",
    },
    items: [{
        type: Schema.Types.ObjectId,
        ref: "Audio",
    }]
}, { timestamps: true });

const Favourite = models.Favourite || model("Favourite", favoutiteSchema);
export default Favourite as Model<FavouriteDocument>;