import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UpdateUserDto } from '../auth/dtos/update-user.dto';
import { RegisterDto } from '../auth/dtos/register.dto';
import { User } from './entities/user.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<User>,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  async createUser(createUserDto: CreateUserDto) { // Calculate skip (offset) for pagination
    let user = await this.userModel.findOne({ email: createUserDto.email });
    if (user) {
      throw new BadRequestException('Email already exists');
    }

    createUserDto.password = await bcrypt.hash(createUserDto.password, 10);
    user = new this.userModel(createUserDto);
    return user.save();
  }

  // public async findAll() {
  //   return this.userRepositry.find();
  // }

  // public async findAll(page: number, limit: number) {
  //   // Ensure page and limit are positive
  //   const pageNumber = Math.max(1, page);
  //   const limitNumber = Math.max(1, limit);

  //   // Calculate skip (offset) for pagination
  //   const skip = (pageNumber - 1) * limitNumber;

  //   // Fetch paginated users and total count
  //   const [users, total] = await this.userRepositry.findAndCount({
  //     skip,
  //     take: limitNumber,
  //     order :{role : "ASC" , createdAt : "ASC"},
  //   });

  //   // Calculate total pages
  //   const pagesCount = Math.ceil(total / limitNumber);

  //   // Return response in desired format
  //   return {
  //     users,
  //     pagination: {
  //       total,
  //       page: pageNumber,
  //       limit: limitNumber,
  //       pagesCount,
  //     },
  //   };
  // }

  public async findAll(page: number, limit: number) {
    // Ensure page and limit are positive integers
    const pageNumber = Math.max(1, page);
    const limitNumber = Math.max(1, limit);

    // Calculate skip (offset) for pagination
    const skip = (pageNumber - 1) * limitNumber;

    // Fetch users and total count using Mongoose
    const users = await this.userModel
      .find()
      .sort({ role: 1, createdAt: 1 }) // ASC sorting
      .skip(skip)
      .limit(limitNumber)
      // .populate("users")
      .exec();

    const total = await this.userModel.countDocuments().exec();

    // Calculate total pages
    const pagesCount = Math.ceil(total / limitNumber);

    // Return paginated result
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

  public async findOne(id: string) {
    const user = await this.userModel.findById(id).populate('wishlist');
    if (!user) {
      throw new NotFoundException(`User with id (${id}) not found`);
    }
    return user;
  }

  public async remove(id: string) {
    const user = await this.findOne(id);
    if (user.profileImage.public_id !== null) {
      await this.cloudinaryService.removeImage(user.profileImage.public_id);
    }

    await user.deleteOne();
    return { message: `User with id (${id}) was removed` };
  }

  async getUsersCount() {
    return this.userModel.countDocuments().exec();
  }
}
