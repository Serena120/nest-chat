import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { SignUpDto } from './dtos/signup.dto';
import { LoginDto } from './dtos/login.dto';
import { AuthService } from './auth.service';
import { AuthGuard } from './auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  //will have the routes for sign up and login
  //   @HttpCode(HttpStatus.CREATED)
 
  @Post('sign-up')
  async signUp(@Body() signupDto: SignUpDto) {
    //return the func from auth service that will handle signup
    return this.authService.signUp(signupDto);
  }

  @HttpCode(HttpStatus.OK)
  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    //return the func that will handle login
    return this.authService.login(loginDto);
  }

  //   @UseGuards(AuthGuard)
  //   @Get('testing')
  //   test(@Request() req) {
  //     return req.user;
  //   }
}
