import express from 'express';
import {
    postWriting,
    deleteBoard,
    editBoard,
    listBoards,
    getBoard,
} from '../../controllers/board/board';
import { writeComment } from '../../controllers/board/boardComment';
import { toggleBoardLike } from '../../controllers/board/boardLike';

const router = express.Router();

router
    // GET /list — 목록, GET /watch — 상세(쿼리 id)
    .get('/list', listBoards)
    .get('/watch', getBoard)
    .post('/write', postWriting)
    .patch('/:id', editBoard) // PATCH /board/:id - 게시글 수정
    .delete('/:id', deleteBoard) // DELETE /board/:id - 게시글 삭제
    .post('/commentWrite', writeComment)
    .post('/like', toggleBoardLike);

export default router;
