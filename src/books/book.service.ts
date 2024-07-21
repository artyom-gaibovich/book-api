import {BookServiceInterface} from "./book.service.interface";
import { CreateBookDto } from "./dto/create-book.dto";
import { UpdateBookDto } from "./dto/update-book.dto";
import {inject, injectable} from "inversify";
import {TYPES} from "../types";
import {ConfigServiceInterface} from "../config/config.service.interface";
import {UsersRepositoryInterface} from "../users/users.repository.interface";
import {RolesRepositoryInterface} from "../roles/roles.repository.interface";
import {BookRepositoryInterface} from "./book.repository.interface";
import {BookModel} from "./book.model";
import {BookInterface} from "./book.interface";
import {GenresRepositoryInterface} from "../genres/genres.repository.interface";
import {GenreModel} from "../genres/genre.model";
import {BookGenresRepositoryInterface} from "../book-genres/book-genres.repository.interface";


@injectable()
export class BookService implements BookServiceInterface {

    constructor(
        @inject(TYPES.ConfigService) private configService: ConfigServiceInterface,
        @inject(TYPES.BookRepository) private bookRepository: BookRepositoryInterface,
        @inject(TYPES.GenresRepository) private genresRepository: GenresRepositoryInterface,
        @inject(TYPES.BookGenresRepository) private bookGenresRepository: BookGenresRepositoryInterface,
    ) {}

    async findAll(): Promise<any | null>  {
        return await this.bookGenresRepository.findAll()
    }
    async findById(id:number): Promise<any | null>  {
        return await this.bookGenresRepository.findByBookId(id)
    }
    async create(): P

}