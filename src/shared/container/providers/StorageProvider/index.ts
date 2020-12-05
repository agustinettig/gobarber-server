import { container } from 'tsyringe';

import uploadConfig from '@config/upload';
import IStorageProvider from '@shared/container/providers/StorageProvider/models/IStorageProvider';
import DiskStorageProvider from '@shared/container/providers/StorageProvider/implementations/DiskStorageProvider';

const providers = {
    disk: DiskStorageProvider,
};

container.registerSingleton<IStorageProvider>('StorageProvider', providers[uploadConfig.driver]);
