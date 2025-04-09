import { CreatePlaylistRequest } from "#/@types/audio";
import Audio from "#/models/audio";
import Playlist from "#/models/playlist";
import { RequestHandler } from "express";


export const createPlaylist: RequestHandler = async (req: CreatePlaylistRequest, res) => {
    const { title, resId, visibility } = req.body;
    const ownerId = req.user.id;

    if (resId) {
        const audio = await Audio.findById(resId)
        if (!audio) {
            res.status(404).json({ error: "Audio not found" });
            return;
        }
    }

    const newPlaylist = new Playlist({
        title,
        owner: ownerId,
        visibility,
    })

     

    if (resId) {
        newPlaylist.items = [resId as any]

    }

    await newPlaylist.save()

    res.status(201).json({
        playlist: {
            id: newPlaylist._id,
            title: newPlaylist.title,
            visibility: newPlaylist.visibility,
        }
    })
}
