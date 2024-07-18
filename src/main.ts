import express, {Express} from 'express';
import {Server} from 'http';
import {injectable} from 'inversify';
import 'reflect-metadata';

@injectable()
export class App {
    app: Express;
    server: Server;
    port: number;

    constructor(
    ) {
        this.app = express();
        this.port = 8000;
    }
    public async init(): Promise<void> {
        this.server = this.app.listen(this.port);
    }

    public close(): void {
        this.server.close();
    }
}
