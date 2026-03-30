import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.usersService.findByEmail(email);
    if (user && await bcrypt.compare(pass, user.password)) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: any) {
    const payload = { email: user.email, sub: user.id };
    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
      },
    };
  }

  async register(userData: any) {
    const user = await this.usersService.create(userData);
    return this.login(user);
  }

  async changePassword(userId: string, changePasswordDto: any) {
    const user = await this.usersService.findById(userId);
    if (!user) {
      throw new UnauthorizedException('Không tìm thấy người dùng');
    }

    const isMatch = await bcrypt.compare(changePasswordDto.oldPassword, user.password);
    if (!isMatch) {
      throw new BadRequestException('Mật khẩu cũ không đúng');
    }

    await this.usersService.updatePassword(userId, changePasswordDto.newPassword);
    return { message: 'Đổi mật khẩu thành công' };
  }
}
