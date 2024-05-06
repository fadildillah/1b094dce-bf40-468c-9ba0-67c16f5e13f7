import { Injectable } from '@nestjs/common';
import { HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import * as Joi from 'joi';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  generateRandomId(): number {
    return Math.floor(Math.random() * 1000000) + 1;
  }

  createUserSchema = Joi.object({
    firstName: Joi.string().min(3).max(50).required(),
    lastName: Joi.string().min(3).max(50).required(),
    position: Joi.string().allow(''), // Allow empty position
    phone: Joi.number().required(),
    email: Joi.string().email().required(),
  });

  async createUser(createUserDto: {
    firstName: string;
    lastName: string;
    position: string;
    phone: number;
    email: string;
  }): Promise<User> {
    const userValidationSchema = Joi.object({
      firstName: Joi.string().min(3).max(50).required(),
      lastName: Joi.string().min(3).max(50).required(),
      position: Joi.string().allow(''), // Allow empty position
      phone: Joi.number().required(),
      email: Joi.string().email().required(),
    });

    const { error } = userValidationSchema.validate(createUserDto, {
      abortEarly: false,
      stripUnknown: true,
    });

    // check if email & phone already exists
    const phoneExists = await this.userRepository.findOne({
      where: { phone: createUserDto.phone },
    });
    const emailExists = await this.userRepository.findOne({
      where: { email: createUserDto.email },
    });

    if (phoneExists) {
      throw new HttpException(
        {
          statusCode: HttpStatus.CONFLICT,
          message: 'Phone number already exists',
        },
        HttpStatus.CONFLICT,
      );
    }

    if (emailExists) {
      throw new HttpException(
        {
          statusCode: HttpStatus.CONFLICT,
          message: 'Email already exists',
        },
        HttpStatus.CONFLICT,
      );
    }

    if (error) {
      const validationErrors = error.details.map((err) => ({
        field: err.context?.key,
        message: err.message,
      }));
      throw new HttpException(
        {
          statusCode: HttpStatus.BAD_REQUEST,
          message: 'Validation failed',
          errors: validationErrors,
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    const newUser = this.userRepository.create({
      id: this.generateRandomId(),
      ...createUserDto,
    });

    await this.userRepository.save(newUser);

    return newUser;
  }

  async getAllUsers(): Promise<User[]> {
    const users = await this.userRepository.find();
    if (!users) {
      throw new HttpException(
        {
          statusCode: HttpStatus.NOT_FOUND,
          message: 'No users found',
        },
        HttpStatus.NOT_FOUND,
      );
    }

    return users;
  }

  async getUserById(id: number): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new HttpException(
        {
          statusCode: HttpStatus.NOT_FOUND,
          message: `User with ID ${id} not found`,
        },
        HttpStatus.NOT_FOUND,
      );
    }

    return user;
  }

  async updateUserById(
    id: number,
    updateUserDto: {
      firstName: string;
      lastName: string;
      position: string;
      phone: number;
      email: string;
    },
  ): Promise<{ status: string; message: string; user: User }> {
    const user = await this.userRepository.findOne({ where: { id } });

    if (!user) {
      throw new HttpException(
        {
          statusCode: HttpStatus.NOT_FOUND,
          message: `User with ID ${id} not found`,
        },
        HttpStatus.NOT_FOUND,
      );
    }

    const updatedUser = { id, ...updateUserDto };
    // Update the user object in the repository
    await this.userRepository.update(id, updatedUser);

    return {
      status: 'success',
      message: `User with ID ${id} updated successfully`,
      user: updatedUser,
    };
  }

  async deleteUserById(
    id: number,
  ): Promise<{ status: string; message: string }> {
    const user = await this.userRepository.findOne({ where: { id } });

    if (!user) {
      throw new HttpException(
        {
          statusCode: HttpStatus.NOT_FOUND,
          message: `User with ID ${id} not found`,
        },
        HttpStatus.NOT_FOUND,
      );
    }

    // Delete the user object in the repository
    await this.userRepository.delete(id);

    return {
      status: 'success',
      message: `User with ID ${id} deleted successfully`,
    };
  }
}
