import express from 'express';
import {authenticate} from '../../middlewares';
import {bookList} from '../controllers/listController';

const router = express.Router();
router.route('/:id').get(bookList);

export default router;
