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
        if (dbUrl && dbUrl.includes('6543') && !dbUrl.includes('pgbouncer=true')) {
          dbUrl += (dbUrl.includes('?') ? '&' : '?') + 'pgbouncer=true';
        }

        return {
          type: 'postgres',
          url: dbUrl,
          autoLoadEntities: true,
          synchronize: true, // Only for development!
          ssl: {
            rejectUnauthorized: false,
          },
          extra: {
            max: 10,
            connectionTimeoutMillis: 30000, 
            idleTimeoutMillis: 10000, // Đóng kết nối nhàn rỗi nhanh hơn (10s) thay vì treo
            keepAlive: true, 
            keepAliveInitialDelayMillis: 5000,
            statement_timeout: 30000, // Huỷ query nếu quá 30s
            query_timeout: 30000,
          },
        };
      },
      inject: [ConfigService],
    }),
  ],
  exports: [TypeOrmModule],
})
export class DatabaseModule {}