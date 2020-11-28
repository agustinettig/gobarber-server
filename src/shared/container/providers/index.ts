import { container } from 'tsyringe';

import IStorageProvider from '@shared/container/providers/StorageProvider/models/IStorageProvider';
import DiskProvider from '@shared/container/providers/StorageProvider/implementations/DiskStorageProvider';

container.registerSingleton<IStorageProvider>('StorageProvider', DiskProvider);
