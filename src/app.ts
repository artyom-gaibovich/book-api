import express, { Express } from 'express';
import { Server } from 'http';
import { inject, injectable } from 'inversify';
import { LoggerInterface } from './logger/logger.interface';
import { TYPES } from './types';
import { json } from 'body-parser';
import 'reflect-metadata';
import { ConfigServiceInterface } from './config/config.service.interface';
import { ExceptionFilterInterface } from './errors/exception.filter.interface';
import { UserController } from './users/users.controller';
import { AuthMiddleware } from './common/auth.middleware';
import { PgPoolService } from './database/pg-pool.service';
import { MongoService } from './database/mongo.service';
import { BookController } from './books/book.controller';

@injectable()
export class App {
	app: Express;
	server: Server;
	port: number;

	constructor(
		@inject(TYPES.Logger) private logger: LoggerInterface,
		@inject(TYPES.DatabaseService) private database: PgPoolService,
		@inject(TYPES.MongoService) private mongodb: MongoService,
		@inject(TYPES.UserController) private userController: UserController,
		@inject(TYPES.BookController) private bookController: BookController,
		@inject(TYPES.ExceptionFilter) private exceptionFilter: ExceptionFilterInterface,
		@inject(TYPES.ConfigService) private configService: ConfigServiceInterface,
	) {
		this.app = express();
		this.port = Number(this.configService.get('APP_PORT'));
	}

	useMiddleware(): void {
		this.app.use(json());
		const authMiddleware = new AuthMiddleware(this.configService.get('SECRET'), [
			'/users/login',
			'/users/register',
		]);
		this.app.use(authMiddleware.execute.bind(authMiddleware));
	}

	useRoutes(): void {
		this.app.use('/users', this.userController.router);
		this.app.use('/books', this.bookController.router);
	}

	useExceptionFilters(): void {
		this.app.use(this.exceptionFilter.catch.bind(this.exceptionFilter));
	}

	public async init(): Promise<void> {
		this.useMiddleware();
		this.useRoutes();
		this.useExceptionFilters();
		this.server = this.app.listen(this.port);
		this.logger.log(`Server start on http://localhost:${this.port}`);
		await this.mongodb.connect();
		await this.database.connect();
	}

	public close(): void {
		this.server.close();
	}
}
