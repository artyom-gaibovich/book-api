import {PoolConfig} from "pg";
import {inject, injectable} from "inversify";
import {TYPES} from "../types";
import {ConfigService} from "../config/config.service";

@injectable()
export class DatabaseConfig {

    constructor(@inject(TYPES.ConfigService) private configService: ConfigService) {
    }

    getPoolConfig(): PoolConfig {
        return {
            user: this.configService.get('PG_USER'),
            host: this.configService.get('PG_HOST'),
            database: this.configService.get('PG_DATABASE'),
            password: this.configService.get('PG_PASSWORD'),
            port: Number(this.configService.get('PG_PORT')),
        };
    }
}