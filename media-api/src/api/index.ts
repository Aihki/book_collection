import express, {Request, Response} from 'express';
import mediaRoute from './routes/mediaRoute';
import tagRoute from './routes/tagRoute';
import statusRoute from './routes/statusRoute';
import listRoute from './routes/listRoute';
import reviewModel from './routes/reviewRoute';

const router = express.Router();

router.get('/', (req: Request, res: Response) => {
  res.json({
    message: 'media api v1',
  });
});

router.use('/media', mediaRoute);
router.use('/tags', tagRoute);
router.use('/status', statusRoute);
router.use('/list', listRoute);
router.use('/review', reviewModel);

export default router;
