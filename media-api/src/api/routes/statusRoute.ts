import express from 'express';
import {authenticate} from '../../middlewares';
import {statusGet} from '../controllers/statusController';

const router = express.Router();
router.route('/').get(statusGet);

export default router;
