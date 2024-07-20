import {inject, injectable} from 'inversify';
import {TYPES} from '../types';
import {PgPoolService} from "../database/pg-pool.service";
import {RolesRepositoryInterface} from "./roles.repository.interface";
import {UserToRolesInterface} from "./user-to-roles.interface";
import {TypesRoles} from "./role.interface";


@injectable()
export class RolesRepository implements RolesRepositoryInterface {
    constructor(@inject(TYPES.DatabaseService) private databaseService: PgPoolService) {}


    async findByUserId(userId : number): Promise<UserToRolesInterface | null> {
        const query = 'SELECT * FROM user_roles WHERE id = $1;';
        const result = await this.databaseService.query(query, [userId]);
        if (result.length === 0) {
            return null;
        }
        const userRoles = result[0];
        return {
            userId: userId,
            roles : userRoles,
        }
    }

    async patchByUserId(userId: number, newRoles: TypesRoles[]): Promise<UserToRolesInterface> {
        await this.databaseService.query('BEGIN');

        try {
            await this.databaseService.query('DELETE FROM user_roles WHERE user_id = $1', [userId]);
            for (const newRole of newRoles) {
                await this.databaseService.query('INSERT INTO user_roles (user_id, role_value) VALUES ($1, $2)', [userId, newRole]);
            }
            await this.databaseService.query('COMMIT');
            const rolesQuery = 'SELECT role_value as value FROM user_roles WHERE user_id = $1;';
            const rolesResult = await this.databaseService.query(rolesQuery, [userId]);
            const updatedRoles: TypesRoles[] = rolesResult.map((role: { value: string }) => ({ value: role }));
            return { userId, roles: updatedRoles };

        } catch (error) {
            await this.databaseService.query('ROLLBACK');
            throw error;
        }
    }
}
