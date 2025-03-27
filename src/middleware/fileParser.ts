import { RequestHandler } from "express";

const fileParser: RequestHandler = (req, res, next) => {
    if(!req.headers["content-type"]?.startsWith("multipart/form-data;")) {
        res.status(422).json({ error: "Invalid content type. Must be multipart/form-data" });
        return;
    }

    next();
};

export default fileParser;