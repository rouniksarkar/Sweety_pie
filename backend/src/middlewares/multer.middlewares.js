import multer from 'multer';

// Keep files in memory only while they are streamed to Cloudinary.
export const upload = multer({ storage: multer.memoryStorage() });
