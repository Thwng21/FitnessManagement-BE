import { Logger, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => {
        const logger = new Logger('Database');
        logger.log('🔄 Định cấu hình kết nối tới Supabase (PostgreSQL)...');
        
        return {
          type: 'postgres',
          url: configService.get<string>('DATABASE_URL'),
          autoLoadEntities: true,
          synchronize: true, // Only for development!
          ssl: {
            rejectUnauthorized: false,
          },
          extra: {
            max: 10,
            connectionTimeoutMillis: 20000, // Cập nhật timeout lên 20s
            idleTimeoutMillis: 30000,
            keepAlive: true, // Giữ kết nối
            keepAliveInitialDelayMillis: 10000,
          },
        };
      },
      inject: [ConfigService],
    }),
  ],
  exports: [TypeOrmModule],
})
export class DatabaseModule {}