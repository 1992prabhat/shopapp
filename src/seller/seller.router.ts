import { Router, Request, Response, NextFunction } from 'express';
import { BadRequestError, Uploader, UploadMiddlewareOptions, requireAuth, CustomError } from '@prabhat-shop-app/common';
import { sellerService } from './seller.service';

const uploader = new Uploader('upload/');

const middlewareOptions: UploadMiddlewareOptions = {
	types: ['image/png', 'image/jpeg'],
	fieldName: 'image'
}

const multipleFileMiddleware = uploader.uploadMultipleFiles(middlewareOptions);

const router = Router();

// Create product route.
router.post('/product/new', requireAuth, multipleFileMiddleware, async (req: Request, res: Response, next: NextFunction) => {
	const { title, price } = req.body;

	if (!req.files) return next(new BadRequestError('Images are required'));

	if (req.uploaderError) return next(new BadRequestError(req.uploaderError.message));

	// Create product
	const product = await sellerService.addProduct({ title, price, userId: req.currentUser!.userId, files: req.files })

	// Send to user
	res.status(201).send(product);
})

// Update product route.
router.post('/product/:id/update', requireAuth, async (req: Request, res: Response, next: NextFunction) => {
	const { id } = req.params;
	const { title, price } = req.body;

	const result = sellerService.updateProduct({ title, price, userId: req.currentUser!.userId, productId: id });

	if (result instanceof CustomError) return next(result);

	res.status(200).send(result);
})

// Delete product route.
router.post('/product/:id/delete', requireAuth, async (req: Request, res: Response, next: NextFunction) => {
	const { id } = req.params;

	const result = sellerService.deleteProduct({ productId: id, userId: req.currentUser!.userId});

	if (result instanceof CustomError) return next(result);

	res.status(200).send(result);
})

// Add image route
router.post('/product/:id/add-images', requireAuth, multipleFileMiddleware, async (req: Request, res: Response, next: NextFunction) => {
	const { id } = req.params;

	if (!req.files) return next(new BadRequestError('Images are required'));

	if (req.uploaderError) return next(new BadRequestError(req.uploaderError.message));

	const result = sellerService.addProductImages({ productId: id, userId: req.currentUser!.userId, files: req.files});

	if (result instanceof CustomError) return next(result);

	res.status(200).send(result);
})

// Delete image route
router.delete('product/:id/delete-images', requireAuth, async (req: Request, res: Response, next: NextFunction) => {
	const { id } = req.params;
	const { imagesIds } = req.body;
	const result = await sellerService.deleteProductImages({ productId: id, userId: req.currentUser!.userId, imagesIds: imagesIds});

	if (result instanceof CustomError) return next(result);

	res.status(200).send(result);
});

export { router as sellerRouter };