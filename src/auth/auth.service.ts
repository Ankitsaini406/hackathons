import { Injectable, ConflictException, UnauthorizedException, ForbiddenException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { hash, compare } from 'bcrypt';
import { db } from '../prisma/db.js';
import { RegisterDto } from './dto/register.dto.js';
import { LoginDto } from './dto/login.dto.js';
import { JwtPayload } from './interfaces/jwt-payload.interface.js';

@Injectable()
export class AuthService {
    constructor(private readonly jwtService: JwtService) {}

    async loginUser(dto: LoginDto) {
        const email = dto.email.trim().toLowerCase();

        const user = await db.orm.public.User.where({
            email,
        }).first();

        if (!user || !user.passwordHash) {
            throw new UnauthorizedException('Invalid email or Password');
        }

        if (!user.isActive) {
            throw new ForbiddenException('Your account is disabled');
        }

        const isPasswordValid = await compare(
            dto.password,
            user.passwordHash,
        );

        if (!isPasswordValid) {
            throw new UnauthorizedException('Invalid email or Password');
        }

        const payload: JwtPayload = {
            sub: user.id,
            email: user.email,
            role: user.role,
        };

        const accessToken = await this.jwtService.signAsync(payload);

        return {
            message: 'Login successful',
            accessToken,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
            },
        };
    }

    async registerUser(dto: RegisterDto) {
        const email = dto.email.trim().toLowerCase();

        const existingUser = await db.orm.public.User.where({
            email,
        }).first();

        if (existingUser) {
            throw new ConflictException('Email already registered');
        }

        const passwordHash = await hash(dto.password, 12);

        const user = await db.orm.public.User.create({
            email,
            name: dto.name,
            passwordHash,
            role: 'User',
        });

        return {
            message: 'Registration successful',
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
            },
        };
    }
}
