import { Db, MongoClient, MongoClientOptions } from 'mongodb';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { Service } from 'typedi';
const DATABASE_URL = 'mongodb+srv://taha:taha@cluster0.13fmz.mongodb.net/myFirstDatabase?retryWrites=true&w=majority';
const DATABASE_NAME = 'scrabble';
// const DATABASE_COLLECTION = 'topscores';

@Service()
export class DatabaseService {
    mongoServer: MongoMemoryServer;
    private db: Db;
    private client: MongoClient;

    private options: MongoClientOptions = {};

    async start(url: string = DATABASE_URL): Promise<MongoClient | null> {
        if (!this.client) {
            this.mongoServer = new MongoMemoryServer();
            // const mongoUri = await this.mongoServer.getUri();
            this.client = await MongoClient.connect(url, this.options);
            this.db = this.client.db(DATABASE_NAME);
        }

        return this.client;
    }

    async closeConnection(): Promise<void> {
        if (this.client) {
            return this.client.close();
        } else {
            return Promise.resolve();
        }
    }

    get database(): Db {
        return this.db;
    }
}
