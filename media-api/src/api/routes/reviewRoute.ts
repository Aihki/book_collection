import express from 'express';
import {authenticate} from '../../middlewares';
import {reviewById} from '../controllers/reviewController';

const router = express.Router();
router.route('/:id').get(reviewById);

export default router;
