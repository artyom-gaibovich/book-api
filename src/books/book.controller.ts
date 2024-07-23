import { inject, injectable } from 'inversify';
import { BaseController } from '../common/base.controller';
import { LoggerInterface } from '../logger/logger.interface';
import { TYPES } from '../types';
import 'reflect-metadata';
import { BookControllerInterface } from './book.controller.interface';
import { NextFunction, Request, Response } from 'express';
import { CreateBookDto } from './dto/create-book.dto';
import { BookService } from './book.service';
import {
	ValidateMiddleware,
	ValidateParamIdIsMongoStringMiddleware,
} from '../common/validate.middleware';
import { AuthAdminGuard } from '../common/auth.guard';
import { UpdateBookDto } from './dto/update-book.dto';

@injectable()
export class BookController extends BaseController implements BookControllerInterface {
	constructor(
		@inject(TYPES.Logger) private loggerService: LoggerInterface,
		@inject(TYPES.BookService) private bookService: BookService,
	) {
		super(loggerService, 'books');
		this.bindRoutes([
			{
				path: '',
				method: 'post',
				func: this.create,
				middlewares: [new ValidateMiddleware(CreateBookDto), new AuthAdminGuard()],
			},
			{
				path: '',
				method: 'get',
				func: this.findAll,
				middlewares: [],
			},
			{
				path: '/:id',
				method: 'get',
				func: this.findById,
				middlewares: [new ValidateParamIdIsMongoStringMiddleware('id')],
			},
			{
				path: '/:id',
				method: 'put',
				func: this.update,
				middlewares: [
					new ValidateParamIdIsMongoStringMiddleware('id'),
					new ValidateMiddleware(UpdateBookDto),
					new AuthAdminGuard(),
				],
			},
			{
				path: '/:id',
				method: 'delete',
				func: this.delete,
				middlewares: [new ValidateParamIdIsMongoStringMiddleware('id'), new AuthAdminGuard()],
			},
		]);
	}

	async create(req: Request<{}, {}, CreateBookDto>, res: Response, _: NextFunction): Promise<void> {
		const { title, author, publicationDate, genres } = req.body;
		const result = await this.bookService.createBook({ title, author, publicationDate, genres });
		this.ok(res, result);
		this.loggerService.log(`Create book: ${JSON.stringify(result)}`);
	}

	async delete(req: Request, res: Response, _: NextFunction): Promise<void> {
		const { id } = req.params;
		const result = await this.bookService.deleteBook(id);
		if (result.deletedCount === 0) {
			this.loggerService.error(` Book : ID ${id} doesnt exists`);
			this.send(res, 404, { status: 404, message: "Book doesn't exists" });
		} else {
			this.ok(res, result);
			this.loggerService.log(`Delete book: ID ${id}`);
		}
	}

	async findAll(_: Request, res: Response, __: NextFunction): Promise<void> {
		const books = await this.bookService.getBooks();
		this.ok(res, { books });
		this.loggerService.log(`Find all books: ${books?.length ? books?.length : 0} found`);
	}

	async findById(
		req: Request<{ id: string }, {}, {}>,
		res: Response,
		_: NextFunction,
	): Promise<void> {
		const { id } = req.params;
		const result = await this.bookService.getBookById(id);
		if (!result) {
			this.loggerService.error(` Book with id ${id} not found`);
			this.send(res, 404, ` Book with id ${id} not found`);
		}
		this.ok(res, result);
		this.loggerService.log(`Find book by ID: ID ${id}, Result: ${JSON.stringify(result)}`);
	}

	async update(req: Request, res: Response, _: NextFunction): Promise<void> {
		const { id } = req.params;
		const { title, author, publicationDate, genres } = req.body;
		const result = await this.bookService.updateBook(id, {
			title,
			author,
			publicationDate,
			genres,
		});
		this.ok(res, result);
		this.loggerService.log(`Update book: ID ${id}, Data: ${JSON.stringify(req.body)}`);
	}
}
