import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

@Entity('photos')
export class Photo {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid', nullable: true })
  userId: string;

  @Column({ type: 'text' })
  url: string; // URL từ Supabase Storage

  @Column({ type: 'varchar', length: 10 })
  date: string; // yyyy-MM-dd

  @Column({ type: 'varchar', length: 5 })
  time: string; // HH:mm

  @Column({ type: 'text', nullable: true })
  note: string;

  @Column({ type: 'float', nullable: true })
  weight: number;

  @CreateDateColumn()
  createdAt: Date;
}
