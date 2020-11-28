import multer from 'multer';
import path from 'path';
import crypto from 'crypto';

const tmpDir = path.resolve(__dirname, '..', '..', 'tmp');

export default {
    tmpFolder: tmpDir,
    uploadsFolder: path.resolve(tmpDir, 'uploads'),
    storage: multer.diskStorage({
        destination: tmpDir,
        filename(request, file, callback) {
            const fileHash = crypto.randomBytes(10).toString('hex');
            const fileName = `${fileHash}-${file.originalname}`;

            return callback(null, fileName);
        },
    }),
};
