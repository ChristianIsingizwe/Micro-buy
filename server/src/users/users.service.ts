import { Inject, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import config from 'config'
import { UserRepository } from 'src/shared/repositories/user.repository';
import { userTypes } from 'src/shared/schema/userSchema';
import { sendEmail } from 'src/shared/utility/mail-handler';
import { comparePassword, generateHashPassword } from 'src/shared/utility/password-manager';
import { generateAuthToken } from 'src/shared/utility/tokenGenerator';
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
      if(newUser.type !== userTypes.ADMIN){
        sendEmail(
          newUser.email,
          config.get('emailService.emailTemplates.verifyEmail'),
          'Email verification - Micro-Buy',
          {
            customerName: newUser.name,
            customerEmail: newUser.email,
            otp
          }

        )
      }
      return {
        success: true,
        message: newUser.type === userTypes.ADMIN ? "Admin created successfully" : "Please activate your account by verifying your email",
        result: { email: newUser.email}
      }

    } catch (error) {
      throw error
    }
  }

  async login(email: string, password: string){
    try {
      const userExists = await this.usersDB.findOne({
        email,
      })
      if(!userExists){
        throw new Error("User not found")
      }
      if(!userExists.isVerified){
        throw new Error ("Please verify your account")
      }

      const isPasswordMatch = comparePassword(
        password,
        userExists.password
      )

      if(!isPasswordMatch){
        throw new Error("Invalid email or password")
      }
      const token = await generateAuthToken(
        userExists._id.toString()
      );
      return {
        success: true,
        message: "Login successfull",
        results:{
          user:{
            name: userExists.name,
            email: userExists.email,
            type: userExists.type,
            id: userExists._id.toString()
          },
          token
        }
      }
    }
    catch(error){
      throw error
    }
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
