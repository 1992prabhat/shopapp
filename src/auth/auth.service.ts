import { CreateUserDto, SignInDto } from './dtos/auth.dto';
import { userService, UserService } from './user/user.service';
import { AuthenticationService } from '@prabhat-shop-app/common';

export class AuthService {
	constructor(public userService: UserService, public authenticationService: AuthenticationService) {}

	async signup(createUserDto: CreateUserDto) {
		const existinUser = await this.userService.findOneByEmail(createUserDto.email);

		if (existinUser) {
			return { message: 'User with the same email already exists' };
		}

		if(!createUserDto.first_name || !createUserDto.last_name || !createUserDto.email || !createUserDto.password) {
			return {message: 'All fields are required'};
		}

		const newUser = await this.userService.create(createUserDto);

		const jwt = this.authenticationService.generateJwt({email: createUserDto.email, userId: newUser.id}, process.env.JWT_KEY!);
		return {jwt};
	}

	async signin(signInDto: SignInDto) {
		const existingUser = await this.userService.findOneByEmail(signInDto.email);

		if (!existingUser) {
			return {message: 'Invalid credentials'};
		}

		if(!signInDto.email || !signInDto.password) {
			return {message: 'Invalid credentials'};
		}

		const samePwd = await this.authenticationService.pwdCompare(existingUser.password, signInDto.password);

		if (!samePwd) {
			return {message: 'Invalid credentials'};
		}

		const jwt = this.authenticationService.generateJwt({email: signInDto.email, userId: existingUser.id}, process.env.JWT_KEY!);
		return {jwt};
	}
}

export const authService = new AuthService(userService, new AuthenticationService());