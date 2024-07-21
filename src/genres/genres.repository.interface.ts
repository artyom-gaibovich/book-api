import {GenreModel} from "./genre.model";

export interface GenresRepositoryInterface {
    findById(id: number): Promise<GenreModel | null>;
}