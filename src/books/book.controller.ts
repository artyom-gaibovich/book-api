import { inject, injectable } from 'inversify';
import { BaseController } from '../common/base.controller';
import { LoggerInterface } from '../logger/logger.interface';
import { TYPES } from '../types';
import 'reflect-metadata';
import { ConfigServiceInterface } from '../config/config.service.interface';
import { BookControllerInterface } from './book.controller.interface';
import { NextFunction, Request, Response } from 'express';
import { CreateBookDto } from './dto/create-book.dto';
import { BookService } from './book.service';
import { ValidateMiddleware, ValidateParamIdMiddleware } from '../common/validate.middleware';
import { AuthAdminGuard } from '../common/auth.guard';
import { UpdateBookDto } from './dto/update-book.dto';

@injectable()
export class BookController extends BaseController implements BookControllerInterface {
	constructor(
		@inject(TYPES.Logger) private loggerService: LoggerInterface,
		@inject(TYPES.ConfigService) private configService: ConfigServiceInterface,
		@inject(TYPES.BookService) private bookService: BookService,
	) {
		super(loggerService);
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
				middlewares: [new ValidateParamIdMiddleware('id')],
			},
			{
				path: '/:id',
				method: 'put',
				func: this.update,
				middlewares: [
					new ValidateParamIdMiddleware('id'),
					new ValidateMiddleware(UpdateBookDto),
					new AuthAdminGuard(),
				],
			},
			{
				path: '/:id',
				method: 'delete',
				func: this.delete,
				middlewares: [new ValidateParamIdMiddleware('id'), new AuthAdminGuard()],
			},
		]);
	}

	async create(req: Request<{}, {}, CreateBookDto>, res: Response, _: NextFunction): Promise<void> {
		const { title, author, publicationDate, genres } = req.body;
		const result = await this.bookService.createBook({ title, author, publicationDate, genres });
		this.ok(res, result);
		this.loggerService.log(`Book created: ${JSON.stringify(result)}`);
	}

	async delete(req: Request, res: Response, _: NextFunction): Promise<void> {
		const { id } = req.params;
		const result = await this.bookService.deleteBook(id);
		this.ok(res, result);
		this.loggerService.log(`Book deleted: ID ${id}`);
	}

	async findAll(_: Request, res: Response, __: NextFunction): Promise<any> {
		const books = await this.bookService.getBooks();
		this.ok(res, { books });
		this.loggerService.log(`Books retrieved: ${books?.length ? books?.length : 0} books found`);
	}

	async findById(req: Request<any, {}, {}>, res: Response, _: NextFunction): Promise<void> {
		const { id } = req.params;
		const result = await this.bookService.getBookById(id);
		this.ok(res, result);
		this.loggerService.log(`Book retrieved: ${JSON.stringify(result)}`);
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
		this.loggerService.log(`Book updated: ID ${id}, Data: ${JSON.stringify(req.body)}`);
	}
}
