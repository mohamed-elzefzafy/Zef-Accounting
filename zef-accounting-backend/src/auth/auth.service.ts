import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { UserEntity } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';
import { RegisterDto } from './dtos/register.dto';
import { defaultProfileImage } from 'src/common/constants';
import * as bcrypt from 'bcryptjs';
import { LoginDto } from './dtos/login.dto';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Response } from 'express';
import { JwtPayloadType } from 'src/common/types';
import { ResetPasswordDto } from './dtos/reset-password.dto';
import { MailerService } from '@nestjs-modules/mailer';
import { VerificationCodeDto } from './dtos/verification-code.dto';
import { VerificationAccountDto } from './dtos/verification-account.dto';
import { UpdateUserDto } from './dtos/update-user.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepositry: Repository<UserEntity>,
    private readonly cloudinaryService: CloudinaryService,
    private readonly jwtService: JwtService,
    private readonly config: ConfigService,
    private readonly mailerService: MailerService,
  ) {}

  public async register(registerDto: RegisterDto, file: Express.Multer.File) {
    const existUser = await this.userRepositry.findOneBy({
      email: registerDto.email,
    });
    if (existUser) {
      throw new BadRequestException('User with this email already exists');
    }
    let profileImage = {
      url: defaultProfileImage,
      public_id: null,
    };
    // If the user uploaded a file, upload it to Cloudinary
    if (file) {
      const result = await this.cloudinaryService.uploadImage(file, 'users');
      profileImage = {
        url: result.secure_url,
        public_id: result.public_id,
      };
    }

    registerDto.password = await bcrypt.hash(registerDto.password, 10);
    // Create the user and store the profileImage data
    const user = this.userRepositry.create({
      ...registerDto,
      profileImage, // Save the profileImage (either from Cloudinary or the default)
    });

    // Save the user to the database
    return await this.userRepositry.save(user);
  }

  public async login(loginDto: LoginDto, res: Response) {
    const user = await this.userRepositry.findOneBy({ email: loginDto.email });
    if (!user) {
      throw new NotFoundException('Invalid email or password');
    }
    const isPasswordValid = await bcrypt.compare(
      loginDto.password,
      user.password,
    );
    if (!isPasswordValid) {
      throw new NotFoundException('Invalid email or password');
    }
    const payLoad: JwtPayloadType = {
      id: user.id,
      email: user.email,
      role: user.role,
      isAccountVerified: user.isAccountVerified,
    };
    const token = await this.jwtService.signAsync(payLoad, {
      secret: this.config.get<string>('JWT_SECRET_KEY'),
      // noTimestamp: true,
    });

    res.cookie('token', token, {
      httpOnly: true,
      secure: this.config.get<string>('NODE_ENV') === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });
    return { user, token };
  }
  public async resetPassword(resetPasswordDto: ResetPasswordDto) {
    const user = await this.userRepositry.findOneBy({
      email: resetPasswordDto.email,
    });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const code = Math.floor(Math.random() * 1000000).toString();
    const htmlMessage = `
    <div>
       <h1>Forgot your password? If you didn't forget your password, please ignore this email!</h1>
       <p>Use the following code to verify your account: <h3 style="color: red; font-weight: bold; text-align: center">${code}</h3></p>
       <h3 style="font-weight: bold">Zefzafy-Blog</h3>
     </div>`;

    this.mailerService.sendMail({
      from: `Zefzafy-Blog <${this.config.get<string>('EMAIL_USERNAME')}>`,
      to: resetPasswordDto.email,
      subject: 'Reset Password',
      html: htmlMessage,
    });

    user.verificationCode = code;
    await this.userRepositry.save(user);

    return { message: 'reset code has been sent to your email' };
  }

  public async validateVerificationCode(
    verificationCodeDto: VerificationCodeDto,
  ) {
    const user = await this.userRepositry.findOne({
      where: {
        email: verificationCodeDto.email,
        verificationCode: verificationCodeDto.verificationCode,
      },
    });

    if (!user) {
      throw new NotFoundException('Invalid verification code');
    }

    const password = await bcrypt.hash(verificationCodeDto.newPassword, 10);
    user.verificationCode = null;
    user.password = password;
    await this.userRepositry.save(user);
    return { user };
  }

  public async sendVerificationCode(user: JwtPayloadType) {
    const exisUser = await this.userRepositry.findOneBy({ email: user.email });
    const code = Math.floor(Math.random() * 1000000).toString();
    const htmlMessage = `
    <div>
       <h1>verify your account</h1>
       <p>Use the following code to verify your account: <h3 style="color: red; font-weight: bold; text-align: center">${code}</h3></p>
       <h3 style="font-weight: bold">Zefzafy-Blog</h3>
     </div>`;

    this.mailerService.sendMail({
      from: `Zefzafy-Blog <${this.config.get<string>('EMAIL_USERNAME')}>`,
      to: user.email,
      subject: 'Verify Account',
      html: htmlMessage,
    });
if (!exisUser){
  throw new NotFoundException("user not found")
}
    exisUser.verificationCode = code;
    await this.userRepositry.save(exisUser);
    return { message: 'Verification Code sent to your email' };
  }

  public async verifyAccount(
    verificationAccountDto: VerificationAccountDto,
    user: JwtPayloadType,
    res: Response,
  ) {
    const exisUser = await this.userRepositry.findOne({
      where: {
        email: verificationAccountDto.email,
        verificationCode: verificationAccountDto.verificationCode,
      },
    });

    if (!exisUser) {
      throw new NotFoundException('Invalid verification code');
    }

    exisUser.isAccountVerified = true;
    user.isAccountVerified = true;
    exisUser.verificationCode = null;
    await this.userRepositry.save(exisUser);

    const payLoad: JwtPayloadType = {
      id: user.id,
      email: user.email,
      role: user.role,
      isAccountVerified: user.isAccountVerified,
    };
    const token = await this.jwtService.signAsync(payLoad, {
      secret: this.config.get<string>('JWT_SECRET_KEY'),
    });

    res.cookie('token', token, {
      httpOnly: true,
      secure: this.config.get<string>('NODE_ENV') === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });
    return { message: 'Account verified successfully', user: exisUser };
  }

  public async getCurrentUser(user: JwtPayloadType) {
    const currentUser = await this.userRepositry.findOne({
      where: { id: user.id },
    });
    if (!currentUser) {
      throw new NotFoundException('User not found');
    }
    return currentUser;
  }

  public async updateCurrentUser(
    updateUserDto: UpdateUserDto,
    user: JwtPayloadType,
    file: Express.Multer.File,
  ) {
    const currentUser = await this.userRepositry.findOneBy({ id: user.id });
    if (!currentUser) throw new NotFoundException('user not found');
    updateUserDto.email = user.email;
    if (updateUserDto.password) {
      updateUserDto.password = await bcrypt.hash(updateUserDto.password, 10);
    }
    Object.assign(currentUser, updateUserDto);
    if (file) {
      if (currentUser.profileImage.public_id !== null) {
        await this.cloudinaryService.removeImage(
          currentUser.profileImage.public_id,
        );
      }

      const result = await this.cloudinaryService.uploadImage(file, 'users');
      currentUser.profileImage = {
        url: result.secure_url,
        public_id: result.public_id,
      };
    }
    await this.userRepositry.save(currentUser);
    return currentUser;
  }

  public async remove(id: number) {
    const user = await this.userRepositry.findOneBy({ id });
    if (!user) {
      throw new NotFoundException(`User with id (${id}) not found`);
    }

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

  public async logout(res: Response) {
    res.cookie('token', '', {
      httpOnly: true,
      expires: new Date(0),
    });
    return { message: 'logged out successfully' };
  }
}
