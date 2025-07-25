import { Test, TestingModule } from '@nestjs/testing';
import { IUserService } from 'src/modules/user/contracts/user.service-use-case';
import { CreateUserDto } from 'src/modules/user/dto/user.user-create';
import { UserController } from 'src/modules/user/user.controller';

describe('UserController', () => {
  let userController: UserController;
  let userService: IUserService;

  const mockUserService = {
    getAllUsers: jest.fn(),
    createUser: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        {
          provide: 'IUserService',
          useValue: mockUserService,
        },
      ],
    }).compile();

    userController = module.get<UserController>(UserController);
    userService = module.get<IUserService>('IUserService');

    jest.clearAllMocks();
  });

  describe('getAllUsers', () => {
    it('should return users without password and success message', async () => {
      const usersFromService = [
        { id: 1, email: 'teddy1@domain.com', password: 'hashed1' },
        { id: 2, email: 'teddy2@domain.com', password: 'hashed2' },
      ];
      mockUserService.getAllUsers.mockResolvedValue(usersFromService);

      const result = await userController.getAllUsers();

      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(userService.getAllUsers).toHaveBeenCalled();
      expect(result).toEqual({
        message: 'Usuarios encontrados',
        data: [
          { id: 1, email: 'teddy1@domain.com' },
          { id: 2, email: 'teddy2@domain.com' },
        ],
      });

      expect(result.data[0]).not.toHaveProperty('password');
    });
  });

  describe('createUser', () => {
    it('should create a user and return user without password and success message', async () => {
      const dto: CreateUserDto = {
        email: 'teddy@domain.com',
        password: 'senha123',
        name: 'teddy',
      };

      const createdUser = {
        id: 10,
        email: 'teddy@domain.com',
        password: 'hashedpassword',
        name: 'teddybcrypt',
      };

      mockUserService.createUser.mockResolvedValue(createdUser);

      const result = await userController.createUser(dto);

      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(userService.createUser).toHaveBeenCalledWith(dto);

      expect(result).toEqual({
        message: 'Usuário criaro com sucesso',
        data: {
          id: 10,
          email: 'teddy@domain.com',
          name: 'teddybcrypt',
        },
      });
      expect(result.data).not.toHaveProperty('password');
    });
  });
});
