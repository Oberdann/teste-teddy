import { Test, TestingModule } from '@nestjs/testing';
import { ILoginService } from 'src/modules/login/contracts/user.service-use-case';
import { LoginDto } from 'src/modules/login/dto/login.interface';
import { LoginController } from 'src/modules/login/login.controller';

describe('LoginController', () => {
  let loginController: LoginController;
  let loginService: ILoginService;

  const mockLoginService = {
    login: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LoginController],
      providers: [
        {
          provide: 'ILoginService',
          useValue: mockLoginService,
        },
      ],
    }).compile();

    loginController = module.get<LoginController>(LoginController);
    loginService = module.get<ILoginService>('ILoginService');

    jest.clearAllMocks();
  });

  describe('login', () => {
    it('should call loginService.login and return token with success message', async () => {
      const loginDto: LoginDto = {
        email: 'user@example.com',
        password: 'password123',
      };

      const token = 'jwt-token-mock';

      mockLoginService.login.mockResolvedValue(token);

      const result = await loginController.login(loginDto);

      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(loginService.login).toHaveBeenCalledWith(loginDto);
      expect(result).toEqual({
        message: 'Login realizado com sucesso',
        acess_token: token,
      });
    });
  });
});
