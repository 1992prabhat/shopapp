import { AppModule } from "./module";
import express from 'express';
import { JwtPayload } from "@prabhat-shop-app/common";

declare global {
	namespace Express {
		interface Request {
			currentUser?: JwtPayload
		}
	}
}
const bootstrap = () => {
	const app = new AppModule(express());

	app.start();
}

bootstrap();