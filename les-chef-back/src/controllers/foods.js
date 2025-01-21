const asyncHandler = require("express-async-handler");
const Foods = require("../models/foodsModel");

const getContents = asyncHandler(async(req, res) => {

});

const addPlace = asyncHandler(async(req, res) => {
    const {placeName} = req.body;
    const userId = req.session.user.id;
    const exist = await Foods.findOne({userId});
    let duplicate = false;

    if (!placeName || typeof placeName !== "string") {
        return res.status(400).send({ error: "Invalid placeName" });
    }

    if(exist){
        duplicate = exist.place.some(place => place.name === placeName);

        if(!duplicate){
            await Foods.updateOne(
                { userId: req.session.user.id },
                {
                    $push: {
                        place: {
                            name: placeName,
                            foodList: []
                        }
                    },
                    $set: {
                        updateAt: new Date().setMilliseconds(0)
                    }
                }
            );
        }
    }else{
        await Foods.create({
            userId: req.session.user.id,
            place: [
                {
                    name: placeName,
                    foodList: []
                }
            ]
        })
    }

    const sectionList = await Foods.findOne({userId});

    res.status(200).send({
        result: duplicate,
        sectionList: sectionList.place
    });
});

const updatePlace = asyncHandler(async(req, res) => {
    
});

const deletePlace = asyncHandler(async(req, res) => {
    const {placeName} = req.body;
    const userId = req.session.user.id;
    const result = await Foods.updateOne({userId}, { $pull: { place: { name: placeName } } });
    const sectionList = await Foods.findOne({userId});

    if(result.modifiedCount > 0){
        res.status(200).send({
            result: "success",
            sectionList: sectionList.place
        });
    }else{
        res.status(500).send({
            result: "fail"
        })
    }
});

const addContent = asyncHandler(async(req, res) => {

});

const deleteContent = asyncHandler(async(req, res) => {

});

module.exports = { getContents, addPlace, updatePlace, deletePlace };