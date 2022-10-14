import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthCredentialsDto } from '../tasks/dto/auth-credentials.dto';
import { Repositories } from '../tasks/repositories';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './jwt-payload.interface';

@Injectable()
export class AuthService {
    constructor(
        private readonly repositories: Repositories,
        private jwtService: JwtService,
        ) {}

    async signUp(authCredentialsDto: AuthCredentialsDto): Promise<void> {
        return this.repositories.usersRepository.createUser(authCredentialsDto);
    }

    async signIn(
      authCredentialsDto: AuthCredentialsDto
    ): Promise<{ accessToken: string}> {
        const { username, password } = authCredentialsDto;
        const user = await this.repositories.usersRepository.findOne({where: { username: username }});

        if (user && (await bcrypt.compare(password, user.password))) {
            const payload: JwtPayload = { username };
            const accessToken: string = await this.jwtService.sign(payload);
            return { accessToken };
        } else {
            throw new UnauthorizedException('Please check your login credentials');
        }
    }
}
