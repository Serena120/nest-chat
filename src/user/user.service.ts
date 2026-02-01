import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './schemas/user.schema';
import { Model } from 'mongoose';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  //search users
  async searchUser(username: string) {
    const query = {};
    if (username) query['username'] = { $regex: new RegExp(username, 'i') };

    const getUser = await this.userModel.find(query);

    if (getUser.length <= 0)
      throw new BadRequestException("user doesn't exist");

    return { message: 'User found', data: getUser };
  }

  //to get the current user's details
  async getLoggedInUser(userData: {
    userId: string;
    username: string;
    email: string;
  }) {
    return { userData };
  }
}
