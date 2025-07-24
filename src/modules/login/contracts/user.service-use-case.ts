import { LoginDto } from '../dto/login.interface';

export interface ILoginService {
  login(login: LoginDto): Promise<string>;
}
