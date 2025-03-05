import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { DataSourceOptions } from 'typeorm';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory: (configService: ConfigService): DataSourceOptions => {
        const isProduction =
          configService.get<string>('NODE_ENV') === 'production';
        const entitiesPath = isProduction
          ? __dirname + '/../**/*.entity{.ts,.js}'
          : __dirname + '/../**/*.entity{.ts,.js}';

        console.log('🔍 Entities path:', entitiesPath);

        return {
          type: 'postgres',
          host: configService.get<string>('DB_HOST'),
          port: configService.get<number>('DB_PORT', 5432),
          username: configService.get<string>('DB_USERNAME'),
          password: configService.get<string>('DB_PASSWORD'),
          database: configService.get<string>('DB_DATABASE'),
          synchronize: !isProduction,
          logging: !isProduction,
          entities: [entitiesPath],
        };
      },
      inject: [ConfigService],
    }),
  ],
})
export class DatabaseModule {}
