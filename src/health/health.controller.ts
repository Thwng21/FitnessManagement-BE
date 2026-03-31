import { Controller, Get, Post, Body, Param, Query, UseGuards, Request } from '@nestjs/common';
import { HealthService } from './health.service';
import { Health } from './entities/health.entity';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('health')
@UseGuards(JwtAuthGuard)
export class HealthController {
  constructor(private readonly healthService: HealthService) {}

  @Get()
  async findAll(@Request() req: any): Promise<Health[]> {
    const userId = req.user.id;
    return this.healthService.findAll(userId);
  }

  @Get(':date')
  async findByDate(@Request() req: any, @Param('date') date: string): Promise<Health | null> {
    const userId = req.user.id;
    return this.healthService.findByDate(userId, date);
  }

  @Post()
  async upsert(@Request() req: any, @Body() dto: Partial<Health>): Promise<Health> {
    const userId = req.user.id;
    return this.healthService.upsert(userId, dto);
  }
}
