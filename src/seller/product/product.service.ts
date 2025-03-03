import mongoose from "mongoose";
import { ProductModel, uploadDir } from "@prabhat-shop-app/common";
import { Product } from "./product.model";
import { CreateProductDto, UpdateProductDto, DeleteProductDto, AddImagesDto, DeleteImagesDto } from '../dtos/product.dto';
import fs from 'fs';
import path from 'path';

export class ProductService {
	constructor(public productModel: ProductModel) {}

// Find product by id.
	async findOneById(productId: string) {
		return await this.productModel.findById({ _id: productId });
	}

	// Create product.
	async create(createProductDto: CreateProductDto) {
		const images = this.generateProductImages(createProductDto.files);
		const product = new this.productModel({
			title: createProductDto.title,
			price: createProductDto.price,
			user: createProductDto.userId,
			images: [{ src: images }]
		})
	}

	// Update product.
	async updateProduct(updateProductDto: UpdateProductDto) {
		return await this.productModel.findByIdAndUpdate({ _id: updateProductDto.productId },
			{ $set: { title: updateProductDto.title, price: updateProductDto.price, user: updateProductDto.userId }}, { new: true }
		)
	}

	// Delete product.
	async deleteProduct(deleteProductDto: DeleteProductDto) {
		return await this.productModel.findByIdAndDelete({ _id: deleteProductDto.productId})
	}

	// Add Images to product.
	async addImages(addImagesDto: AddImagesDto) {
		const images = this.generateProductImages(addImagesDto.files);
		return this.productModel.findByIdAndUpdate({ _id: addImagesDto.productId },
			{$push: { images: { $each: images }}}, { new: true }
		)
	}

	// Delete Images from product.
	async deleteImages(deleteImageDto: DeleteImagesDto) {
		return await this.productModel.findByIdAndUpdate( { _id: deleteImageDto.productId },
			{ $pull: { images: { _id: { $in: deleteImageDto.imagesIds }}}}, { new: true}
		)

	}

	generateBase64Url(contentType: string, buffer: Buffer) {
		return `data: ${contentType};base64${buffer.toString('base64')}`;
	}

	generateProductImages(files: CreateProductDto['files']): Array<{src: string}> {
		let images: Array<Express.Multer.File>;

		if(typeof files === 'object') {
			images = Object.values(files).flat();
		}
		else {
			images = files ? [...files] : [];
		}

		return images.map((image: Express.Multer.File) => {
			let srcObj = { src: this.generateBase64Url(image.mimetype, fs.readFileSync(path.join(uploadDir + image.filename))) }

			fs.unlink(path.join(uploadDir + image.filename), () => {});
			return srcObj;
		})
	}

}

export const productService = new ProductService(Product)
