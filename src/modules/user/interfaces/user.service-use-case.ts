import { User } from '../dto/user.interface';
import { CreateUserDto } from '../dto/user.user-create';

export interface IUserService {
  getAllUsers(): Promise<User[]>;
  createUser(dto: CreateUserDto): Promise<User>;
}
