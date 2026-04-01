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
        
        let dbUrl = configService.get<string>('DATABASE_URL');
        // Ép sử dụng connection pooler nếu đang dùng Supabase IPv4 fallback
        if (dbUrl && dbUrl.includes('6543') && !dbUrl.includes('pgbouncer=true')) {
          dbUrl += (dbUrl.includes('?') ? '&' : '?') + 'pgbouncer=true';
        }

        const isProduction = process.env.NODE_ENV === 'production';

        return {
          type: 'postgres',
          url: dbUrl,
          autoLoadEntities: true,
          // ⚠️ QUAN TRỌNG: KHÔNG ĐƯỢC để synchronize = true trên production (Render) 
          // vì pooler port 6543 (Transaction Mode) sẽ bị treo/timeout khi thực thi DDL thay đổi Schema
          synchronize: !isProduction,
          ssl: {
            rejectUnauthorized: false, // Bắt buộc cho Supabase/Render
          },
          extra: {
            max: isProduction ? 20 : 10,
            connectionTimeoutMillis: 30000,       // Tăng thời gian chờ lên 30s để tránh bị timeout sớm
            idleTimeoutMillis: 10000,             // Giảm xuống 10s để Pool tự đóng connection trước khi Render/Supabase ngắt
            allowExitOnIdle: true,
            keepAlive: true,
            keepAliveInitialDelayMillis: 10000,   // Heartbeat mỗi 10s
            application_name: 'gym_backend',
          },
          poolSize: isProduction ? 5 : 10,
        };
      },
      inject: [ConfigService],
    }),
  ],
  exports: [TypeOrmModule],
})
export class DatabaseModule {}