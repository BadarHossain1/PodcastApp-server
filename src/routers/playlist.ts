import { createPlaylist, getAudios, getPlaylistByProfile, removePlaylist, updatePlaylist } from "#/controllers/playlist";
import { isVerified, mustAuth } from "#/middleware/auth";
import { validate } from "#/middleware/validator";
import { NewPlaylistValidateSchema, OldNewPlaylistValidateSchema } from "#/utils/validationSchema";
import { Router } from "express";

const router = Router();

router.post('/create', mustAuth, isVerified, validate(NewPlaylistValidateSchema), createPlaylist);   

router.patch("/",  mustAuth, isVerified, validate(OldNewPlaylistValidateSchema), updatePlaylist);

router.delete('/', mustAuth, removePlaylist);
router.get('/by-profile',  mustAuth, getPlaylistByProfile);
router.get('/:playlistId', mustAuth, getAudios); // Get playlist by ID

export default router;