import {TypesRoles} from "./role.interface";
import {User} from "../users/user.entity";

export interface UserToRolesInterface {
    userId : number,
    roles  : TypesRoles[]
}

export class UserToToRoles implements UserToRolesInterface{
    userId : number;
    roles  : TypesRoles[];
}