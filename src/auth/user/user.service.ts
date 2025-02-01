import { UserModel } from "@prabhat-shop-app/common";
import { User } from './user.model'
import { CreateUserDto } from '../dtos/auth.dto';

export class UserService {
	constructor(public userModel: UserModel) {

	}

	async create(createUserDto: CreateUserDto) {
		const user = new this.userModel({
			first_name: createUserDto.first_name,
			last_name: createUserDto.last_name,
			email: createUserDto.email,
			password: createUserDto.password
		});

		return await user.save();
	}

	async findOneByEmail(email: string) {
		return await this.userModel.findOne({ email })
	}

}

export const userService = new UserService(User);