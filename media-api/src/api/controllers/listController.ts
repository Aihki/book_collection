import {Request, Response, NextFunction} from 'express';
import CustomError from '../../classes/CustomError';
import {MediaResponse, MessageResponse} from '@sharedTypes/MessageTypes';
import {MediaItem, TokenContent, statusResult} from '@sharedTypes/DBTypes';
import {ownBookList} from '../models/listModel';

const bookList = async (
  req: Request,
  res: Response<MediaItem[]>,
  next: NextFunction
) => {
  try {
    const media = await ownBookList(req.params.id);
    if (media === null) {
      const error = new CustomError('No media found', 404);
      next(error);
      return;
    }
    res.json(media);
  } catch (error) {
    next(error);
  }
};

export {bookList};
