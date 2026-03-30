import { Injectable, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  async create(userData: Partial<User>): Promise<User> {
    if (!userData.email) {
      throw new Error('Email is required');
    }
    const existingUser = await this.findByEmail(userData.email);
    if (existingUser) {
      throw new ConflictException('Email đã tồn tại');
    }

    const hashedPassword = await bcrypt.hash(userData.password || '', 10);
    const user = this.usersRepository.create({
      ...userData,
      password: hashedPassword,
    });

    return this.usersRepository.save(user);
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.usersRepository.findOne({ where: { email } });
  }

  async findById(id: string): Promise<User | null> {
    return this.usersRepository.findOne({ where: { id } });
  }

  async updatePassword(id: string, newPassword): Promise<void> {
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await this.usersRepository.update(id, { password: hashedPassword });
  }
}
