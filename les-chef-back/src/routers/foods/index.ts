import express from 'express';
import {
    getPlace,
    addPlace,
    updatePlace,
    deletePlace,
    addContent,
    deleteContent,
    updateContent,
    getExpiryAlerts,
} from '../../controllers/foods';
import { requireAuth } from '../../middleware/auth/auth';

const router = express.Router();

// 모든 식재료 관련 라우트는 인증 필요
router.use(requireAuth);

router
    .get('/place', getPlace)
    .post('/place', addPlace)
    .patch('/place', updatePlace)
    .delete('/place', deletePlace)
    .post('/content', addContent)
    .delete('/content', deleteContent)
    .patch('/content', updateContent)
    .get('/expiry-alerts', getExpiryAlerts);

export default router;
