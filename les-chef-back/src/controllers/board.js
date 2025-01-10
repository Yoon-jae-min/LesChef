const asyncHandler = require("express-async-handler");
const Board = require("../models/boardModel");

const getWriting = asyncHandler(async(req, res) => {
    const pageNum = req.query.page;

    console.log(pageNum);
    const posts = pageNum === "1" ? await Board.find().sort({ createdAt: -1 }).limit(20).lean() : await Board.find().skip(20 + (pageNum * 15)).limit(15).lean();

    res.send(posts);
});

const postWriting = asyncHandler(async(req, res) => {
    const { title, id, nickName, content } = req.body;

    await Board.create({
        title: title,
        userId: id,
        nickName: nickName,
        content: content
    });

    res.send("ok");
});

module.exports = {getWriting, postWriting};