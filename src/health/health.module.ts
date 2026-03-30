import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Health } from './entities/health.entity';
import { HealthService } from './health.service';
import { HealthController } from './health.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Health])],
  controllers: [HealthController],
  providers: [HealthService],
})
export class HealthModule {}
