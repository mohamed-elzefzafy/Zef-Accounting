import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UpdateUserDto } from '../auth/dtos/update-user.dto';
import { Repository } from 'typeorm';
import { UserEntity } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { RegisterDto } from '../auth/dtos/register.dto';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepositry: Repository<UserEntity>,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  // public async findAll() {
  //   return this.userRepositry.find();
  // }

  public async findAll(page: number, limit: number) {
    // Ensure page and limit are positive
    const pageNumber = Math.max(1, page);
    const limitNumber = Math.max(1, limit);

    // Calculate skip (offset) for pagination
    const skip = (pageNumber - 1) * limitNumber;

    // Fetch paginated users and total count
    const [users, total] = await this.userRepositry.findAndCount({
      skip,
      take: limitNumber,
      order :{role : "ASC" , createdAt : "ASC"},
    });

    // Calculate total pages
    const pagesCount = Math.ceil(total / limitNumber);

    // Return response in desired format
    return {
      users,
      pagination: {
        total,
        page: pageNumber,
        limit: limitNumber,
        pagesCount,
      },
    };
  }

  public async findOne(id: number) {
    const user = await this.userRepositry.findOneBy({ id });
    if (!user) {
      throw new NotFoundException(`User with id (${id}) not found`);
    }
    return user;
  }

  public async remove(id: number) {
    const user = await this.findOne(id);
    if (user.profileImage.public_id !== null) {
      await this.cloudinaryService.removeImage(user.profileImage.public_id);
    }



    let publicIds = [];

  if (publicIds.length > 0) {
      await this.cloudinaryService.removeMultipleImages(publicIds);
  }
    await this.userRepositry.remove(user);
    return { message: `User with id (${id}) was removed` };
  }

  async getUsersCount() {
    return this.userRepositry.count();
  }
}
