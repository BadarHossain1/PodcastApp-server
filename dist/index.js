"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
require("./db");
const app = express();
const Port = process.env.PORT || 8089;
app.listen(Port, () => {
    console.log(`Server is running on port ${Port}`);
});
