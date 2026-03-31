import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Not, IsNull } from 'typeorm';
import { Workout, WorkoutStatus } from './entities/workout.entity';
import { Exercise } from './entities/exercise.entity';

export class CreateWorkoutDto {
  title: string;
  date?: string; // Optional for templates
  status?: WorkoutStatus;
  exercises: {
    name: string;
    sets: number;
    reps: number;
    weight: number;
    completed?: boolean;
    description?: string;
    videoUrl?: string;
  }[];
}

@Injectable()
export class WorkoutsService {
  constructor(
    @InjectRepository(Workout)
    private workoutsRepository: Repository<Workout>,
    @InjectRepository(Exercise)
    private exercisesRepository: Repository<Exercise>,
  ) {}

  async findAll(userId: string): Promise<Workout[]> {
    if (!userId) return [];
    return this.workoutsRepository.find({
      where: { userId, date: Not(IsNull()) },
      relations: ['exercises'],
      order: { date: 'DESC' },
    });
  }

  async findAllTemplates(userId: string): Promise<Workout[]> {
    if (!userId) return [];
    return this.workoutsRepository.find({
      where: { userId, date: IsNull() },
      relations: ['exercises'],
      order: { title: 'ASC' },
    });
  }

  async findOneByDate(userId: string, date: string): Promise<Workout | null> {
    if (!userId) return null;
    return this.workoutsRepository.findOne({
      where: { userId, date },
      relations: ['exercises'],
    });
  }

  async upsert(userId: string, dto: CreateWorkoutDto & { id?: string }): Promise<Workout> {
    if (!userId) throw new Error('Không xác định được danh tính người dùng. Vui lòng đăng nhập lại!');
    const { date, title, exercises, id, status } = dto;
    
    return this.workoutsRepository.manager.transaction(async (manager) => {
      // 1. Tìm hoặc tạo workout theo date HOẶC id (cho template)
      let workout: Workout | null = null;
      if (id) {
        workout = await manager.findOne(Workout, { where: { id, userId }, relations: ['exercises'] });
      } else if (date) {
        workout = await manager.findOne(Workout, { where: { date, userId }, relations: ['exercises'] });
      }

      if (workout) {
        // Xóa tất cả bài tập cũ khỏi DB để thay mới hoàn toàn
        await manager.delete(Exercise, { workout: { id: workout.id } });
        workout.exercises = [];
        workout.title = title;
        if (date) workout.date = date;
        if (status) workout.status = status;
        workout.userId = userId;
      } else {
        workout = manager.create(Workout, {
          userId,
          date: (date as string) || null,
          title,
          status: status || WorkoutStatus.NOT_STARTED,
          exercises: [],
        });
      }

      // 2. Lưu workout (với mảng exercises trống)
      const savedWorkout = await manager.save(workout);

      // 3. Tạo các bài tập mới
      const newExercises = exercises.map((ex) =>
        manager.create(Exercise, {
          ...ex,
          workout: savedWorkout,
        }),
      );
      await manager.save(newExercises);

      // 4. Trả về kết quả đầy đủ
      return manager.findOne(Workout, {
        where: { id: savedWorkout.id },
        relations: ['exercises'],
      }) as Promise<Workout>;
    });
  }

  async toggleExercise(userId: string, exerciseId: string, completed: boolean): Promise<Exercise> {
    const exercise = await this.exercisesRepository.findOne({ 
      where: { id: exerciseId },
      relations: ['workout'] 
    });
    if (!exercise) throw new NotFoundException('Exercise not found');
    if (exercise.workout.userId !== userId) throw new Error('KhÃ´ng cÃ³ quyá»n cáºp nháºt bÃ i táºp nÃ y');
    exercise.completed = completed;
    return this.exercisesRepository.save(exercise);
  }

  async remove(userId: string, id: string): Promise<void> {
    await this.workoutsRepository.delete({ id, userId });
  }
}
