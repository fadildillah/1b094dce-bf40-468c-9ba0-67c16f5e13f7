import { Injectable } from '@nestjs/common';

@Injectable()
export class UserService {
  private users = [];

  generateRandomId(): number {
    // You can use any logic to generate a unique ID, such as timestamp + random number
    // Here, we'll use a simple approach of generating a random number between 1 and 100000
    return Math.floor(Math.random() * 100000) + 1;
  }

  // Create a new user with id, firstName, lastName, position, phone and email
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

  // Retrieve all users
  getAllUsers() {
    return this.users;
  }

  // Retrieve a single user with the given id
  getUserById(id: number) {
    return this.users.find((user) => user.id === id);
  }

  // Update a user with the given id
  updateUserById(id: number, user: any) {
    const index = this.users.findIndex((user) => user.id === id);
    this.users[index] = { id, ...user };
    return this.users[index];
  }

  // Delete a user with the given id
  deleteUserById(id: number) {
    console.log(`Deleting user with ID: ${id}`);
    this.users = this.users.filter((user) => user.id !== id);
    return this.users;
  }
}
