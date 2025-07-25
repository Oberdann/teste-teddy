import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from 'src/database/prisma.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { HttpStatus } from '@nestjs/common';
import { LoginService } from 'src/modules/login/login.service';

describe('LoginService', () => {
  let service: LoginService;
  let prisma: PrismaService;
  let jwtService: JwtService;
  let bcryptCompareSpy: jest.SpyInstance;

  const mockPrisma = {
    users: {
      findFirst: jest.fn(),
    },
  };

  const mockJwtService = {
    sign: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LoginService,
        { provide: PrismaService, useValue: mockPrisma },
        { provide: JwtService, useValue: mockJwtService },
      ],
    }).compile();

    service = module.get<LoginService>(LoginService);
    prisma = module.get<PrismaService>(PrismaService);
    jwtService = module.get<JwtService>(JwtService);

    bcryptCompareSpy = jest.spyOn(bcrypt, 'compare');

    jest.clearAllMocks();
  });

  afterEach(() => {
    bcryptCompareSpy.mockRestore();
  });

  describe('login', () => {
    const loginDto = {
      email: 'user@example.com',
      password: 'password123',
    };

    it('should return JWT token if user found and password matches', async () => {
      const userFromDb = {
        id: 'user-id-1',
        email: loginDto.email,
        password: 'hashed-password',
      };

      mockPrisma.users.findFirst.mockResolvedValue(userFromDb);
      bcryptCompareSpy.mockResolvedValue(true);
      mockJwtService.sign.mockReturnValue('jwt-token');

      const result = await service.login(loginDto);

      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(prisma.users.findFirst).toHaveBeenCalledWith({
        where: { email: loginDto.email },
      });
      expect(bcryptCompareSpy).toHaveBeenCalledWith(
        loginDto.password,
        userFromDb.password,
      );
      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(jwtService.sign).toHaveBeenCalledWith({
        id: userFromDb.id,
        email: userFromDb.email,
      });
      expect(result).toBe('jwt-token');
    });

    it('should throw LoginUnauthorizedException if user not found', async () => {
      mockPrisma.users.findFirst.mockResolvedValue(null);

      await expect(service.login(loginDto)).rejects.toMatchObject({
        message: 'Usuário não encontrado',
        status: HttpStatus.UNAUTHORIZED,
      });

      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(prisma.users.findFirst).toHaveBeenCalledWith({
        where: { email: loginDto.email },
      });
    });

    it('should throw LoginUnauthorizedException if password does not match', async () => {
      const userFromDb = {
        id: 'user-id-1',
        email: loginDto.email,
        password: 'hashed-password',
      };

      mockPrisma.users.findFirst.mockResolvedValue(userFromDb);
      bcryptCompareSpy.mockResolvedValue(false);

      await expect(service.login(loginDto)).rejects.toMatchObject({
        message: 'Credenciais inválidas',
        status: HttpStatus.UNAUTHORIZED,
      });

      expect(bcryptCompareSpy).toHaveBeenCalledWith(
        loginDto.password,
        userFromDb.password,
      );
    });
  });
});
