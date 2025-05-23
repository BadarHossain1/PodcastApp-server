import { CreatePlaylistRequest, PopulateFavList, UpdatePlaylistRequest } from "#/@types/audio";
import Audio from "#/models/audio";
import Playlist from "#/models/playlist";
import { RequestHandler } from "express";
import { isValidObjectId } from "mongoose";


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

export const updatePlaylist: RequestHandler = async (req: UpdatePlaylistRequest, res) => {
    const { id, item, title, visibility } = req.body;

    const playlist = await Playlist.findOneAndUpdate({ _id: id, owner: req.user.id }, { title, visibility }, { new: true })

    if (!playlist) {
        res.status(404).json({ error: "Playlist not found" })
        return;
    }

    if (item) {

        const audio = await Audio.findById(item)
        if (!audio) {
            res.status(404).json({ error: "Audio not found" });


        }
        // playlist.items.push(audio._id);
        // await playlist.save()

        await Playlist.findByIdAndUpdate(playlist._id,
            {
                $addToSet: { items: item }
            },
        )
    }

    res.status(201).json({
        playlist: {
            id: playlist._id,
            title: playlist.title,
            visibility: playlist.visibility,
        }
    })






}
export const removePlaylist: RequestHandler = async (req, res) => {

    const { playlistId, resId, all } = req.query
    if (!isValidObjectId(playlistId)) {
        res.status(422).json({ error: "Invalid playlist ID" })
        return;

    }


    if (all == "yes") {
        const playlist = await Playlist.findOneAndDelete({ _id: playlistId, owner: req.user.id })

        if (!playlist) {
            res.status(404).json({ error: "Playlist not found" })
            return;
        }
    }



    if (resId) {
        if (!isValidObjectId(resId)) {
            res.status(422).json({ error: "Invalid playlist ID" })
            return;

        }



        const playlist = await Playlist.findOneAndUpdate({ _id: playlistId, owner: req.user.id }, {
            $pull: { items: resId }
        })

        if (!playlist) {
            res.status(404).json({ error: "Playlist not found" })
            return;
        }
    }


    res.json({ success: true })


}
export const getPlaylistByProfile: RequestHandler = async (req, res) => {

    const { pageNo = "0", limit = "20" } = req.query as {
        pageNo: string;
        limit: string;
    }

    const data = await Playlist.find({
        owner: req.user.id,
        visibility: { $ne: 'auto' }
    })
        .skip(parseInt(pageNo) * parseInt(limit))
        .limit(parseInt(limit))
        .sort('-createdAt')


    const playlist = data.map((item) => {
        return {
            id: item._id,
            title: item.title,
            itemsCount: item.items.length,
            visibility: item.visibility,
        }
    })
    res.json({ playlist })

}
export const getAudios: RequestHandler = async (req, res) => {

    const { playlistId } = req.params

    if (!isValidObjectId(playlistId)) {
        res.status(422).json({ error: "Invalid playlist ID" })
        return;
    }

    const playlist = await Playlist.findOne({
        owner: req.user.id,
        _id: playlistId
    }).populate<{items: PopulateFavList[]}>({
        path: "items",
        populate: {
            path: "owner",
            select: "name",
        },
    })

    if (!playlist) {
        res.json({ list: [] })
        return
    }

    const audios = playlist?.items.map((item) => {
        return {
            id: item._id,
            title: item.title,
            category: item.category,
            file: item.file.url,
            poster: item.poster?.url,
            owner: { name: item.owner.name, id: item.owner._id },

        }
    })

    res.json({ list: {
        id: playlist._id,
        title: playlist.title,
        itemsCount: playlist.items.length,
        visibility: playlist.visibility,
        audios: audios
    } })
}
