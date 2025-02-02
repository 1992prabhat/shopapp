import { Request, Response, NextFunction, Router } from "express";
import { authService } from "./auth.service";
import { BadRequestError, currentUser } from '@prabhat-shop-app/common';
import * as dotenv from 'dotenv';

dotenv.config()
const router = Router();

router.post('/signup', async (req: Request, res: Response, next: NextFunction) => {
	const { first_name, last_name, email, password } = req.body;

	const result = await authService.signup({first_name, last_name, email, password});

	if (result.message) {
		return next(new BadRequestError(result.message))
	};

	req.session =  {jwt: result.jwt} ;

	res.status(201).send(true);
});

router.post('/signin', async (req: Request, res: Response, next: NextFunction) => {
	const { email, password } = req.body;

	const result = await authService.signin({email, password});

	if (result.message) {
		return next(new BadRequestError(result.message));
	}

	req.session = {jwt: result.jwt};

	res.status(201).send(true);
});

router.get('/current-user', currentUser(process.env.JWT_KEY!), async (req: Request, res: Response, next: NextFunction) => {
	res.status(200).send(req.currentUser)
})

export { router as authRouter }