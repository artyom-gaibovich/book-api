import {BookServiceInterface} from "./book.service.interface";
import { CreateBookDto } from "./dto/create-book.dto";
import { UpdateBookDto } from "./dto/update-book.dto";

export class BookService implements BookServiceInterface {
    async findById(id : number) {

    }
}