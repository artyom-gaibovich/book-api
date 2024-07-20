import { NextFunction, Request, Response } from 'express';

export interface BookControllerInterface {
    findAll: (req: Request, res: Response, next: NextFunction) => void;
    create: (req: Request, res: Response, next: NextFunction) => void;
    findById: (req: Request, res: Response, next: NextFunction) => void;
    update: (req: Request, res: Response, next: NextFunction) => void;
    delete: (req: Request, res: Response, next: NextFunction) => void;
}
