import {CreateBookDto} from "./dto/create-book.dto";
import {UpdateBookDto} from "./dto/update-book.dto";
import {BookModel} from "../database/model/book.model";

export interface BookRepositoryInterface {
    findAll: () => Promise<BookModel[] | null>;
    //create: (dto: CreateBookDto) => Promise<BookModel | null>;
    //findById: (id: number) => Promise<BookModel | null>;
    //update: (dto: UpdateBookDto) => Promise<BookModel | null>;
    //delete: (id : number) => Promise<void>;
}