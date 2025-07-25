import { Injectable, ExecutionContext } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Observable } from 'rxjs';

@Injectable()
export class OptionalJwtGuard extends AuthGuard('jwt') {
  handleRequest<TUser = any>(err: any, user: TUser): TUser {
    if (err && err.name !== 'TokenExpiredError') {
      throw err;
    }

    return (user ?? null) as TUser;
  }

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const req = context.switchToHttp().getRequest<Request>();
    const authHeader = req.headers['authorization'];

    if (!authHeader) {
      return true;
    }

    return super.canActivate(context);
  }
}
