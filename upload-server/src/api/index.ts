import express from 'express';

import fileRoute from './routes/fileRoute';
import {MessageResponse} from '@sharedTypes/MessageTypes';

const router = express.Router();

router.get<{}, MessageResponse>('/', (req, res) => {
  res.json({
    message: 'routes: /upload, /delete',
  });
});
/** @api {get} / Endpoint
* @apiName GetRoot
* @apiGroup API
*
* @apiSuccess {Object} data Data object containing message.
* @apiSuccessExample {json} Success-Response:
*     HTTP/1.1 200 OK
*     {
*       "message": "routes: /upload, /delete"
*     }
*/
router.use('/', fileRoute);

export default router;
