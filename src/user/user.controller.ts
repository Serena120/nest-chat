import { Controller, Get, Query, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/auth/auth.guard';
import { UserService } from './user.service';

@UseGuards(AuthGuard)
@Controller('users')
export class UserController {
  constructor(private userService: UserService) {}

  @Get()
  async searchUser(@Query('username') username: string) {
    //will get a name from query
    return this.userService.searchUser(username);
  }

  @Get('curr-user')
  async getLoggedInUser(@Req() req) {
    //send userid, username and email from req
    const { userId, username, email } = req.user;
    const userData = { userId, username, email };
    return this.userService.getLoggedInUser(userData);
  }
}
