import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { AuthPayload } from './auth.dto';

export interface TokenResponse {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string) {
    const user = await this.usersService.findByEmail(email);
    
    if (!user) {
      return null;
    }

    const passwordValid = await this.usersService.validatePassword(user, password);
    
    if (!passwordValid) {
      return null;
    }

    return user;
  }

  generateTokens(user: AuthPayload): TokenResponse {
    const accessToken = this.jwtService.sign(user, {
      secret: process.env.JWT_SECRET,
      expiresIn: process.env.JWT_EXPIRE || '15m',
    });

    const refreshToken = this.jwtService.sign(user, {
      secret: process.env.JWT_REFRESH_SECRET,
      expiresIn: process.env.JWT_REFRESH_EXPIRE || '7d',
    });

    return {
      accessToken,
      refreshToken,
      expiresIn: 15 * 60, // 15 minutes in seconds
    };
  }

  async refreshAccessToken(refreshToken: string): Promise<TokenResponse> {
    try {
      const payload = this.jwtService.verify(refreshToken, {
        secret: process.env.JWT_REFRESH_SECRET,
      });

      const user = await this.usersService.findById(payload.id);
      if (!user) {
        throw new Error('User not found');
      }

      return this.generateTokens({
        id: user.id,
        email: user.email,
        role: user.role,
      });
    } catch (error) {
      throw new Error('Invalid refresh token');
    }
  }
}
