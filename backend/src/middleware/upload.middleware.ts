import multer from 'multer';
import { BadRequestError } from '../utils/errors.js';

// Memory storage for piping directly to Supabase Storage
const storage = multer.memoryStorage();

const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/avif'];
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

export const uploadSingleImage = multer({
  storage,
  limits: { fileSize: MAX_FILE_SIZE },
  fileFilter: (_req, file, cb) => {
    if (ALLOWED_MIME_TYPES.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new BadRequestError(`Invalid file format '${file.mimetype}'. Allowed: JPG, PNG, WEBP, AVIF`));
    }
  },
}).single('image');

export const uploadMultipleImages = multer({
  storage,
  limits: { fileSize: MAX_FILE_SIZE },
  fileFilter: (_req, file, cb) => {
    if (ALLOWED_MIME_TYPES.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new BadRequestError(`Invalid file format '${file.mimetype}'. Allowed: JPG, PNG, WEBP, AVIF`));
    }
  },
}).array('images', 8); // Max 8 images per upload
