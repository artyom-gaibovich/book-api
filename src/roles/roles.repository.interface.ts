import {UserToRolesInterface} from "./user-to-roles.interface";
import {TypesRoles} from "./role.types";

export interface RolesRepositoryInterface {
    findByUserId: (userId: number) => Promise<UserToRolesInterface | null>
    deleteByUserId: (userId : number) => Promise<void>
    create: (userId: number, newRoles: TypesRoles[]) => Promise<void>
}