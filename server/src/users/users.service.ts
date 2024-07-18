import { Inject, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import config from 'config'
import { UserRepository } from 'src/shared/repositories/user.repository';
@Injectable()
export class UsersService {
  constructor(@Inject(UserRepository) private readonly usersDB: UserRepository){}
  async create(createUserDto: CreateUserDto) {
    try {
      createUserDto.password = await generateHashPassword(createUserDto.password)
      if(createUserDto.type === 'ADMIN' && createUserDto.secretToken === config.get('adminSecretToken')){
        throw new Error("Not allowed to create an admin")
      }

      const user = await this.usersDB.findOne({
        email: createUserDto.email
      })
    } catch (error) {
      throw error
    }
  }

  login(email: string, password: string){
    return 'This action logs in the user'
  }

  findAll() {
    return `This action returns all users`;
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
