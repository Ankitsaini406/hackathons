import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service.js';
import { JwtPayload } from './interfaces/jwt-payload.interface.js';
import { RegisterDto } from './dto/register.dto.js';
import { LoginDto } from './dto/login.dto.js';
import { JwtAuthGuard } from './guards/jwt-auth.guard.js';

type AuthenticatedRequest = Request & {
    user: JwtPayload;
}

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post('register')
    registerUser(@Body() dto: RegisterDto) {
        return this.authService.registerUser(dto);
    }

    @Post('login')
    loginUser(@Body() dto: LoginDto) {
        return this.authService.loginUser(dto);
    }

    @Get('me')
    @UseGuards(JwtAuthGuard)
    getProfile(@Req() request: AuthenticatedRequest) {
        return {
            user: request.user,
        }
    }
}
