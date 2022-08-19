import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Repositories } from 'src/tasks/repositories';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
  ],
  providers: [AuthService, Repositories],
  controllers: [AuthController],
})
export class AuthModule {}
