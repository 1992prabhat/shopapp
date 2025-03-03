import { BadRequestError, NotAuthorizedError } from '@prabhat-shop-app/common';
import { AddImagesDto, CreateProductDto, DeleteImagesDto, DeleteProductDto, UpdateProductDto } from './dtos/product.dto';
import { ProductService, productService } from './product/product.service';

export class SellerService {
	constructor(public productService: ProductService) {}

	async addProduct(createProductDto: CreateProductDto) {
		return await this.productService.create(createProductDto)
	}

	async updateProduct(updateProductDto: UpdateProductDto) {
		const product = await this.productService.findOneById(updateProductDto.productId);

		if(!product) return new BadRequestError('Product not found');

		if(product.user.toString() !== updateProductDto.userId) {
			return new NotAuthorizedError()
		}

		return await this.productService.updateProduct(updateProductDto);


	}

	async deleteProduct(deleteProductDto: DeleteProductDto) {
		const product = await this.productService.findOneById(deleteProductDto.productId);

		if (!product) return new BadRequestError('Product not found');

		if(product.user.toString() !== deleteProductDto.userId) {
			return new NotAuthorizedError()
		}

		return await this.productService.deleteProduct(deleteProductDto);

	}

	// Add images to products.
	async addProductImages(addImagesDto: AddImagesDto) {
		const product = await this.productService.findOneById(addImagesDto.productId);

		if (!product) return new BadRequestError('Product not found');

		if(product.user.toString() !== addImagesDto.userId) {
			return new NotAuthorizedError()
		}

		return await this.productService.addImages(addImagesDto);
	}

	async deleteProductImages(deleteImageDto: DeleteImagesDto) {
		const product = await this.productService.findOneById(deleteImageDto.productId);

		if(!product) return new BadRequestError('Product not found');

		if (product.user.toString() !== deleteImageDto.userId) {
			return new NotAuthorizedError();
		}

		return await this.productService.deleteImages(deleteImageDto);
	}

}

export const sellerService = new SellerService(productService)