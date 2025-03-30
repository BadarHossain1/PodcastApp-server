import Favourite from "#/models/favorite";
import Audio from "#/models/audio"; // Import the correct Audio model
import { RequestHandler } from "express";
import { isValidObjectId } from "mongoose";



export const toggleFavorite: RequestHandler = async (req, res) => {
    const audioId = req.query.audioId as string;
    let status: "added" | "removed";

    if(!isValidObjectId(audioId)){
        res.status(422).json({ error: "Invalid audio id" });
        return;
    }

    const audio = await Audio.findById(audioId);
    if(!audio){
        res.status(404).json({ error: "Audio not found" });
        return;
    }

    const alreadyExists = await Favourite.findOne({ owner: req.user.id, items: audioId })
    if(alreadyExists){

        await Favourite.updateOne({ owner: req.user.id }, { $pull: { items: audioId } });
        status = "removed";
    }
    else{
        const favorite = await Favourite.findOne({owner: req.user.id});
        if(favorite){
            await Favourite.updateOne({ owner: req.user.id }, { $addToSet: { items: audioId } });
        }

        else{
            await Favourite.create({ owner: req.user.id, items: [audioId] });// Create a new favourite document

        }
        status = "added";
    }

    if(status == "added"){
        await Audio.findByIdAndUpdate(audioId, { $addToSet: { likes: req.user.id } });
    }

    if(status == "removed"){
        await Audio.findByIdAndUpdate(audioId, { $pull: { likes: req.user.id } });
    }


    res.json({status});





    // audio is already in fav 



    // audio is already in favorites
    // trying to create fresh fav list
    // trying to add new audio to the old list



}