// user.entity.ts
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class User {
  /**
   * The user's ID
   * @example 192823
   */

  @PrimaryGeneratedColumn()
  @ApiProperty({ example: 192823, description: 'The user ID' })
  id: number;

  @Column()
  @ApiProperty({ example: 'John', description: 'The user first name' })
  firstName: string;

  @Column()
  @ApiProperty({ example: 'Doe', description: 'The user last name' })
  lastName: string;

  @Column()
  @ApiProperty({ example: 'Developer', description: 'The user position' })
  position: string;

  @Column()
  @ApiProperty({ example: 1234567890, description: 'The user phone number' })
  phone: number;

  @Column()
  @ApiProperty({ example: 'fadil@mail.com', description: 'The user email' })
  email: string;
}
