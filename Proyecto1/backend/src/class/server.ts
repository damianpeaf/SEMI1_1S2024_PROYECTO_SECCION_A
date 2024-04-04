import express, { type Application } from 'express';
import http from 'http';
import cors from 'cors';

import env from '#/config/env';
import router from './router';

class Server {
    private static instance: Server;
    private app: Application;
    private port: number;
    private server: http.Server;

    private constructor() {
        this.app = express();
        this.app.use(cors());
        this.port = +env.PORT;
        this.server = http.createServer(this.app);
    }

    private middlewares(): void {
        this.app.set('trust proxy', true);
        this.app.use(express.json());
        this.app.use(express.urlencoded({ extended: true }));
    }

    private routes(): void {
        try {
            this.app.use('/api', router)
        } catch (error) {
            console.error(error);
        }
    }

    public start(): void {

        this.middlewares();
        this.routes();

        this.server.listen(this.port, () => {
            console.log(`Server running on port ${this.port} with bun`);
        });
    }

    public static getInstance(): Server {
        if (!Server.instance) {
            Server.instance = new Server();
        }
        return Server.instance;
    }
}

export default Server;
