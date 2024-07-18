import { Inject, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import config from 'config'
import { UserRepository } from 'src/shared/repositories/user.repository';
import { userTypes } from 'src/shared/schema/userSchema';
@Injectable()
export class UsersService {
  constructor(@Inject(UserRepository) private readonly usersDB: UserRepository){}
  async create(createUserDto: CreateUserDto) {
    try {
      createUserDto.password = await generateHashPassword(createUserDto.password)
      if(createUserDto.type === 'ADMIN' && createUserDto.secretToken === config.get('adminSecretToken')){
        throw new Error("Not allowed to create an admin")
      }
      else{
        createUserDto.isVerified = true
      }

      const user = await this.usersDB.findOne({
        email: createUserDto.email
      })
      if(user){
        throw new Error("User alreay exists")
      }

      const otp = Math.floor(Math.random() * 90000) + 10000
      const otpExpiryTime= new Date();
      otpExpiryTime.setMinutes(otpExpiryTime.getMinutes() + 10)

      const newUser = await this.usersDB.create({
        ...CreateUserDto,otp, otpExpiryTime
      });
      if(newUser !== userTypes.ADMIN){
        sendEmail()
      }
      return {
        success: true,
        message: "User created successfully",
        result: { email: newUser.email}
      }

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
