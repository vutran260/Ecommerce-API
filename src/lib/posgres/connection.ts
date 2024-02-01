
import postgres from 'postgres';
import { drizzle, PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import *  as schema from '../../lib/posgres/schema';

const queryConnection = postgres(process.env.DATABASE_URL!);
export const  dbConnection : PostgresJsDatabase<typeof schema>  = drizzle(queryConnection, {schema});


