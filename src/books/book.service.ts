import {BookServiceInterface} from "./book.service.interface";
import { CreateBookDto } from "./dto/create-book.dto";
import { UpdateBookDto } from "./dto/update-book.dto";
import {inject} from "inversify";
import {TYPES} from "../types";
import {ConfigServiceInterface} from "../config/config.service.interface";
import {UsersRepositoryInterface} from "../users/users.repository.interface";
import {RolesRepositoryInterface} from "../roles/roles.repository.interface";
import {BookRepositoryInterface} from "./book.repository.interface";

export class BookService implements BookServiceInterface {

    constructor(
        @inject(TYPES.ConfigService) private configService: ConfigServiceInterface,
        @inject(TYPES.BookRepository) private bookRepository: BookRepositoryInterface,
    ) {}


    findAll: () => Promise<void>;
    create: (dto: CreateBookDto) => Promise<void>;
    update: (dto: UpdateBookDto) => Promise<void>;
    delete: (id: number) => Promise<void>;
    async findById(id : number) {

    }
}