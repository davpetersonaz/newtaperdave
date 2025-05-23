//app/lib/db.ts
import { Pool } from "pg";
import 'dotenv/config';

// Convert port from string | undefined to number | undefined
const port = process.env.PGSQL_PORT ? parseInt(process.env.PGSQL_PORT, 10) : 5432;
const conn: Pool = new Pool({
    connectionString: process.env.DB_URL,
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
});

// Generic database query function
export async function doSelect<T>(query: string, values?: any[]): Promise<T[]> {
	const result = ( values ? await conn.query(query, values) : await conn.query(query) );
	return result.rows;
}

export default conn;

/*
DROP TABLE IF EXISTS public.shows;
CREATE TABLE IF NOT EXISTS public.shows
(
    show_id uuid NOT NULL DEFAULT uuid_generate_v4(),
    artist text COLLATE pg_catalog."default" NOT NULL,
    artist_sort text COLLATE pg_catalog."default" NOT NULL,
    showdate text COLLATE pg_catalog."default" NOT NULL,
    venue text COLLATE pg_catalog."default",
    city text COLLATE pg_catalog."default",
    city_state text COLLATE pg_catalog."default",
    sources smallint,
    pcloudlink text COLLATE pg_catalog."default",
    archivelink text COLLATE pg_catalog."default",
    samplefile text COLLATE pg_catalog."default",
    venue_logo text COLLATE pg_catalog."default",
    venue_logo_h integer,
    venue_logo_w integer,
    artist_wide text COLLATE pg_catalog."default",
    artist_wide_h integer,
    artist_wide_w integer,
    artist_square text COLLATE pg_catalog."default",
    artist_square_h integer,
    artist_square_w integer,
    setlist text COLLATE pg_catalog."default",
    CONSTRAINT shows_pkey PRIMARY KEY (show_id)
)

DROP TABLE IF EXISTS public.sources;
CREATE TABLE IF NOT EXISTS public.sources
(
    id smallint NOT NULL,
    sourcetext text COLLATE pg_catalog."default"
)
*/