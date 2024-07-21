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
import {BookService} from "./book.service";

interface ReqParams {
    id : number;
}

@injectable()
export class BookController extends BaseController implements BookControllerInterface {
    constructor(
        @inject(TYPES.ILogger) private loggerService: LoggerInterface,
        @inject(TYPES.ConfigService) private configService: ConfigServiceInterface,
        @inject(TYPES.BookService) private bookService: BookService,
    ) {
        super(loggerService);
        this.bindRoutes([
            {
                path: '',
                method: 'post',
                func: this.create,
                middlewares: [],
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
                middlewares: [],
            },
            {
                path: '/:id',
                method: 'put',
                func: this.update,
                middlewares: [],
            },
            {
                path: '/:id',
                method: 'delete',
                func: this.delete,
                middlewares: [],
            },



        ]);
    }

    async create(req: Request<{}, {}, CreateBookDto>, res: Response, next: NextFunction): Promise<void> {
        const {title, author, publicationDate, genres} = req.body
        this.ok(res, await this.bookService.createBook({title, author, publicationDate, genres}));
    }

    async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
        const {id} = req.params;
        this.ok(res,await this.bookService.deleteBook(id));
    }

    async findAll(req: Request, res: Response, next: NextFunction): Promise<any> {
        const books = await this.bookService.getBooks();
        this.ok(res, {books});
    }

    async findById(req: Request<any,{},{}>, res: Response, next: NextFunction): Promise<void> {
        const {id} = req.params;
        this.ok(res,await this.bookService.getBookById(id));
    }

    async update(req: Request, res: Response, next: NextFunction): Promise<void> {
        const {id} = req.params;
        const {title, author, publicationDate, genres} = req.body
        this.ok(res, await this.bookService.updateBook(id, {title, author, publicationDate, genres}));

    }



}
