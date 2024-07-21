import {Container, ContainerModule, interfaces} from 'inversify';
import {App} from './app';
import {ConfigService} from './config/config.service';
import {ConfigServiceInterface} from './config/config.service.interface';
import {ExceptionFilter} from './errors/exception.filter';
import {ExceptionFilterInterface} from './errors/exception.filter.interface';
import {LoggerInterface} from './logger/logger.interface';
import {LoggerService} from './logger/logger.service';
import {TYPES} from './types';
import {UserController} from './users/users.controller';
import {UsersControllerInterface} from './users/users.controller.interface';
import {UsersRepository} from './users/users.repository';
import {UsersRepositoryInterface} from './users/users.repository.interface';
import {UserService} from './users/users.service';
import {UsersServiceInterface} from './users/users.service.interface';
import {PgPoolService} from "./database/pg-pool.service";
import {DatabaseConfig} from "./database/database.config";
import {RolesRepositoryInterface} from "./roles/roles.repository.interface";
import {RolesRepository} from "./roles/roles.repository";
import {BookRepositoryInterface} from "./books/book.repository.interface";
import {BookRepository} from "./books/book.repository";
import {BookServiceInterface} from "./books/book.service.interface";
import {BookService} from "./books/book.service";
import {BookControllerInterface} from "./books/book.controller.interface";
import {BookController} from "./books/book.controller";
import {MongoService} from "./database/mongo.service";

export interface IBootstrapReturn {
	appContainer: Container;
	app: App;
}

export const appBindings = new ContainerModule((bind: interfaces.Bind) => {
	bind<LoggerInterface>(TYPES.ILogger).to(LoggerService).inSingletonScope();
	bind<ExceptionFilterInterface>(TYPES.ExeptionFilter).to(ExceptionFilter);
	bind<MongoService>(TYPES.MongoService).to(MongoService);


	bind<UsersRepositoryInterface>(TYPES.UsersRepository).to(UsersRepository).inSingletonScope();
	bind<UsersControllerInterface>(TYPES.UserController).to(UserController);
	bind<UsersServiceInterface>(TYPES.UserService).to(UserService);

	bind<ConfigServiceInterface>(TYPES.ConfigService).to(ConfigService).inSingletonScope();


	bind<BookRepository>(TYPES.BookRepository).to(BookRepository).inSingletonScope();
	bind<BookService>(TYPES.BookService).to(BookService).inSingletonScope();
	bind<BookControllerInterface>(TYPES.BookController).to(BookController).inSingletonScope();



	bind<RolesRepositoryInterface>(TYPES.RolesRepository).to(RolesRepository).inSingletonScope();


	bind<PgPoolService>(TYPES.DatabaseService).to(PgPoolService).inSingletonScope();
	bind<DatabaseConfig>(TYPES.DatabaseConfig).to(DatabaseConfig).inSingletonScope()

	bind<App>(TYPES.Application).to(App);
});

async function bootstrap(): Promise<IBootstrapReturn> {
	const appContainer = new Container();
	appContainer.load(appBindings);
	const app = appContainer.get<App>(TYPES.Application);
	await app.init();
	return { appContainer, app };
}

export const boot = bootstrap();
