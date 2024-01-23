import express from 'express';
import {authenticate} from '../../middlewares';
import {
  postRatingById,
  postReviewById,
  reviewById,
} from '../controllers/reviewController';

const router = express.Router();

//endpoint: /api/review
router.route('/:id').get(reviewById);
router.route('/newReview/:id').post(postReviewById);
router.route('/newRating/:id').post(postRatingById);

export default router;
