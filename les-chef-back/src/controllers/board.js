const asyncHandler = require("express-async-handler");
const Board = require("../models/board/boardModel");
const Comment = require("../models/board/boardCommentModel");
const BoardLike = require("../models/board/boardLikeModel");

// 단일 리스트 API (현재 카테고리 분류 필드는 없으므로 전체 목록)
const listBoards = asyncHandler(async(req, res) => {
    try {
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

        res.status(200).json({
            error: false,
            list: list || [],
            page: pageNum,
            limit: limitNum,
            total: total || 0
        });
    } catch (error) {
        throw error;
    }
});

const postWriting = asyncHandler(async(req, res) => {
    if (!req.session?.user) {
        return res.status(401).json({
            error: true,
            message: "로그인이 필요합니다."
        });
    }
    
    const { title, content } = req.body;
    const userId = req.session.user.id;
    const userNickName = req.session.user.nickName;

    if (!title || !content) {
        return res.status(400).json({
            error: true,
            message: "제목과 내용은 필수입니다."
        });
    }

    try {
        await Board.create({
            title: title,
            userId: userId,
            nickName: userNickName,
            content: content
        });

        res.status(200).json({
            error: false,
            message: "ok"
        });
    } catch (error) {
        throw error;
    }
});

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

    res.status(200).json({
        error: false,
        content,
        comments: comments || [],
        likeCount: likeCount || 0,
        liked
    });
});

const writeComment = asyncHandler(async(req, res) => {
    if (!req.session?.user) {
        return res.status(401).json({
            error: true,
            message: "로그인이 필요합니다."
        });
    }
    
    const {boardId, content} = req.body;
    const userId = req.session.user.id;
    const userNickName = req.session.user.nickName;

    if (!boardId || !content) {
        return res.status(400).json({
            error: true,
            message: "게시글 ID와 댓글 내용은 필수입니다."
        });
    }

    // 게시글 존재 확인
    const board = await Board.findOne({_id: boardId});
    if (!board) {
        return res.status(404).json({
            error: true,
            message: "게시글을 찾을 수 없습니다."
        });
    }

    try {
        const comment = await Comment.create({
            boardId: boardId,
            nickName: userNickName,
            userId: userId,
            content: content
        });

        res.status(200).json({
            error: false,
            ...comment.toObject()
        });
    } catch (error) {
        throw error;
    }
});

const deleteBoard = asyncHandler(async(req, res) => {
    if (!req.session?.user) {
        return res.status(401).json({
            error: true,
            message: "로그인이 필요합니다."
        });
    }
    
    const { id } = req.params;
    if (!id) {
        return res.status(400).json({
            error: true,
            message: "id가 없습니다."
        });
    }

    // 게시글 존재 및 권한 확인
    const board = await Board.findOne({_id: id});
    if (!board) {
        return res.status(404).json({
            error: true,
            message: "게시글을 찾을 수 없습니다."
        });
    }

    // 본인 게시글만 삭제 가능 (관리자는 예외)
    const user = await require("../models/user/userModel").findOne({id: req.session.user.id});
    if (board.userId !== req.session.user.id && (!user || !user.checkAdmin)) {
        return res.status(403).json({
            error: true,
            message: "본인이 작성한 게시글만 삭제할 수 있습니다."
        });
    }

    try {
        await Promise.all([
            Comment.deleteMany({boardId: id}),
            BoardLike.deleteMany({boardId: id}),
            Board.deleteOne({_id: id})
        ]);

        res.status(200).json({
            error: false,
            message: "ok"
        });
    } catch (error) {
        throw error;
    }
});

// 게시글 수정 (프론트 edit 페이지 대응)
const editBoard = asyncHandler(async (req, res) => {
    if (!req.session?.user) {
        return res.status(401).json({
            error: true,
            message: "로그인이 필요합니다."
        });
    }
    
    const { id } = req.params;
    const { title, content } = req.body;

    if (!id) {
        return res.status(400).json({
            error: true,
            message: "id가 없습니다."
        });
    }

    if (!title || !content) {
        return res.status(400).json({
            error: true,
            message: "제목과 내용은 필수입니다."
        });
    }

    // 게시글 존재 및 권한 확인
    const board = await Board.findOne({_id: id});
    if (!board) {
        return res.status(404).json({
            error: true,
            message: "게시글을 찾을 수 없습니다."
        });
    }

    // 본인 게시글만 수정 가능 (관리자는 예외)
    const user = await require("../models/user/userModel").findOne({id: req.session.user.id});
    if (board.userId !== req.session.user.id && (!user || !user.checkAdmin)) {
        return res.status(403).json({
            error: true,
            message: "본인이 작성한 게시글만 수정할 수 있습니다."
        });
    }

    try {
        const result = await Board.updateOne(
            { _id: id },
            { $set: { title, content, updatedAt: new Date().setMilliseconds(0) } }
        );

        if (result.modifiedCount === 0) {
            return res.status(500).json({
                error: true,
                message: "게시글 수정에 실패했습니다."
            });
        }

        res.status(200).json({
            error: false,
            message: "ok"
        });
    } catch (error) {
        throw error;
    }
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
        return res.status(401).json({
            error: true,
            message: "로그인이 필요합니다."
        });
    }
    
    const { boardId } = req.body;
    if (!boardId) {
        return res.status(400).json({
            error: true,
            message: "boardId가 없습니다."
        });
    }

    // 게시글 존재 확인
    const board = await Board.findOne({_id: boardId});
    if (!board) {
        return res.status(404).json({
            error: true,
            message: "게시글을 찾을 수 없습니다."
        });
    }

    try {
        const exist = await BoardLike.findOne({ boardId, userId: req.session.user.id }).lean();
        if (exist) {
            await BoardLike.deleteOne({ _id: exist._id });
        } else {
            await BoardLike.create({ boardId, userId: req.session.user.id });
        }

        const likeCount = await BoardLike.countDocuments({ boardId });
        res.status(200).json({
            error: false,
            liked: !exist,
            likeCount
        });
    } catch (error) {
        throw error;
    }
});