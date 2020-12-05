import multer, { StorageEngine } from 'multer';
import path from 'path';
import crypto from 'crypto';

const tmpDir = path.resolve(__dirname, '..', '..', 'tmp');

interface IUploadConfig {
    driver: 'disk';

    tmpFolder: string;
    uploadsFolder: string;

    multer: {
        storage: StorageEngine;
    };
}

export default {
    driver: process.env.STORAGE_DRIVER,

    tmpFolder: tmpDir,
    uploadsFolder: path.resolve(tmpDir, 'uploads'),

    multer: {
        storage: multer.diskStorage({
            destination: tmpDir,
            filename(request, file, callback) {
                const fileHash = crypto.randomBytes(10).toString('hex');
                const fileName = `${fileHash}-${file.originalname}`;

                return callback(null, fileName);
            },
        }),
    },
} as IUploadConfig;
