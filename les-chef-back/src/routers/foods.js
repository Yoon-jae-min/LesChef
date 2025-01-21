const express = require("express");
const router = express.Router();
const {getContents, addPlace, updatePlace, deletePlace} = require("../controllers/foods");

router
    .get("/contents", getContents)
    .post("/place", addPlace)
    .patch("/place", updatePlace)
    .delete("/place", deletePlace);

module.exports = router;