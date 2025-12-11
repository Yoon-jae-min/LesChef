const asyncHandler = require("express-async-handler");
const Board = require("../models/boardModel");
const Comment = require("../models/boardCommentModel");
const BoardLike = require("../models/boardLikeModel");

// 현재 프론트 요청에서 사용하지 않는 리스트 조회 (필요 시 주석 해제)
// const getWriting = asyncHandler(async(req, res) => {
//     const pageNum = req.query.page;
//     const posts = pageNum === "1" ? await Board.find({}, {content: 0}).sort({ createdAt: -1 }).limit(20).lean() : await Board.find({}, {content: 0}).skip(20 + (pageNum * 15)).limit(15).lean();
//
//     res.send(posts);
// });

// 단일 리스트 API (현재 카테고리 분류 필드는 없으므로 전체 목록)
const listBoards = asyncHandler(async(req, res) => {
    const { page = 1, limit = 20 } = req.query;
    const pageNum = Math.max(parseInt(page) || 1, 1);
    const limitNum = Math.max(parseInt(limit) || 20, 1);
    const skip = (pageNum - 1) * limitNum;

    const [total, list] = await Promise.all([
        Board.countDocuments({}),
        Board.find({}, { content: 0 })
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limitNum)
            .lean()
    ]);

    res.send({
        list,
        page: pageNum,
        limit: limitNum,
        total
    });
});

const postWriting = asyncHandler(async(req, res) => {
    if (!req.session?.user) {
        return res.status(401).send("로그인이 필요합니다.");
    }
    const { title, id, nickName, content } = req.body;

    await Board.create({
        title: title,
        userId: id,
        nickName: nickName,
        content: content
    });

    res.send("ok");
});

// 현재 프론트 요청에서 사용하지 않는 상세/댓글 조회 (필요 시 주석 해제)
// const getWatch = asyncHandler(async(req, res) => {
//     await Board.updateOne(
//         { _id: req.query.id },
//         { $inc: { viewCount: 1 } }
//     );
//
//     const content = await Board.find({_id: req.query.id}, {content: 1, viewCount: 1}).lean();
//     const comments = await Comment.find({boardId: req.query.id}).sort({createdAt: -1}).lean();
//
//
//
//     res.send({
//         content: content,
//         comments: comments
//     });
// });

// 게시글 상세 + 댓글
const getBoard = asyncHandler(async(req, res) => {
    const { id } = req.query;
    if(!id){
        return res.status(400).send("id가 없습니다.");
    }

    await Board.updateOne({ _id: id }, { $inc: { viewCount: 1 } });

    const content = await Board.findOne({_id: id}).lean();
    if(!content){
        return res.status(404).send("게시글을 찾을 수 없습니다.");
    }
    const comments = await Comment.find({boardId: id}).sort({createdAt: -1}).lean();

    // 좋아요 정보
    const likeCount = await BoardLike.countDocuments({ boardId: id });
    let liked = false;
    if (req.session?.user) {
        const exist = await BoardLike.findOne({ boardId: id, userId: req.session.user.id }).lean();
        liked = !!exist;
    }

    res.send({
        content,
        comments,
        likeCount,
        liked
    });
});

const writeComment = asyncHandler(async(req, res) => {
    if (!req.session?.user) {
        return res.status(401).send("로그인이 필요합니다.");
    }
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
    if (!req.session?.user) {
        return res.status(401).send("로그인이 필요합니다.");
    }
    const { id } = req.params;
    if (!id) {
        return res.status(400).send("id가 없습니다.");
    }
    await Comment.deleteMany({boardId: id});
    await BoardLike.deleteMany({boardId: id});
    await Board.deleteOne({_id: id});

    res.send("ok");
});

// 게시글 수정 (프론트 edit 페이지 대응)
const editBoard = asyncHandler(async (req, res) => {
    if (!req.session?.user) {
        return res.status(401).send("로그인이 필요합니다.");
    }
    const { id } = req.params;
    const { title, content } = req.body;

    if (!id) {
        return res.status(400).send("id가 없습니다.");
    }

    const result = await Board.updateOne(
        { _id: id },
        { $set: { title, content, updatedAt: new Date().setMilliseconds(0) } }
    );

    if (result.modifiedCount === 0) {
        return res.status(404).send("게시글을 찾을 수 없습니다.");
    }

    res.send("ok");
});

module.exports = {
    // getWriting,
    postWriting,
    // getWatch,
    writeComment,
    deleteBoard,
    editBoard,
    listBoards,
    getBoard,
    toggleBoardLike
};

// 게시글 좋아요 토글
const toggleBoardLike = asyncHandler(async (req, res) => {
    if (!req.session?.user) {
        return res.status(401).send("로그인이 필요합니다.");
    }
    const { boardId } = req.body;
    if (!boardId) {
        return res.status(400).send("boardId가 없습니다.");
    }

    const exist = await BoardLike.findOne({ boardId, userId: req.session.user.id }).lean();
    if (exist) {
        await BoardLike.deleteOne({ _id: exist._id });
    } else {
        await BoardLike.create({ boardId, userId: req.session.user.id });
    }

    const likeCount = await BoardLike.countDocuments({ boardId });
    res.send({
        liked: !exist,
        likeCount
    });
});