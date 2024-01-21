import {Request, Response, NextFunction} from 'express';
import CustomError from '../../classes/CustomError';
import {MediaResponse, MessageResponse} from '@sharedTypes/MessageTypes';
import {reviewResult} from '@sharedTypes/DBTypes';
import {bookReviews} from '../models/reviewModel';

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

export {reviewById};
