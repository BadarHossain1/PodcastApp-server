import Favourite from "#/models/favorite";
import Audio, { AudioDocument } from "#/models/audio"; // Import the correct Audio model
import { RequestHandler } from "express";
import { isValidObjectId, ObjectId } from "mongoose";
import { PopulateFavList } from "#/@types/audio";
import Favourite from './../models/favorite';



export const toggleFavorite: RequestHandler = async (req, res) => {
    const audioId = req.query.audioId as string;
    let status: "added" | "removed";

    if (!isValidObjectId(audioId)) {
        res.status(422).json({ error: "Invalid audio id" });
        return;
    }

    const audio = await Audio.findById(audioId);
    if (!audio) {
        res.status(404).json({ error: "Audio not found" });
        return;
    }

    const alreadyExists = await Favourite.findOne({ owner: req.user.id, items: audioId })
    if (alreadyExists) {

        await Favourite.updateOne({ owner: req.user.id }, { $pull: { items: audioId } });
        status = "removed";
    }
    else {
        const favorite = await Favourite.findOne({ owner: req.user.id });
        if (favorite) {
            await Favourite.updateOne({ owner: req.user.id }, { $addToSet: { items: audioId } });
        }

        else {
            await Favourite.create({ owner: req.user.id, items: [audioId] });// Create a new favourite document

        }
        status = "added";
    }

    if (status == "added") {
        await Audio.findByIdAndUpdate(audioId, { $addToSet: { likes: req.user.id } });
    }

    if (status == "removed") {
        await Audio.findByIdAndUpdate(audioId, { $pull: { likes: req.user.id } });
    }


    res.json({ status });





    // audio is already in fav 



    // audio is already in favorites
    // trying to create fresh fav list
    // trying to add new audio to the old list





}

export const getFavorite: RequestHandler = async (req, res) => {
    const userID = req.user.id

    const favorite = await Favourite.findOne({ owner: userID }).populate<{ items: PopulateFavList[] }>({
        path: "items",
        populate: {
            path: "owner",
        }
    })

    if (!favorite) {
        res.json({ audios: [] })
        return;
    }

    const audios = favorite.items.map((item) => {
        return {
            id: item._id,
            title: item.title,
            category: item.category,
            file: item.file.url,
            poster: item.poster?.url,
            owner: { name: item.owner.name, id: item.owner._id },
        }
    })
    res.json({ audios });


};

export const getIsFavorite: RequestHandler = async (req, res) => {
    const audioId = req.query.audioId as string;

    if (!isValidObjectId(audioId)) {
        res.status(422).json({ error: "Invalid audio id" });
        return;
    }

    const favorite = await Favourite.findOne({ owner: req.user.id, items: audioId });

    res.json({ result: favorite ? true : false });
}