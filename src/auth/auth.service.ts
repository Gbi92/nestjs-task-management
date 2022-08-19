import { Injectable } from '@nestjs/common';
import { AuthCredentialsDto } from 'src/tasks/dto/auth-credentials.dto';
import { Repositories } from 'src/tasks/repositories';

@Injectable()
export class AuthService {
    constructor(private readonly repositories: Repositories) {}

    async signUp(authCredentialsDto: AuthCredentialsDto): Promise<void> {
        return this.repositories.usersRepository.createUser(authCredentialsDto);
    }
}
