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
import {AuthAdminMiddleware, AuthMiddleware} from './common/auth.middleware';
import {PgPoolService} from "./database/pg-pool.service";

@injectable()
export class App {
	app: Express;
	server: Server;
	port: number;

	constructor(
		@inject(TYPES.ILogger) private logger: LoggerInterface,
		@inject(TYPES.DatabaseService) private database: PgPoolService,
		@inject(TYPES.UserController) private userController: UserController,
		@inject(TYPES.BookController) private bookController: UserController,
		@inject(TYPES.ExeptionFilter) private exceptionFilter: ExceptionFilterInterface,
		@inject(TYPES.ConfigService) private configService: ConfigServiceInterface,
	) {
		this.app = express();
		this.port = 8000;
	}

	useMiddleware(): void {
		this.app.use(json());
		const authMiddleware = new AuthAdminMiddleware(this.configService.get('SECRET'));
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
		this.database.connect()
	}

	public close(): void {
		this.server.close();
	}
}
