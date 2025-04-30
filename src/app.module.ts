import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { SectorsModule } from './sectors/sectors.module';
import { AffiliatesModule } from './affiliates/affiliates.module';
import { ChildrenModule } from './children/children.module';
import { DelegatesModule } from './delegates/delegates.module';
import { BenefitsModule } from './benefits/benefits.module';
import { EventsModule } from './events/events.module';
import { DatabaseModule } from './database/database.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ThrottlerModule, ThrottlerModuleOptions } from '@nestjs/throttler';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ThrottlerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (
        config: ConfigService,
      ): Promise<ThrottlerModuleOptions> => ({
        throttlers: [
          {
            ttl: config.get<number>('THROTTLE_TTL') ?? 60000,
            limit: config.get<number>('THROTTLE_LIMIT') ?? 10,
          },
        ],
      }),
    }),
    DatabaseModule,
    UsersModule,
    AuthModule,
    SectorsModule,
    AffiliatesModule,
    ChildrenModule,
    DelegatesModule,
    BenefitsModule,
    EventsModule,
  ],
})
export class AppModule {}
