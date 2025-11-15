import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Roles } from '../decorator';

@Injectable()
export class RolesGuard implements CanActivate {
    constructor(private reflector: Reflector) {}

    canActivate(context: ExecutionContext): boolean {
        const requiredRole = this.reflector.get(Roles, context.getHandler());

        if (!requiredRole) {
            return true;
        }

        const user = context.switchToHttp().getRequest().user;
        if (!user) {
            return false;
        }

        return (user.roles ?? []).some(
            (role) => role.roleName === requiredRole,
        );
    }
}
