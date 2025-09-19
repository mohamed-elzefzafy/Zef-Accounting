import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UploadedFile,
  ParseIntPipe,
  UseGuards,
  Query,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from '../auth/dtos/update-user.dto';
import { Roles } from 'src/auth/decorator/Roles.decorator';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { UserRoles } from 'src/common/enums/roles.enum';
import { PAGE_LIMIT } from 'src/common/constants';

@Controller('api/v1/users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @Roles([UserRoles.ADMIN])
  @UseGuards(AuthGuard)
  findAll(
    @Query('page') page: string = '1',
    @Query('limit') limit: string = `${PAGE_LIMIT}`,
  ) {
    return this.usersService.findAll(+page, +limit);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.findOne(id);
  }

  
  @Delete(':id')
    @Roles([UserRoles.ADMIN])
  @UseGuards(AuthGuard)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.remove(id);
  }

  // @Get('getUsersCount')
  // @Roles([UserRoles.ADMIN])
  // getPostsCount() {
  //   return this.usersService.getUsersCount();
  // }
}
