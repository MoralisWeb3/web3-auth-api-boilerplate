import { CacheModule } from '@nestjs/common';
import type { ClientOpts } from 'redis';
import * as redisStore from 'cache-manager-redis-store';
import { redisUrl } from '../config/env';
import { AuthModule } from '../modules/auth/auth.module';
import { NftModule } from '../modules/nft/nft.module';
import { UserModule } from '../modules/user/user.module';

export const appConfig = {
  imports: [
    CacheModule.register<ClientOpts>({
      store: redisStore,
      url: redisUrl,
      isGlobal: true,
    }), // Read more about caching here: https://docs.nestjs.com/techniques/caching
    AuthModule,
    NftModule,
    UserModule,
  ],
  controllers: [],
  providers: [],
};
