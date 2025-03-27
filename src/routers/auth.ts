
import { create, generateForgetPasswordLink, grantValid, sendReVerificationToken, signIn, updatePassword, verifyEmail } from "#/controllers/user";
import { validate } from "#/middleware/validator";
import { CreateUserSchema, TokenAndIDValidation, UpdatePasswordSchema, SignInValidationSchema } from "#/utils/validationSchema";
import { Router, Request } from "express";
import { isValidPassResetToken, mustAuth } from "#/middleware/auth";
import { JwtPayload, verify } from "jsonwebtoken";
import { JWT_SECRET } from "#/utils/variables";
import User from "#/models/user";


const router = Router();

router.post('/create',
    validate(CreateUserSchema),
    create

);
router.post("/verify-email", validate(TokenAndIDValidation), verifyEmail);
router.post("/re-verify-email", sendReVerificationToken);
router.post("/forget-password", generateForgetPasswordLink);
router.post("/verify-pass-reset-token", validate(TokenAndIDValidation), isValidPassResetToken, grantValid);
router.post("/update-password", validate(UpdatePasswordSchema), isValidPassResetToken, updatePassword);
router.post("/sign-in", validate(SignInValidationSchema), signIn);
router.get("/is-auth", mustAuth, (req, res) => {
    res.json({
        profile: req.user,
    })
}
)

router.get('/public', (req,res)=> {
    res.json({
        message: "You are in public route"
    })
})

router.get('/private', mustAuth, (req,res)=> {
    res.json({
        message: "You are in private route"
    })
})


import formidable from 'formidable';
import path from 'path';
import fs from 'fs';

router.post('/update-profile', async (req, res) => {

    if (!req.headers['content-type']?.startsWith('multipart/form-data')) {
        res.status(422).json({ error: 'Invalid content type. Must be multipart/form-data' });
        return;
    }

    const dir = path.join(__dirname, "../public/profiles");

    try {

        await fs.readdirSync(dir)
    } catch (error) {
        await fs.mkdirSync(dir);
    }

    const form = formidable({
        uploadDir: dir,
        filename(name, ext, part, form) {

            return Date.now() + "_" + part.originalFilename;

        },
    });
    form.parse(req, (err, fields, files) => {
        // console.log(fields);
        // console.log(files);
        res.json({ uploaded: true});
});

})
export default router;