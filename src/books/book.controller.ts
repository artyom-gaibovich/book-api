import {inject, injectable} from 'inversify';
import {BaseController} from '../common/base.controller';
import {LoggerInterface} from '../logger/logger.interface';
import {TYPES} from '../types';
import 'reflect-metadata';
import {ConfigServiceInterface} from '../config/config.service.interface';
import {BookControllerInterface} from "./book.controller.interface";
import {NextFunction, Request, Response} from 'express';
import {CreateBookDto} from "./dto/create-book.dto";
import {BookServiceInterface} from "./book.service.interface";

@injectable()
export class BookController extends BaseController implements BookControllerInterface {
    constructor(
        @inject(TYPES.ILogger) private loggerService: LoggerInterface,
        @inject(TYPES.ConfigService) private configService: ConfigServiceInterface,
        @inject(TYPES.BookService) private bookService: BookServiceInterface,
    ) {
        super(loggerService);
        this.bindRoutes([
            {
                path: '/books',
                method: 'post',
                func: this.create,
                middlewares: [],
            },
            {
                path: '/books',
                method: 'get',
                func: this.create,
                middlewares: [],
            },

            {
                path: '/books/:id',
                method: 'get',
                func: this.create,
                middlewares: [],
            },
            {
                path: '/books/:id',
                method: 'put',
                func: this.create,
                middlewares: [],
            },
            {
                path: '/books/:id',
                method: 'delete',
                func: this.create,
                middlewares: [],
            },



        ]);
    }

    async create(req: Request<{}, {}, CreateBookDto>, res: Response, next: NextFunction): Promise<void> {

    }

    async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
    }

    async findAll(req: Request, res: Response, next: NextFunction): Promise<void> {
        return await this.bookService.findAll()
    }

    async findById(req: Request, res: Response, next: NextFunction): Promise<void> {

    }

    async update(req: Request, res: Response, next: NextFunction): Promise<void> {
    }



}
