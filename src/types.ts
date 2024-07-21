export const TYPES = {
	Application: Symbol.for('Application'),
	Logger: Symbol.for('Logger'),
	UserController: Symbol.for('UserController'),
	UserService: Symbol.for('UserService'),

	BookService: Symbol.for('BookService'),
	BookRepository: Symbol.for('BookRepository'),
	BookController: Symbol.for('BookController'),

	MongoClientFactory: Symbol.for('MongoClientFactory'),


	GenresRepository: Symbol.for('GenresRepository'),
	BookGenresRepository: Symbol.for('BookGenresRepository'),


	MongoService : Symbol.for('MongoService'),

	ExceptionFilter: Symbol.for('ExceptionFilter'),
	ConfigService: Symbol.for('ConfigService'),
	PrismaService: Symbol.for('PrismaService'),
	DatabaseService: Symbol.for('DatabaseService'),
	UsersRepository: Symbol.for('UsersRepository'),
	RolesRepository: Symbol.for('RolesRepository'),
	DatabaseConfig: Symbol.for('DatabaseConfig'),


	PgPoolFactory: Symbol.for('PgPoolFactory')
};
