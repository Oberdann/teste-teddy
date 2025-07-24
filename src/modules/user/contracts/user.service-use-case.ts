import { CreateUserDto } from '../dto/user.user-create';

export interface IUserService {
  getAllUsers(): Promise<CreateUserDto[]>;
  createUser(dto: CreateUserDto): Promise<CreateUserDto>;
}
