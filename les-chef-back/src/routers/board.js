const express = require("express");
const router = express.Router();

const {
    // getWriting,
    postWriting,
    // getWatch,
    writeComment,
    deleteBoard,
    editBoard,
    listBoards,
    getBoard,
    toggleBoardLike
} = require("../controllers/board");

router
    // 리스트/상세는 현재 프론트에서 사용하지 않으므로 주석 처리
    // .get("/write", getWriting)
    // .get("/watch", getWatch)
    .get("/list", listBoards)
    .get("/watch", getBoard)
    .post("/write", postWriting)
    .patch("/:id", editBoard) // PATCH /board/:id - 게시글 수정
    .delete("/:id", deleteBoard) // DELETE /board/:id - 게시글 삭제
    .post("/commentWrite", writeComment)
    .post("/like", toggleBoardLike);

module.exports = router;