import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
  ForbiddenException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { Roles } from '../decorator/Roles.decorator';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly config: ConfigService,
    private readonly jwtService: JwtService,
    private readonly reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const token = this.extractTokenFromCookie(request);
    const roles = this.reflector.get<string[]>(Roles, context.getHandler());

    // If no roles are defined, allow access
    if (!roles) return true;

    if (!token) {
      throw new UnauthorizedException('Authentication token not found');
    }

    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: this.config.get<string>('JWT_SECRET_KEY'),
      });

      // Check if the user's role is authorized to access this route
      if (!payload.role || !roles.includes(payload.role)) {
        throw new ForbiddenException("you can't access this route"); // Throw a specific exception for role mismatch
      }

      // Attach user info to the request object for further use
      request['user'] = payload;

      // Check if the route is the send-verification-code route
      const isSendVerificationCodeRoute =
        request.url.includes('send-verification-code') ||
        request.url.includes('verify-account');

      // If it's not the send-verification-code route, check if the account is verified
      if (!isSendVerificationCodeRoute && !payload.isAccountVerified) {
        throw new ForbiddenException(
          'Your account is not verified. Please verify your account.',
        );
      }
    } catch (error) {
      if (error instanceof ForbiddenException) {
        throw error; // If role mismatch, rethrow ForbiddenException
      }
      throw new UnauthorizedException('Invalid token'); // Handle other token-related errors
    }

    return true;
  }

  private extractTokenFromCookie(request: Request): string | undefined {
    return request.cookies?.token;
  }
}
