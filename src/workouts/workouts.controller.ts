import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards, Req } from '@nestjs/common';
import { WorkoutsService, CreateWorkoutDto } from './workouts.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('workouts')
@UseGuards(JwtAuthGuard)
export class WorkoutsController {
  constructor(private readonly workoutsService: WorkoutsService) {}

  @Get()
  async findAll(@Req() req, @Query('date') date?: string) {
    if (date) {
      return this.workoutsService.findOneByDate(req.user.id, date);
    }
    return this.workoutsService.findAll(req.user.id);
  }

  @Get('templates')
  async findAllTemplates(@Req() req) {
    return this.workoutsService.findAllTemplates(req.user.id);
  }

  @Post()
  async upsert(@Req() req, @Body() dto: CreateWorkoutDto): Promise<any> {
    return this.workoutsService.upsert(req.user.id, dto);
  }

  @Patch('exercise/:id')
  async toggleExercise(
    @Req() req,
    @Param('id') id: string,
    @Body('completed') completed: boolean,
  ): Promise<any> {
    return this.workoutsService.toggleExercise(req.user.id, id, completed);
  }

  @Delete(':id')
  async remove(@Req() req, @Param('id') id: string) {
    await this.workoutsService.remove(req.user.id, id);
    return { success: true };
  }
}
