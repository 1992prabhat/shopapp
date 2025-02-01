import { Request, Response, NextFunction, Router, RequestHandler } from "express";
import { authService } from "./auth.service";
import { currentUser } from '@prabhat-shop-app/common';

const router = Router();

router.post('/signup', async (req: Request, res: Response, next: NextFunction) => {
	const { first_name, last_name, email, password } = req.body;

	const jwt = await authService.signup({first_name, last_name, email, password}, next);

	req.session = { jwt };

	res.status(201).send(true);
});

router.post('/signin', async (req: Request, res: Response, next: NextFunction) => {
	const { first_name, last_name, email, password } = req.body;

	const jwt = await authService.signup({first_name, last_name, email, password}, next);

	req.session = { jwt };

	res.status(201).send(true);
});

router.get('/current-user', currentUser(process.env.JWT_KEY!), async (req: Request, res: Response, next: NextFunction) => {
	res.status(200).send(req.currentUser)
})

export { router as authRouter }