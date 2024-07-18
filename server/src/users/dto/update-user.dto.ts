import { CreateUserDto } from './create-user.dto';

export class UpdateUserDto {
  name?: string;
  oldPassword?: string;
  newPassword?: string;
}
