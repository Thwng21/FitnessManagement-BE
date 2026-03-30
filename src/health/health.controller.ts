import { Controller, Get, Post, Body, Param, Query, UseGuards } from '@nestjs/common';
import { HealthService } from './health.service';
import { Health } from './entities/health.entity';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('health')
@UseGuards(JwtAuthGuard)
export class HealthController {
  constructor(private readonly healthService: HealthService) {}

  @Get()
  async findAll(): Promise<Health[]> {
    return this.healthService.findAll();
  }

  @Get(':date')
  async findByDate(@Param('date') date: string): Promise<Health | null> {
    return this.healthService.findByDate(date);
  }

  @Post()
  async upsert(@Body() dto: Partial<Health>): Promise<Health> {
    return this.healthService.upsert(dto);
  }
}
