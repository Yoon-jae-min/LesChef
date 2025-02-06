const asyncHandler = require("express-async-handler");
const Foods = require("../models/foodsModel");

const getPlace = asyncHandler(async(req, res) => {
    const userId = req.session.user.id;
    const sectionList = await Foods.findOne({userId}).lean();

    res.status(200).send({
        sectionList: sectionList.place
    });
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

    const sectionList = await Foods.findOne({userId}).lean();

    res.status(200).send({
        result: duplicate,
        sectionList: sectionList.place
    });
});

const updatePlace = asyncHandler(async(req, res) => {
    const {placeName, changeName} = req.body;
    const userId = req.session.user.id;

    try{
        if(placeName === changeName){
            res.status(200).send({
                same: true,
                exist: false
            });
            return;
        }

        if(await Foods.findOne({userId, "place.name": changeName}).lean()){
            res.status(200).send({
                same: false,
                exist: true
            })
        }

        const result = await Foods.updateOne(
            {userId, "place.name": placeName},
            {$set: {"place.$.name": changeName}}
        )

        if(result.modifiedCount > 0){
            const sectionList = await Foods.findOne({userId}).lean();
            res.status(200).send({
                same: false,
                exist: false,
                sectionList: sectionList.place
            });
        }else{
            res.status(500).end();
        }
    }catch(err) {
        console.log(err);
        res.status(500).end();
    }
});

const deletePlace = asyncHandler(async(req, res) => {
    const {placeName} = req.body;
    const userId = req.session.user.id;
    const result = await Foods.updateOne({userId}, { $pull: { place: { name: placeName } } });
    const sectionList = await Foods.findOne({userId}).lean();

    if(result.modifiedCount > 0){
        res.status(200).send({
            sectionList: sectionList.place
        });
    }else{
        res.status(500).end();
    }
});

const addContent = asyncHandler(async(req, res) => {
    const {placeName, unitName, unitVol, unitUnit, unitDate} = req.body;
    const userId = req.session.user.id;

    const result = await Foods.updateOne(
        {userId, "place.name": placeName},
        {$push: {
            "place.$.foodList": {
                name: unitName,
                volume: unitVol,
                unit: unitUnit,
                expirate: new Date(unitDate)
            }
        }}
    );

    const sectionList = await Foods.findOne({userId}).lean();

    if(result.modifiedCount === 0){
        res.status(500).send({
            result: "fail"
        });
    }else{
        res.status(200).send({
            result: "success",
            sectionList: sectionList.place
        });
    }
});

const deleteContent = asyncHandler(async(req, res) => {
    const {place, food} = req.body;
    const userId = req.session.user.id;

    const result = await Foods.updateOne(
        {userId, "place.name": place},
        {$pull: {
            "place.$.foodList": {
                name: food
            }
        }}
    );

    const sectionList = await Foods.findOne({userId}).lean();

    if(result.modifiedCount === 0){
        res.status(500).send({
            result: "fail"
        });
    }else{
        res.status(200).send({
            result: "success",
            sectionList: sectionList.place
        });
    }
});

const updateContent = asyncHandler(async(req, res) => {
    const {name, vol, unit, date, placeName, contentId} = req.body;
    const userId = req.session.user.id;

    const result = await Foods.updateOne({userId, "place.name": placeName},
        {
            $set: {
                "place.$.foodList.$[food].name": name,
                "place.$.foodList.$[food].volume": vol,
                "place.$.foodList.$[food].unit": unit,
                "place.$.foodList.$[food].expirate": date,
            }
        },
        {
            arrayFilters: [{"food._id": contentId}]
        }
    )

    const sectionList = await Foods.findOne({userId}).lean();

    if(result.modifiedCount === 0){
        res.status(500).send({
            error: true,
            result: false,
            message: "update fail"
        })
    }else{
        res.status(200).send({
            error: false,
            result: true,
            message: "success",
            sectionList: sectionList.place 
        })
    }
});

module.exports = { getPlace, addPlace, updatePlace, deletePlace, addContent, deleteContent, updateContent };