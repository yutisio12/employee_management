import { Injectable, UnauthorizedException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm"
import { User } from "../entities/user.auth.entity";
import { JwtService } from "@nestjs/jwt";
import { EncryptionService } from "src/utils/encryption.service";
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User, 'authConnection')
    private userRepository: Repository<User>,
    private jwtService: JwtService,
    private encryptionService: EncryptionService
  ){}

  async validateUser(username: string, password: string): Promise<any>{
    const user = await this.userRepository.findOne({
      where: [{ username }]
    })

    if(user && await bcrypt.compare(password, user.password)){
      const { password, ...result} = user;
      return result;
    }
    return null;
  }

  async validateUserById(userId: string): Promise<any>{
    const user = await this.userRepository.findOne({
      where: [{ id:userId }]
    })

    if(user){
      const { password, ...result} = user;
      return result;
    }
    return null;
  }

  async login(user:any){
    const payload = { username: user.username, sub: user.id, role: user.role };
    const token = this.jwtService.sign(payload)

    const encryptUserinfo = this.encryptionService.encryptObject({
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role
    })

    return {
      access_token: token,
      user: encryptUserinfo
    }
  }

  async register(formData: any){
    const passwordEnc = await bcrypt.hash(formData.password, 10)

    const user = this.userRepository.create({
      ...formData,
      password: passwordEnc
    })

    const insertedUser = await this.userRepository.save(user)
    const userObj = Array.isArray(insertedUser) ? insertedUser[0] : insertedUser;
    const { password, ...result } = userObj;
    return result
  }

  async findUserByeEmail(email: string): Promise<User | undefined>{
    const user = await this.userRepository.findOne({ where: { email } });
    return user === null ? undefined : user;
  }

  async findUserByeUsername(username: string): Promise<User | undefined>{
    const user = await this.userRepository.findOne({ where: { username } });
    return user === null ? undefined : user;
  }

  async findOneCustom(whereParam: object): Promise<User | undefined>{
    const user = await this.userRepository.findOne({where: whereParam});
    return user === null ? undefined : user;
  }

  async changePassword(id: string, newPassword: string): Promise<void>{
    const user  = await this.userRepository.findOne({ where: { id } })
    if(!user){
      throw new UnauthorizedException('User not found')
    }
    const passwordEnc = await bcrypt.hash(newPassword, 10)
    await this.userRepository.update(id, { password: passwordEnc })
  }

  async updateUserByUser(id: string, formData: Partial<User>){
    const user  = await this.userRepository.findOne({ where: { id } })
    if(!user){
      throw new UnauthorizedException('User not found')
    }
    Object.assign(user, formData);
    await this.userRepository.save(user)
    const encryptUserinfo = this.encryptionService.encryptObject({
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role
    })

    const payload = { username: user.username, sub: user.id, role: user.role };
    const token = this.jwtService.sign(payload)

    return {
      access_token: token,
      user: encryptUserinfo
    }
  }

  async updateUserByAdmin(id: string, formData: Partial<User>): Promise<any>{
    const user  = await this.userRepository.findOne({ where: { id } })
    if(!user){
      throw new UnauthorizedException('User not found')
    }
    Object.assign(user, formData);
    await this.userRepository.save(user)
    return 'OK'
  }

}
