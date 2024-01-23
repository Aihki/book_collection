import {Request, Response, NextFunction} from 'express';
import CustomError from '../../classes/CustomError';
import {MediaResponse, MessageResponse} from '@sharedTypes/MessageTypes';
import {Rating, Review, TokenContent, reviewResult} from '@sharedTypes/DBTypes';
import {bookReviews, postRating, postReview} from '../models/reviewModel';

const reviewById = async (
  req: Request<{id: number}, {}, {}>,
  res: Response<reviewResult[]>,
  next: NextFunction
) => {
  try {
    const status = await bookReviews(Number(req.params.id));
    if (status === null) {
      const error = new CustomError('No status found', 404);
      next(error);
      return;
    }
    res.json(status);
  } catch (error) {
    next(error);
  }
};

const postReviewById = async (
  req: Request<{}, {}, Omit<Review, 'review_id'>>,
  res: Response<MessageResponse>,
  next: NextFunction
) => {
  try {
    const review = await postReview(req.body);
    if (review === null) {
      const error = new CustomError('review no added', 404);
      next(error);
      return;
    }
    res.json({message: 'Review added'});
  } catch (error) {
    next(error);
  }
};

const postRatingById = async (
  req: Request<{}, {}, Omit<Rating, 'rating_id'>>,
  res: Response<MessageResponse>,
  next: NextFunction
) => {
  try {
    const rating = await postRating(req.body);
    if (rating === null) {
      const error = new CustomError('rating no added', 404);
      next(error);
      return;
    }
    res.json({message: 'Rating added'});
  } catch (error) {
    next(error);
  }
};

export {reviewById, postReviewById, postRatingById};
