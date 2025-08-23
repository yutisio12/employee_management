import { Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { AuthService } from "./auth.service";
import { Request } from "express";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy){
  constructor(
    private configService: ConfigService,
    private authService: AuthService
  ){
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken([
        ExtractJwt.fromAuthHeaderAsBearerToken(),
        (
          request: Request
        ) => {
          return request?.cookies?.['access_token'];
        }
      ]),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET')
    })
  }

  async validate(payload: any){
    const user = await this.authService.validateUserById(payload.sub)
    if(!user){
      throw new UnauthorizedException()
    }
    return user
  }

}