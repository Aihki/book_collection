import {Request, Response, NextFunction} from 'express';
import CustomError from '../../classes/CustomError';
import {MediaResponse, MessageResponse} from '@sharedTypes/MessageTypes';
import {statusResult} from '@sharedTypes/DBTypes';
import {allStatuses} from '../models/statusModel';

const statusGet = async (
  req: Request,
  res: Response<statusResult[]>,
  next: NextFunction
) => {
  try {
    const status = await allStatuses();
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

export {statusGet};
