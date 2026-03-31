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

  async findByDate(userId: string, date: string): Promise<Health | null> {
    if (!userId) return null;
    return this.healthRepository.findOne({ where: { userId, date } });
  }

  async findAll(userId: string): Promise<Health[]> {
    if (!userId) return [];
    return this.healthRepository.find({ where: { userId }, order: { date: 'ASC' } });
  }

  async upsert(userId: string, dto: Partial<Health>): Promise<Health> {
    if (!userId) throw new Error('Không xác định được danh tính người dùng. Vui lòng đăng nhập lại!');
    const { date, ...data } = dto;
    if (!date) throw new Error('Date is required');

    let health = await this.findByDate(userId, date);

    if (health) {
      // Cập nhật các trường được gửi lên
      Object.assign(health, data);
    } else {
      health = this.healthRepository.create({ ...dto, userId });
    }

    return this.healthRepository.save(health);
  }
}
