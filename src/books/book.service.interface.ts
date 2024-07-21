import {NextFunction, Request, Response} from "express";
import {CreateBookDto} from "./dto/create-book.dto";
import {UpdateBookDto} from "./dto/update-book.dto";
import {BookModel} from "../database/model/book.model";

export interface BookServiceInterface {
    findAll: () => Promise<BookModel[] | null>;
    create: (dto: CreateBookDto) => Promise<void>;
    findById: (id: number) => Promise<BookModel | null>;
    update: (dto: UpdateBookDto) => Promise<void>;
    delete: (id : number) => Promise<void>;
}