import multer from 'multer';
import path from 'path';

export const AvatarUploadHandler = multer({ storage: multer.memoryStorage(), 
    fileFilter:  (req, file, callback) => {
        var ext = path.extname(file.originalname);
        if(ext !== '.png' && ext !== '.jpg' && ext !== '.gif' && ext !== '.jpeg') {
            return callback(new Error('Only images are allowed'), false);
        }
        callback(null, true);
    },
    limits: {
        fileSize: 5000000,
    }
});