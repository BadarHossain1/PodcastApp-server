import { createPlaylist } from "#/controllers/playlist";
import { isVerified, mustAuth } from "#/middleware/auth";
import { validate } from "#/middleware/validator";
import { NewPlaylistValidateSchema } from "#/utils/validationSchema";
import { Router } from "express";

const router = Router();

router.post('/create', mustAuth, isVerified, validate(NewPlaylistValidateSchema), createPlaylist);   

export default router;