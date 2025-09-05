import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { RegisterDto } from './dtos/register.dto';
import * as bcrypt from 'bcryptjs';
import { LoginDto } from './dtos/login.dto';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Response } from 'express';
import { ResetPasswordDto } from './dtos/reset-password.dto';
import { MailerService } from '@nestjs-modules/mailer';
import { VerificationCodeDto } from './dtos/verification-code.dto';
import { VerificationAccountDto } from './dtos/verification-account.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { defaultProfileImage } from 'src/shared/constants';
import { JwtPayloadType } from 'src/shared/types';
import { UpdateUserAddressDto } from './dtos/update-user-address.dto';
import { User } from 'src/user/entities/user.schema';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
    private readonly cloudinaryService: CloudinaryService,
    private readonly jwtService: JwtService,
    private readonly config: ConfigService,
    private readonly mailerService: MailerService,
  ) {}

  public async register(registerDto: RegisterDto, file: Express.Multer.File) {
    const existUser = await this.userModel.findOne({
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
    const user = this.userModel.create({
      ...registerDto,
      profileImage, // Save the profileImage (either from Cloudinary or the default)
    });

    // Save the user to the database
    return user;
  }

  public async login(loginDto: LoginDto, res: Response) {
    const user = await this.userModel.findOne({ email: loginDto.email });
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
      id: user._id.toString(),
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

  async updateUserAddress(
    updateUserAddressDto: UpdateUserAddressDto,
    userId: string,
  ) {
    const user = await this.userModel.findById(userId);

    if (!user) {
      throw new NotFoundException('User not found');
    }
    Object.assign(user, updateUserAddressDto);

    await user.save();
    return user;
  }
  public async resetPassword(resetPasswordDto: ResetPasswordDto) {
    const user = await this.userModel.findOne({
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
       <h3 style="font-weight: bold">Zef-Market</h3>
     </div>`;

    this.mailerService.sendMail({
      from: `Zef-Market <${this.config.get<string>('EMAIL_USERNAME')}>`,
      to: resetPasswordDto.email,
      subject: 'Reset Password',
      html: htmlMessage,
    });

    user.verificationCode = code;
    await user.save();

    return { message: 'reset code has been sent to your email' };
  }

  public async validateVerificationCode(
    verificationCodeDto: VerificationCodeDto,
  ) {
    const user = await this.userModel.findOne({
      email: verificationCodeDto.email,
      verificationCode: verificationCodeDto.verificationCode,
    });

    if (!user) {
      throw new NotFoundException('Invalid verification code');
    }

    const password = await bcrypt.hash(verificationCodeDto.newPassword, 10);
    user.verificationCode = null;
    user.password = password;
    await user.save();
    return { user };
  }

  public async sendVerificationCode(user: JwtPayloadType) {
    const exisUser = await this.userModel.findOne({ email: user.email });
    const code = Math.floor(Math.random() * 1000000).toString();
    const htmlMessage = `
    <div>
       <h1>verify your account</h1>
       <p>Use the following code to verify your account: <h3 style="color: red; font-weight: bold; text-align: center">${code}</h3></p>
       <h3 style="font-weight: bold">Zef-Market</h3>
     </div>`;

    this.mailerService.sendMail({
      from: `Zef-Market <${this.config.get<string>('EMAIL_USERNAME')}>`,
      to: user.email,
      subject: 'Verify Account',
      html: htmlMessage,
    });

    if (exisUser) {
      exisUser.verificationCode = code;
      await exisUser.save();
    }
    return { message: 'Verification Code sent to your email' };
  }

  public async verifyAccount(
    verificationAccountDto: VerificationAccountDto,
    user: JwtPayloadType,
    res: Response,
  ) {
    const exisUser = await this.userModel.findOne({
      email: verificationAccountDto.email,
      verificationCode: verificationAccountDto.verificationCode,
    });

    if (!exisUser) {
      throw new NotFoundException('Invalid verification code');
    }

    exisUser.isAccountVerified = true;
    user.isAccountVerified = true;
    exisUser.verificationCode = null;
    await exisUser.save();

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
    const currentUser = await this.userModel
      .findOne({ _id: user.id })
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
    const currentUser = await this.userModel.findById(user.id);
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
    await currentUser.save();
    return currentUser;
  }

  public async remove(id: string) {
    const user = await this.userModel.findById(id);
    if (!user) {
      throw new NotFoundException(`User with id (${id}) not found`);
    }

    if (user.profileImage.public_id !== null) {
      await this.cloudinaryService.removeImage(user.profileImage.public_id);
    }

    await this.userModel.findByIdAndDelete(user.id);
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
