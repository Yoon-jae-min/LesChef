const asyncHandler = require("express-async-handler");
const Foods = require("../models/foods/foodsModel");
const isDev = process.env.NODE_ENV !== 'production';

const getPlace = asyncHandler(async(req, res) => {
    if (!req.session?.user?.id) {
        return res.status(401).json({
            error: true,
            message: "로그인이 필요합니다."
        });
    }

    try {
        const userId = req.session.user.id;
        const sectionList = await Foods.findOne({userId}).lean();

        res.status(200).json({
            error: false,
            sectionList: sectionList?.place || []
        });
    } catch (error) {
        throw error;
    }
});

const addPlace = asyncHandler(async(req, res) => {
    if (!req.session?.user?.id) {
        return res.status(401).json({
            error: true,
            message: "로그인이 필요합니다."
        });
    }

    const {placeName} = req.body;
    const userId = req.session.user.id;

    if (!placeName || typeof placeName !== "string" || placeName.trim() === "") {
        return res.status(400).json({
            error: true,
            message: "유효한 보관 장소 이름이 필요합니다."
        });
    }

    try {
        const exist = await Foods.findOne({userId});
        let duplicate = false;

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

        res.status(200).json({
            error: false,
            result: duplicate,
            sectionList: sectionList?.place || []
        });
    } catch (error) {
        throw error;
    }
});

const updatePlace = asyncHandler(async(req, res) => {
    if (!req.session?.user?.id) {
        return res.status(401).json({
            error: true,
            message: "로그인이 필요합니다."
        });
    }

    const {placeName, changeName} = req.body;
    const userId = req.session.user.id;

    if (!placeName || !changeName) {
        return res.status(400).json({
            error: true,
            message: "기존 이름과 변경할 이름이 필요합니다."
        });
    }

    try{
        if(placeName === changeName){
            return res.status(200).json({
                error: false,
                same: true,
                exist: false
            });
        }

        if(await Foods.findOne({userId, "place.name": changeName}).lean()){
            return res.status(200).json({
                error: false,
                same: false,
                exist: true
            });
        }

        const result = await Foods.updateOne(
            {userId, "place.name": placeName},
            {$set: {"place.$.name": changeName}}
        );

        if(result.modifiedCount > 0){
            const sectionList = await Foods.findOne({userId}).lean();
            res.status(200).json({
                error: false,
                same: false,
                exist: false,
                sectionList: sectionList?.place || []
            });
        }else{
            res.status(404).json({
                error: true,
                message: "보관 장소를 찾을 수 없습니다."
            });
        }
    }catch(err) {
        if (isDev) {
            console.error("보관 장소 수정 오류:", err);
        }
        throw err;
    }
});

const deletePlace = asyncHandler(async(req, res) => {
    if (!req.session?.user?.id) {
        return res.status(401).json({
            error: true,
            message: "로그인이 필요합니다."
        });
    }

    const {placeName} = req.body;
    const userId = req.session.user.id;

    if (!placeName) {
        return res.status(400).json({
            error: true,
            message: "보관 장소 이름이 필요합니다."
        });
    }

    try {
        const result = await Foods.updateOne({userId}, { $pull: { place: { name: placeName } } });
        const sectionList = await Foods.findOne({userId}).lean();

        if(result.modifiedCount > 0){
            res.status(200).json({
                error: false,
                sectionList: sectionList?.place || []
            });
        }else{
            res.status(404).json({
                error: true,
                message: "보관 장소를 찾을 수 없습니다."
            });
        }
    } catch (error) {
        throw error;
    }
});

const addContent = asyncHandler(async(req, res) => {
    if (!req.session?.user?.id) {
        return res.status(401).json({
            error: true,
            message: "로그인이 필요합니다."
        });
    }

    const {placeName, unitName, unitVol, unitUnit, unitDate} = req.body;
    const userId = req.session.user.id;

    if (!placeName || !unitName) {
        return res.status(400).json({
            error: true,
            message: "보관 장소 이름과 식재료 이름은 필수입니다."
        });
    }

    try {
        const result = await Foods.updateOne(
            {userId, "place.name": placeName},
            {$push: {
                "place.$.foodList": {
                    name: unitName,
                    volume: unitVol || 0,
                    unit: unitUnit || "",
                    expirate: unitDate ? new Date(unitDate) : new Date()
                }
            }}
        );

        const sectionList = await Foods.findOne({userId}).lean();

        if(result.modifiedCount === 0){
            res.status(404).json({
                error: true,
                message: "보관 장소를 찾을 수 없습니다.",
                result: "fail"
            });
        }else{
            res.status(200).json({
                error: false,
                result: "success",
                sectionList: sectionList?.place || []
            });
        }
    } catch (error) {
        throw error;
    }
});

const deleteContent = asyncHandler(async(req, res) => {
    if (!req.session?.user?.id) {
        return res.status(401).json({
            error: true,
            message: "로그인이 필요합니다."
        });
    }

    const {place, food} = req.body;
    const userId = req.session.user.id;

    if (!place || !food) {
        return res.status(400).json({
            error: true,
            message: "보관 장소 이름과 식재료 이름은 필수입니다."
        });
    }

    try {
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
            res.status(404).json({
                error: true,
                message: "식재료를 찾을 수 없습니다.",
                result: "fail"
            });
        }else{
            res.status(200).json({
                error: false,
                result: "success",
                sectionList: sectionList?.place || []
            });
        }
    } catch (error) {
        throw error;
    }
});

const updateContent = asyncHandler(async(req, res) => {
    if (!req.session?.user?.id) {
        return res.status(401).json({
            error: true,
            message: "로그인이 필요합니다."
        });
    }

    const {name, vol, unit, date, placeName, contentId} = req.body;
    const userId = req.session.user.id;

    if (!placeName || !contentId || !name) {
        return res.status(400).json({
            error: true,
            message: "보관 장소 이름, 식재료 ID, 식재료 이름은 필수입니다."
        });
    }

    try {
        const result = await Foods.updateOne({userId, "place.name": placeName},
            {
                $set: {
                    "place.$.foodList.$[food].name": name,
                    "place.$.foodList.$[food].volume": vol || 0,
                    "place.$.foodList.$[food].unit": unit || "",
                    "place.$.foodList.$[food].expirate": date ? new Date(date) : new Date(),
                }
            },
            {
                arrayFilters: [{"food._id": contentId}]
            }
        );

        const sectionList = await Foods.findOne({userId}).lean();

        if(result.modifiedCount === 0){
            res.status(404).json({
                error: true,
                result: false,
                message: "식재료를 찾을 수 없습니다."
            });
        }else{
            res.status(200).json({
                error: false,
                result: true,
                message: "success",
                sectionList: sectionList?.place || []
            });
        }
    } catch (error) {
        throw error;
    }
});

module.exports = { getPlace, addPlace, updatePlace, deletePlace, addContent, deleteContent, updateContent };