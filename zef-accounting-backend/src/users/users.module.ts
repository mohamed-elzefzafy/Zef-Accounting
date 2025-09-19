import { forwardRef, Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';
import { CloudinaryModule } from 'src/cloudinary/cloudinary.module';
import { JwtModule } from '@nestjs/jwt';

@Module({
  controllers: [UsersController],
  providers: [UsersService],
  imports: [
    TypeOrmModule.forFeature([UserEntity]),
    CloudinaryModule,
    JwtModule,
  ],
  exports: [UsersService],
})
export class UsersModule {}
