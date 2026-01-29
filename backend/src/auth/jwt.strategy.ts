import { Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private usersService: UsersService) {
    super({
      jwtFromRequest: (req) => {
        const auth = req.headers.authorization;
        if (!auth) {
          return null;
        }
        return auth.split(' ')[1];
      },
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET,
    });
  }

  async validate(payload: any) {
    const user = await this.usersService.findById(payload.id);
    if (!user || !user.isActive) {
      return null;
    }
    return {
      id: user.id,
      email: user.email,
      role: user.role,
    };
  }
}
