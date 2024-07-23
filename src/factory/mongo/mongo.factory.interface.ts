import { MongoClient } from 'mongodb';

export interface MongoFactoryInterface {
	createClient(): MongoClient;
}
