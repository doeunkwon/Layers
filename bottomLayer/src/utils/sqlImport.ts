import postgres from "postgres";
import { Pool } from "pg";
import advisoryLock from "advisory-lock";
import dotenv from "dotenv";
dotenv.config();

const { PG_USER, PG_PASSWORD, PG_HOST, PG_DATABASE, ENDPOINT_ID } = process.env;

const checkValues = (value: string | undefined): string => {
  if (value === undefined) {
    return "";
  }

  return value;
};

const POSTGRES_URL = `postgres://${checkValues(PG_USER)}:${checkValues(
  PG_PASSWORD
)}@${checkValues(PG_HOST)}/${checkValues(
  PG_DATABASE
)}?options=project%3D${checkValues(ENDPOINT_ID)}&sslmode=require`;

export const sql = postgres(POSTGRES_URL);

export const pool = new Pool({
  connectionString: POSTGRES_URL,
  // ssl: true,
});

export const mutex = advisoryLock(POSTGRES_URL) (
  "database-lock"
)
