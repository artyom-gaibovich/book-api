import {UserToRolesInterface} from "./user-to-roles.interface";
import {RoleInterface} from "./role.interface";

export interface RolesRepositoryInterface {
    findByUserId(userId: number) : Promise<UserToRolesInterface | null>
    patchByUserId(userId: number, newRoles : RoleInterface[]) : Promise<UserToRolesInterface | null>
}