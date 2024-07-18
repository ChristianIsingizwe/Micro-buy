import { InjectModel } from '@nestjs/mongoose';
import { Users } from '../schema/userSchema';
import { Model } from 'mongoose';

export class UserRepository {
  constructor(
    @InjectModel(Users.name) private readonly userModel: Model<Users>,
  ) {}
}