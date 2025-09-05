import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { RegisterDto } from './dtos/register.dto';
import { LoginDto } from './dtos/login.dto';
import { Response } from 'express';
import { ResetPasswordDto } from './dtos/reset-password.dto';
import { VerificationCodeDto } from './dtos/verification-code.dto';
import { CurrentUser } from './decorator/current-user.decorator';
import { Roles } from './decorator/Roles.decorator';
import { AuthGuard } from './guards/auth.guard';
import { VerificationAccountDto } from './dtos/verification-account.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import { UserRoles } from 'src/shared/enums/roles.enum';
import { JwtPayloadType } from 'src/shared/types';
import { UpdateUserAddressDto } from './dtos/update-user-address.dto';

@Controller('api/v1/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @UseInterceptors(FileInterceptor('profileImage'))
  register(
    @Body() registerDto: RegisterDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.authService.register(registerDto, file);
  }

  @Post('login')
  login(@Body() loginDto: LoginDto, @Res({ passthrough: true }) res: Response) {
    return this.authService.login(loginDto, res);
  }

    @Patch('update-user-address')
      @Roles([UserRoles.ADMIN, UserRoles.USER])
  @UseGuards(AuthGuard)
  updateUserAddress(@Body() updateUserAddressDto: UpdateUserAddressDto,@CurrentUser() user: JwtPayloadType,) {
    const userId = user.id;
    return this.authService.updateUserAddress(updateUserAddressDto, userId);
  }

  @Post('reset-password')
  public async resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
    return this.authService.resetPassword(resetPasswordDto);
  }

  @Post('validateVerificationCode')
  public async validateVerificationCode(
    @Body() verificationCodeDto: VerificationCodeDto,
  ) {
    return this.authService.validateVerificationCode(verificationCodeDto);
  }

  @Post('send-verification-code')
  @Roles([UserRoles.ADMIN, UserRoles.USER])
  @UseGuards(AuthGuard)
  public async sendVerificationCode(@CurrentUser() user: JwtPayloadType) {
    return this.authService.sendVerificationCode(user);
  }

  @Post('verify-account')
  @Roles([UserRoles.ADMIN, UserRoles.USER])
  @UseGuards(AuthGuard)
  public async verifyAccount(
    @Body() verificationAccountDto: VerificationAccountDto,
    @CurrentUser() user: JwtPayloadType,
    @Res({ passthrough: true }) res: Response,
  ) {
    return this.authService.verifyAccount(verificationAccountDto, user, res);
  }

  @Get('current-user')
  @Roles([UserRoles.ADMIN, UserRoles.USER])
  @UseGuards(AuthGuard)
  public async getCurrentUser(@CurrentUser() user: JwtPayloadType) {
    return this.authService.getCurrentUser(user);
  }

  @Patch()
  @Roles([UserRoles.USER, UserRoles.ADMIN])
  @UseGuards(AuthGuard)
  @UseInterceptors(FileInterceptor('profileImage'))
  public async updateCurrentUser(
    @Body() updateUserDto: UpdateUserDto,
    @CurrentUser() user: JwtPayloadType,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.authService.updateCurrentUser(updateUserDto, user, file);
  }

  @Delete('delete-current-user')
  @Roles([UserRoles.ADMIN, UserRoles.USER])
  @UseGuards(AuthGuard)
  remove(@CurrentUser() user: JwtPayloadType) {
    return this.authService.remove(user.id);
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  public async logout(@Res({ passthrough: true }) res: Response) {
    return this.authService.logout(res);
  }
}
