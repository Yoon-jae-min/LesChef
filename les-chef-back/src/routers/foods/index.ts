import express from 'express';
import type { NextFunction, Request, Response } from 'express';
import {
    getPlace,
    addPlace,
    updatePlace,
    deletePlace,
    addContent,
    deleteContent,
    updateContent,
    getExpiryAlerts,
    uploadFoodItemImage,
} from '../../controllers/foods';
import { requireAuth } from '../../middleware/auth/auth';
import { foodsItemImageUpload } from '../../uploads/foodsItemImg';

const router = express.Router();

router.use(requireAuth);

const runFoodsItemUpload = (req: Request, res: Response, next: NextFunction) => {
    foodsItemImageUpload(req, res, (err: unknown) => {
        if (err instanceof Error) {
            res.status(400).json({
                error: true,
                message: err.message || '이미지 업로드에 실패했습니다.',
            });
            return;
        }
        next();
    });
};

router
    .post('/upload-item-image', runFoodsItemUpload, uploadFoodItemImage)
    .get('/place', getPlace)
    .post('/place', addPlace)
    .patch('/place', updatePlace)
    .delete('/place', deletePlace)
    .post('/content', addContent)
    .delete('/content', deleteContent)
    .patch('/content', updateContent)
    .get('/expiry-alerts', getExpiryAlerts);

export default router;
