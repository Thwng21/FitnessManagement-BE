import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Health {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid', nullable: true })
  userId: string;

  @Column({ type: 'date', unique: false })
  date: string; // ISO string 'YYYY-MM-DD'

  // Body Metrics
  @Column({ type: 'float', nullable: true })
  weight: number;

  @Column({ type: 'float', nullable: true })
  height: number;

  @Column({ type: 'int', nullable: true })
  heart_rate: number;

  @Column({ type: 'float', nullable: true })
  body_fat: number;

  @Column({ type: 'float', nullable: true })
  muscle_mass: number;

  @Column({ type: 'float', nullable: true })
  waist: number;

  @Column({ type: 'float', nullable: true })
  chest: number;

  @Column({ type: 'float', nullable: true })
  hip: number;

  // Nutrition
  @Column({ type: 'int', nullable: true })
  calories: number;

  @Column({ type: 'float', nullable: true })
  protein: number;

  @Column({ type: 'float', nullable: true })
  carbs: number;

  @Column({ type: 'float', nullable: true })
  fat: number;

  @Column({ type: 'float', nullable: true })
  water: number;

  @Column({ type: 'float', nullable: true })
  fiber: number;

  @Column({ type: 'float', nullable: true })
  vitamins: number;

  // Movement
  @Column({ type: 'float', nullable: true })
  running_distance: number;

  @Column({ type: 'jsonb', nullable: true })
  activities: { name: string; calories: number; duration: number }[];
}
