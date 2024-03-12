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

router
  .route('/upload')
  .post(authenticate, upload.single('file'), makeThumbnail, uploadFile);

router.route('/delete/:filename').delete(authenticate, deleteFile);

export default router;
