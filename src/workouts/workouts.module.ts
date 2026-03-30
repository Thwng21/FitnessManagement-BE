import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Workout } from './entities/workout.entity';
import { Exercise } from './entities/exercise.entity';
import { WorkoutsService } from './workouts.service';
import { WorkoutsController } from './workouts.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Workout, Exercise])],
  controllers: [WorkoutsController],
  providers: [WorkoutsService],
})
export class WorkoutsModule {}
