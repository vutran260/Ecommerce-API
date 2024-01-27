
import postgres from 'postgres';
import { drizzle } from 'drizzle-orm/postgres-js';


console.log("asdfasdfa", process.env.DATABASE_URL!);
const queryConnection = postgres(process.env.DATABASE_URL!);
export const  dbConnection = drizzle(queryConnection);


