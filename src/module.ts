import express, { Application } from 'express';
import cors from 'cors';
import * as dotenv from 'dotenv';
import cookieSession from 'cookie-session';
import mongoose from 'mongoose';
import { currentUser, errorHandler } from '@prabhat-shop-app/common';

import { authRouter } from './auth/auth.router';

dotenv.config();

export class AppModule {
	constructor(public app: Application) {
		app.set('trust-proxy', true);

		app.use(cors({
			origin: '*',
			credentials: true,
			optionsSuccessStatus: 200
		}));

		app.use(express.urlencoded({ extended: false}));
		app.use(express.json());
		app.use(cookieSession({
			signed: false,
			secure: false
		}));

		Object.setPrototypeOf(this, AppModule.prototype)
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

		// console.log(process.env.JWT_KEY!)
		this.app.use(currentUser(process.env.JWT_KEY!));
		this.app.use(authRouter);
		this.app.use(errorHandler);

		this.app.listen(8080, () => console.log('OK! port 8080'));
	}
}