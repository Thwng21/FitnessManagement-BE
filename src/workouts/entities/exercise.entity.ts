import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Workout } from './workout.entity';

@Entity()
export class Exercise {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ type: 'int' })
  sets: number;

  @Column({ type: 'int' })
  reps: number;

  @Column({ type: 'float', default: 0 })
  weight: number;

  @Column({ default: false })
  completed: boolean;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ nullable: true })
  videoUrl: string;

  @ManyToOne(() => Workout, (workout) => workout.exercises, { onDelete: 'CASCADE' })
  workout: Workout;
}
