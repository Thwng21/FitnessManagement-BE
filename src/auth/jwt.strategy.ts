import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET') || 'your-secret-key', // Nên dùng .env
    });
  }

  async validate(payload: any) {
    const userId = payload.sub || payload.id || payload.userId;
    if (!userId) {
      throw new UnauthorizedException('Phiên đăng nhập đã cũ hoặc lỗi. Vui lòng đăng xuất và đăng nhập lại!');
    }
    return { id: userId, email: payload.email };
  }
}
