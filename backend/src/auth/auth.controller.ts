import { Controller, Post, Body, Res, HttpStatus, UseGuards, Get, Req, NotFoundException } from "@nestjs/common";
import type { Response, Request } from "express";
import { AuthService } from "./auth.service";
import { JwtAuthGuard } from "./jwt-auth.guard";
import { LoginDto } from "./dto/login.dto";
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from "@nestjs/swagger";

@ApiTags('Authentication')
@Controller('auth')
export class AuthController{
  constructor(private authService: AuthService){}

  @Post('login')
  @ApiOperation({ summary: 'User login' })
  @ApiResponse({ status: 200, description: 'Login successful' })
  async login(
    @Body() loginDto: LoginDto,
    @Res() response: Response,
  ){
    const user = await this.authService.validateUser(loginDto.username, loginDto.password)
    
    if(!user){
      return response.status(HttpStatus.UNAUTHORIZED).json({
        statusCode: HttpStatus.UNAUTHORIZED,
        message: 'Invalid credentials'
      })
    }

    const loginData = await this.authService.login(user)
    response.cookie('access_token', loginData.access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    })

    return response.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      ...loginData
    })

  }

  @Post('register')
  @ApiOperation({ summary: 'Register new user' })
  @ApiResponse({ status: 201, description: 'User registered successfully' })
  @ApiResponse({ status: 409, description: 'Username or email already exists' })
  async register(
    @Body() registerDto: { username: string, password: string, email: string, role?: string },
  ) {
    const checkUsername = await this.authService.findOneCustom({ username: registerDto.username });
    const checkEmail = await this.authService.findOneCustom({ email: registerDto.email });
    if(checkUsername){
      return {
        statusCode: HttpStatus.CONFLICT,
        message: 'Username/Email already exists, please use another username/email'
      }
    }
    return this.authService.register(registerDto);
  }

  @Post('validate')
  @UseGuards(JwtAuthGuard)
  async validate( @Req() req ){
    console.log(req)
  }

  @Post('logout')
  @ApiOperation({ summary: 'User logout' })
  @ApiResponse({ status: 200, description: 'Logout successful' })
  async logout(@Res({passthrough: true}) response: Response){
    response.clearCookie('access_token')
    return { message: 'Logout Successfully' }
  }

  @Get('profile')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({summary: 'Personal General Information'})
  @ApiBearerAuth()
  @ApiResponse({ status: 200, description: 'Profile retrieved successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async profile( @Req() req ){
    const profile = await this.authService.findOneCustom({id: req.user.id})
    if (!profile) {
      throw new NotFoundException('User not found');
    }
    const {id, password, ...result } = profile
    return result
  }

}