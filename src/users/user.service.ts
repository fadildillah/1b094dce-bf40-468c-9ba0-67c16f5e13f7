import { Injectable } from '@nestjs/common';

@Injectable()
export class UserService {
  private users = [];

  generateRandomId(): number {
    return Math.floor(Math.random() * 100000) + 1;
  }

  createUser(
    firstName: string,
    lastName: string,
    position: string,
    phone: string,
    email: string,
  ) {
    const id = this.generateRandomId();
    const newUser = { id, firstName, lastName, position, phone, email };
    this.users.push(newUser);
    return newUser;
  }

  getAllUsers() {
    return this.users;
  }

  getUserById(id: number) {
    return this.users.find((user) => user.id === id);
  }

  updateUserById(id: number, user: any) {
    const index = this.users.findIndex((user) => user.id === id);
    this.users[index] = { id, ...user };
    return this.users[index];
  }

  deleteUserById(id: number) {
    console.log(`Deleting user with ID: ${id}`);
    this.users = this.users.filter((user) => user.id !== id);
    return this.users;
  }
}
