import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { CloudinaryModule } from 'src/cloudinary/cloudinary.module';
import { UserEntity } from 'src/users/entities/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Module({
  controllers: [AuthController],
  providers: [AuthService],
  // imports : [CloudinaryModule],
  imports: [
    TypeOrmModule.forFeature([UserEntity]),
    CloudinaryModule,
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        return {
          global: true,
          secret: config.get<string>('JWT_SECRET_KEY'),
          signOptions: { expiresIn: config.get<string>('JWT_EXPIRE_IN') },
        };
      },
    }),
  ],
})
export class AuthModule {}
