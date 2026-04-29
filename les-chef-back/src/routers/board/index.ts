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
import { optionalAuth, requireAuth } from '../../middleware/auth/auth';

const router = express.Router();

router
    // GET /list — 목록, GET /watch — 상세(쿼리 id)
    .get('/list', listBoards)
    .get('/watch', optionalAuth, getBoard)
    .post('/write', requireAuth, postWriting)
    .patch('/:id', requireAuth, editBoard) // PATCH /board/:id - 게시글 수정
    .delete('/:id', requireAuth, deleteBoard) // DELETE /board/:id - 게시글 삭제
    .post('/commentWrite', requireAuth, writeComment)
    .post('/like', requireAuth, toggleBoardLike);

export default router;
