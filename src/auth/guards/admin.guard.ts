import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from "@nestjs/common";
import { JwtPayload } from "../interfaces/jwt-payload.interface"

type AuthenticatedRequest = Request & {
    user: JwtPayload;
};

@Injectable()
export class AdminGuard implements CanActivate {
    canActivate(context: ExecutionContext): boolean {
        const request = context.switchToHttp().getRequest<AuthenticatedRequest>();

        if (request.user?.role !== 'Admin') {
            throw new ForbiddenException('Access required');
        }

        return true;
    }
}