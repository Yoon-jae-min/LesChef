const asyncHandler = require("express-async-handler");
const Board = require("../models/boardModel");
const Comment = require("../models/boardCommentModel");

const getWriting = asyncHandler(async(req, res) => {
    const pageNum = req.query.page;
    const posts = pageNum === "1" ? await Board.find({}, {content: 0}).sort({ createdAt: -1 }).limit(20).lean() : await Board.find({}, {content: 0}).skip(20 + (pageNum * 15)).limit(15).lean();

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

const getWatch = asyncHandler(async(req, res) => {
    await Board.updateOne(
        { _id: req.query.id },
        { $inc: { viewCount: 1 } }
    );

    const content = await Board.find({_id: req.query.id}, {content: 1, viewCount: 1}).lean();
    const comments = await Comment.find({boardId: req.query.id}).sort({createdAt: -1}).lean();



    res.send({
        content: content,
        comments: comments
    });
});

const writeComment = asyncHandler(async(req, res) => {
    const {boardId, nickName, userId, content} = req.body;
    const comment = await Comment.create({
        boardId: boardId,
        nickName: nickName,
        userId: userId,
        content: content
    });

    res.send(comment.toObject());
});

const deleteBoard = asyncHandler(async(req, res) => {
    await Comment.deleteMany({boardId: req.query.id});
    await Board.deleteOne({_id: req.query.id});

    res.send("ok");
});

module.exports = {getWriting, postWriting, getWatch, writeComment, deleteBoard};