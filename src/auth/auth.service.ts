import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthCredentialsDto } from 'src/tasks/dto/auth-credentials.dto';
import { Repositories } from 'src/tasks/repositories';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
    constructor(private readonly repositories: Repositories) {}

    async signUp(authCredentialsDto: AuthCredentialsDto): Promise<void> {
        return this.repositories.usersRepository.createUser(authCredentialsDto);
    }

    async signIn(authCredentialsDto: AuthCredentialsDto): Promise<string> {
        const { username, password } = authCredentialsDto;
        const user = await this.repositories.usersRepository.findOne({where: { username: username }});

        if (user && (await bcrypt.compare(password, user.password))) {
            return 'success';
        } else {
            throw new UnauthorizedException('Please check your login credentials');
        }
    }
}
