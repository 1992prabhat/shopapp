import { NextFunction } from 'express';
import { CreateUserDto, SignInDto } from './dtos/auth.dto';
import { userService, UserService } from './user/user.service';
import { BadRequestError, AuthenticationService } from '@prabhat-shop-app/common';

export class AuthService {
	constructor(public userService: UserService, public authenticationService: AuthenticationService) {}

	async signup(createUserDto: CreateUserDto, errCallback: NextFunction) {
		const existinUser = await this.userService.findOneByEmail(createUserDto.email);

		if (existinUser) return errCallback(new BadRequestError('User with the same email already exists'));

		const newUser = await this.userService.create(createUserDto);

		const jwt = this.authenticationService.generateJwt({email: createUserDto.email, userId: newUser.id}, process.env.JWT_KEY!);
		return jwt;
	}

	async signin(signInDto: SignInDto, errCallback: NextFunction) {
		const existingUser = await this.userService.findOneByEmail(signInDto.email);

		if (!existingUser) return errCallback(new BadRequestError('Invalid Credentials'));

		const samePwd = await this.authenticationService.pwdCompare(existingUser.password, signInDto.password);

		if (!samePwd) return errCallback(new BadRequestError('Invalid Credentials'));

		const jwt = this.authenticationService.generateJwt({email: signInDto.email, userId: existingUser.id}, process.env.JWT_KEY!);
		return jwt;
	}
}

export const authService = new AuthService(userService, new AuthenticationService());