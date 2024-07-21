import {NextFunction, Request, Response} from "express";
import {CreateBookDto} from "./dto/create-book.dto";
import {UpdateBookDto} from "./dto/update-book.dto";
import {BookModel} from "./book.model";
import {BookInterface} from "./book.interface";
import {GenreModel} from "../genres/genre.model";

export interface BookServiceInterface {
    findAll(): Promise<any | null>;
    findById(id: number): Promise<any | null>;
    create(book: BookInterface): Promise<BookInterface | null>;
    //delete(id: number): Promise<null>;
    //update(id: number, book: BookInterface): Promise<BookInterface | null>;
}