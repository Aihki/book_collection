import express, {Request} from 'express';
import {deleteFile, uploadFile} from '../controllers/uploadController';
import multer, {FileFilterCallback} from 'multer';
import {authenticate, makeThumbnail} from '../../middlewares';
import path from 'path';


const fileFilter = (
  request: Request,
  file: Express.Multer.File,
  cb: FileFilterCallback,
) => {
  if (file.mimetype.includes('image') || file.mimetype.includes('video')) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};
const uploadPath = path.join(__dirname, '..', '..', 'uploads');
console.log(uploadPath);
const upload = multer({dest: uploadPath, fileFilter});
const router = express.Router();

// TODO: validation

/**
* @api {post} /upload Upload File
* @apiName UploadFile
* @apiGroup File
* @apiDescription Uploads a file and creates a thumbnail.
*
* @apiHeader {String} Authorization User's authorization token.
*
* @apiParam (Request Body) {File} file File to upload (form-data).
* @apiParamExample {form-data} Request-Example:
*  {
*   "file": "file"
* }
* @apiSuccess {String} original Original file URL.
* @apiSuccess {String} thumbnail Thumbnail file URL.
* @apiSuccessExample {json} Success-Response:
*   HTTP/1.1 200 OK
* {
*  "original": "http://localhost:3000/uploads/1619781531533-IMG_20210429_123456.jpg",
* "thumbnail": "http://localhost:3000/uploads/thumbnails/1619781531533-IMG_20210429_123456.jpg"
* }
*
*
* @apiError (Error 401) Unauthorized User authentication failed.
* @apiError (Error 422) UnprocessableEntity Unable to process the request.
* @apiError (Error 500) InternalServerError Server error occurred.
*/


router
  .route('/upload')
  .post(authenticate, upload.single('file'), makeThumbnail, uploadFile);


 /**
 * @api {delete} /delete/:filename Delete File
 * @apiName DeleteFile
 * @apiGroup File
 * @apiDescription Deletes a file by filename.
 *
 * @apiHeader {String} Authorization User's authorization token.
 *
 * @apiParam {String} filename Filename of the file to delete.
 *
 * @apiSuccess {String} message Success message.
 * @apiSuccessExample {json} Success-Response:
 *    HTTP/1.1 200 OK
 *   {
 *    "message": "File deleted successfully."
 *  }
 *
 *
 * @apiError (Error 401) Unauthorized User authentication failed.
 * @apiError (Error 404) NotFound File not found.
 * @apiError (Error 500) InternalServerError Server error occurred.
 */
router.route('/delete/:filename').delete(authenticate, deleteFile);

export default router;
