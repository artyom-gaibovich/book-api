import {Container, ContainerModule, interfaces} from 'inversify';
import {App} from './app';
import {ConfigService} from './config/config.service';
import {IConfigService} from './config/config.service.interface';
import {ExeptionFilter} from './errors/exeption.filter';
import {IExeptionFilter} from './errors/exeption.filter.interface';
import {ILogger} from './logger/logger.interface';
import {LoggerService} from './logger/logger.service';
import {TYPES} from './types';
import {UserController} from './users/users.controller';
import {IUserController} from './users/users.controller.interface';
import {UsersRepository} from './users/users.repository';
import {UsersRepositoryInterface} from './users/users.repository.interface';
import {UserService} from './users/users.service';
import {IUserService} from './users/users.service.interface';
import {PgPoolService} from "./database/pg-pool.service";
import {DatabaseConfig} from "./database/database.config";
import {RolesRepositoryInterface} from "./roles/roles.repository.interface";
import {RolesRepository} from "./roles/roles.repository";

export interface IBootstrapReturn {
	appContainer: Container;
	app: App;
}

export const appBindings = new ContainerModule((bind: interfaces.Bind) => {
	bind<ILogger>(TYPES.ILogger).to(LoggerService).inSingletonScope();
	bind<IExeptionFilter>(TYPES.ExeptionFilter).to(ExeptionFilter);
	bind<IUserController>(TYPES.UserController).to(UserController);
	bind<IUserService>(TYPES.UserService).to(UserService);




	bind<IConfigService>(TYPES.ConfigService).to(ConfigService).inSingletonScope();
	bind<UsersRepositoryInterface>(TYPES.UsersRepository).to(UsersRepository).inSingletonScope();
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
