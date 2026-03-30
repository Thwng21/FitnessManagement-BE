import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Exercise } from './exercise.entity';

export enum WorkoutStatus {
  COMPLETED = 'completed',
  IN_PROGRESS = 'in_progress',
  NOT_STARTED = 'not_started',
}

@Entity()
export class Workout {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column({ type: 'date', nullable: true })
  date: string | null; // ISO string 'YYYY-MM-DD'

  @Column({
    type: 'enum',
    enum: WorkoutStatus,
    default: WorkoutStatus.NOT_STARTED,
  })
  status: WorkoutStatus;

  @Column()
  userId: string;

  @OneToMany(() => Exercise, (exercise) => exercise.workout, { cascade: true })
  exercises: Exercise[];
}
