import { getRepository } from 'typeorm';
import path from 'path';
import fs from 'fs';

import User from '../models/User';
import uploadConfig from '../config/upload';
import AppError from '../errors/AppError';

interface Request {
    userId: string;
    avatarFileName: string;
}

class UpdateUserAvatarService {
    public async execute({ userId, avatarFileName }: Request): Promise<User> {
        const usersRepository = getRepository(User);

        const user = await usersRepository.findOne(userId);

        if (!user) {
            throw new AppError('Only authenticated users can update the avatar', 401);
        }

        if (user.avatar) {
            await this.deleteFile(user.avatar);
        }

        user.avatar = avatarFileName;

        await usersRepository.save(user);

        return user;
    }

    private async deleteFile(fileName: string) {
        const filePath = path.join(uploadConfig.directory, fileName);
        const fileExists = await fs.promises.stat(filePath);

        if (fileExists) {
            await fs.promises.unlink(filePath);
        }
    }
}

export default UpdateUserAvatarService;
