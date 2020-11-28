import { container } from 'tsyringe';

import IHashProvider from '@modules/users/providers/HashProvider/models/IHashProvider';
import BCryptHashProvider from '@modules/users/providers/HashProvider/implementations/BCryptHashProvider';

import ITokenProvider from '@modules/users/providers/TokenProvider/models/ITokenProvider';
import JwtTokenProvider from '@modules/users/providers/TokenProvider/implementations/JwtTokenProvider';

container.registerSingleton<IHashProvider>('HashProvider', BCryptHashProvider);

container.registerSingleton<ITokenProvider>('TokenProvider', JwtTokenProvider);
