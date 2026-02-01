import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { SignUpDto } from './dtos/signup.dto';
import { User, UserDocument } from 'src/user/schemas/user.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { LoginDto } from './dtos/login.dto';
import * as argon2 from 'argon2';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private jwtService: JwtService,
  ) {}

  async signUp(dto: SignUpDto) {
    try {
      const { username, email, password: plainPassword } = dto;
      //check if already exists
      const userExists = await this.userModel.findOne({ username, email });

      //if user already exist -> username already taken, or already has an acc
      if (userExists) {
        throw new BadRequestException('User already Exists');
      }

      //hash the password
      const hashedPassword = await argon2.hash(plainPassword);

      //if user doesn't exist ->create user
      const newUser = await this.userModel.create({
        username,
        email,
        password: hashedPassword,
        role: 'user',
      });

      const { password, ...user } = newUser.toObject();

      return user;
    } catch (error) {
      console.log(error);
    }
  }

  async login(dto: LoginDto) {
    const { username, password } = dto;
    //check if user exists
    const user = await this.userModel.findOne({ username });

    //if doesn't exist tell them to resgister first
    if (!user) throw new UnauthorizedException("User doesn't exist");

    //verify that the password is correct
    const verifyPassword = await argon2.verify(user.password, password);
    if (!verifyPassword) throw new UnauthorizedException('Incorrect password');

    // exists -> create a jwt token and return it
    console.log('login username', username);

    const userData = {
      userId: user._id,
      username,
      email: user.email,
      role: user.role,
    };

    const accessToken = await this.jwtService.signAsync(userData);
    return { accessToken };
  }
}
