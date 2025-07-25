import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from 'src/modules/user/user.service';
import { PrismaService } from 'src/database/prisma.service';
import * as bcrypt from 'bcrypt';

describe('UserService', () => {
  let userService: UserService;
  let prismaService: PrismaService;

  const mockPrisma: Partial<Record<keyof PrismaService, any>> = {
    users: {
      findMany: jest.fn(),
      create: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        { provide: PrismaService, useValue: mockPrisma },
      ],
    }).compile();

    userService = module.get<UserService>(UserService);
    prismaService = module.get<PrismaService>(PrismaService);

    jest.clearAllMocks();
  });

  describe('getAllUsers', () => {
    it('should return all users from database', async () => {
      const usersMock = [
        { id: 1, email: 'user1@email.com', password: 'hashed1' },
        { id: 2, email: 'user2@email.com', password: 'hashed2' },
      ];

      mockPrisma.users.findMany.mockResolvedValue(usersMock);

      const result = await userService.getAllUsers();

      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(prismaService.users.findMany).toHaveBeenCalled();
      expect(result).toEqual(usersMock);
    });
  });

  describe('createUser', () => {
    it('should hash password and create user', async () => {
      const inputDto = {
        email: 'test@email.com',
        password: 'plainpassword',
        name: 'Test User',
      };

      const hashedPassword = 'hashedpassword';

      const expectedUser = {
        id: 1,
        email: inputDto.email,
        name: inputDto.name,
        password: hashedPassword,
      };

      jest.spyOn(bcrypt, 'hash').mockImplementation(
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        (_data: string, _saltOrRounds: number) => hashedPassword,
      );

      mockPrisma.users.create.mockResolvedValue(expectedUser);

      const result = await userService.createUser(inputDto);

      expect(bcrypt.hash).toHaveBeenCalledWith(inputDto.password, 10);
      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(prismaService.users.create).toHaveBeenCalledWith({
        data: {
          ...inputDto,
          password: hashedPassword,
        },
      });
      expect(result).toEqual(expectedUser);
    });
  });
});
