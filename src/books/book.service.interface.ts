import {NextFunction, Request, Response} from "express";
import {CreateBookDto} from "./dto/create-book.dto";
import {UpdateBookDto} from "./dto/update-book.dto";

export interface BookServiceInterface {
    findAll: () => Promise<void>;
    create: (dto: CreateBookDto) => Promise<void>;
    findById: (id: number) => Promise<void>;
    update: (dto: UpdateBookDto) => Promise<void>;
    delete: (id : number) => Promise<void>;
}