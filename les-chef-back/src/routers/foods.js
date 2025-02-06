const express = require("express");
const router = express.Router();
const {getPlace, addPlace, updatePlace, deletePlace, addContent, deleteContent, updateContent} = require("../controllers/foods");

router
    .get("/place", getPlace)
    .post("/place", addPlace)
    .patch("/place", updatePlace)
    .delete("/place", deletePlace)
    .post("/content", addContent)
    .delete("/content", deleteContent)
    .patch("/content", updateContent);

module.exports = router;