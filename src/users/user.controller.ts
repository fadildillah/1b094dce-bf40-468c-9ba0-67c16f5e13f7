import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
} from '@nestjs/common';
import { UserService } from './user.service';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  createUser(
    @Body('firstName') firstName: string,
    @Body('lastName') lastName: string,
    @Body('position') position: string,
    @Body('phone') phone: string,
    @Body('email') email: string,
  ) {
    return this.userService.createUser(
      firstName,
      lastName,
      position,
      phone,
      email,
    );
  }

  @Get()
  getAllUsers() {
    return this.userService.getAllUsers();
  }

  @Get(':id')
  getUserById(@Param('id') id: number) {
    if (isNaN(id)) {
      return 'Invalid ID';
    }
    return this.userService.getUserById(id);
  }

  @Put(':id')
  updateUserById(@Param('id') id: number, @Body() user: any) {
    if (isNaN(id)) {
      return 'Invalid ID';
    } else {
      return this.userService.updateUserById(id, user);
    }
  }

  @Delete(':id')
  deleteUserById(@Param('id') id: number) {
    if (isNaN(id)) {
      return 'Invalid ID';
    } else {
      return this.userService.deleteUserById(id);
    }
  }
}

// Path: src/users/user.service.ts
