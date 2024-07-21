import {BookServiceInterface} from "./book.service.interface";
import { CreateBookDto } from "./dto/create-book.dto";
import { UpdateBookDto } from "./dto/update-book.dto";
import {inject, injectable} from "inversify";
import {TYPES} from "../types";
import {ConfigServiceInterface} from "../config/config.service.interface";
import {UsersRepositoryInterface} from "../users/users.repository.interface";
import {RolesRepositoryInterface} from "../roles/roles.repository.interface";
import {BookRepositoryInterface} from "./book.repository.interface";
import {BookModel} from "../database/model/book.model";


@injectable()
export class BookService implements BookServiceInterface {

    constructor(
        @inject(TYPES.ConfigService) private configService: ConfigServiceInterface,
        @inject(TYPES.BookRepository) private bookRepository: BookRepositoryInterface,
    ) {}


    async findAll() : Promise<BookModel[] | null>{
        const result = this.bookRepository.findAll();
        if (!result) {
            return null
        }
        return result;

    };
    create: (dto: CreateBookDto) => Promise<void>;
    update: (dto: UpdateBookDto) => Promise<void>;
    delete: (id: number) => Promise<void>;
    async findById(id : number) {
        const result = this.bookRepository.findById(id)
        if (!result) {
            return null
        }
        return result;
    }
}