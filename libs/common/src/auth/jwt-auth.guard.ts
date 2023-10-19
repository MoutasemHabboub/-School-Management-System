import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  Logger,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { Reflector } from '@nestjs/core';
import { catchError, map, Observable, of, tap } from 'rxjs';
@Injectable()
export class JwtAuthGuard implements CanActivate {
  private readonly logger = new Logger(JwtAuthGuard.name);

  constructor(
    @Inject('AUTH_SERVICE') private readonly authClient: ClientProxy,
    private readonly reflector: Reflector,
  ) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    // const jwt = context
    //   .switchToHttp()
    //   .getRequest()
    //   .headers['authorization'].split(' ')[1];
    // const rawToken = context
    //   .switchToHttp()
    //   .getRequest()
    //   .headers['authorization'].split(' ')[1];
    // console.log(rawToken);

    // if (!jwt) {
    //   return false;
    // }
    // const headers = {
    //   Authentication: context.switchToHttp().getRequest().headers[
    //     'authorization'
    //   ],
    // };
    const pattern = { cmd: 'authenticate' };
    const meta = { headers: context.switchToHttp().getRequest().headers }; // send all headers
    const payload = meta; // any additional payload you may have.
    console.log(context.switchToHttp().getRequest().headers);
    return this.authClient.send<any>('authenticate', payload).pipe(
      tap((res) => {
        context.switchToHttp().getRequest().user = res;
      }),
      map(() => true),
      catchError((err) => {
        this.logger.error(err);
        return of(false);
      }),
    );
  }
}
