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
            // Thêm các cấu hình sau để giữ kết nối sống (Keep-Alive)
            // Giúp ngăn chặn việc mạng của Render hoặc Supabase ngắt kết nối do "nhàn rỗi" (idle)
            max: 10, // Kích thước Connection Pool
            connectionTimeoutMillis: 10000, // Chờ tối đa 10s để có kết nối
            idleTimeoutMillis: 30000, // Đóng kết nối nếu nhàn rỗi quá 30s
            keepAlive: true, // Quan trọng: bật tính năng Keep-Alive
          },
        };
      },
      inject: [ConfigService],
    }),
  ],
  exports: [TypeOrmModule],
})
export class DatabaseModule {}