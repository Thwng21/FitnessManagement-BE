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
            max: isProduction ? 5 : 10,           // Render free tier CPU khá yếu, giảm max connections
            connectionTimeoutMillis: 10000,       // Giảm xuống 10s để fail-fast và retry (Mặc định 30s là quá lâu)
            idleTimeoutMillis: 30000,             // Nén idle timeout
            allowExitOnIdle: true,                // Tránh treo Node event loop do connection
            application_name: 'gym_backend',      // Dễ debug trong Supabase Dashbaord
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