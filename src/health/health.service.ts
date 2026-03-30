import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Health } from './entities/health.entity';

@Injectable()
export class HealthService {
  constructor(
    @InjectRepository(Health)
    private healthRepository: Repository<Health>,
  ) {}

  async findByDate(date: string): Promise<Health | null> {
    return this.healthRepository.findOne({ where: { date } });
  }

  async upsert(dto: Partial<Health>): Promise<Health> {
    const { date, ...data } = dto;
    if (!date) throw new Error('Date is required');

    let health = await this.findByDate(date);

    if (health) {
      // Cập nhật các trường được gửi lên
      Object.assign(health, data);
    } else {
      health = this.healthRepository.create(dto);
    }

    return this.healthRepository.save(health);
  }

  async findAll(): Promise<Health[]> {
    return this.healthRepository.find({ order: { date: 'ASC' } });
  }
}
