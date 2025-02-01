import { Application } from 'express';
import cors from 'cors';
import * as dotenv from 'dotenv';
import { json, urlencoded } from 'body-parser';
import cookieSession from 'cookie-session';
import mongoose from 'mongoose';

dotenv.config();

export class AppModule {
	constructor(public app: Application) {
		app.set('trust-proxy', true);

		app.use(cors({
			origin: '*',
			credentials: true,
			optionsSuccessStatus: 200
		}));

		app.use(urlencoded({ extended: true}));
		app.use(json());
		app.use(cookieSession({
			signed: false,
			secure: false
		}))
	}

	async start() {
		if(!process.env.MONGO_URI) {
			throw new Error('mongo_uri is required');
		}

		if(!process.env.JWT_KEY) {
			throw new Error('jwt_key is required');
		}

		try {
			await mongoose.connect(process.env.MONGO_URI)
		} catch (error) {
			throw new Error('database connection error')
		}

		this.app.listen(8080, () => console.log('OK! port 8080'));
	}
}