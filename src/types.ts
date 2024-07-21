export const TYPES = {
	Application: Symbol.for('Application'),
	ILogger: Symbol.for('ILogger'),
	UserController: Symbol.for('UserController'),
	UserService: Symbol.for('UserService'),

	BookService: Symbol.for('BookService'),
	BookRepository: Symbol.for('BookRepository'),
	BookController: Symbol.for('BookController'),

	GenresRepository: Symbol.for('GenresRepository'),
	BookGenresRepository: Symbol.for('BookGenresRepository'),


	MongoService : Symbol.for('MongoService'),

	ExeptionFilter: Symbol.for('ExeptionFilter'),
	ConfigService: Symbol.for('ConfigService'),
	PrismaService: Symbol.for('PrismaService'),
	DatabaseService: Symbol.for('DatabaseService'),
	UsersRepository: Symbol.for('UsersRepository'),
	RolesRepository: Symbol.for('RolesRepository'),
	DatabaseConfig: Symbol.for('DatabaseConfig'),
};
